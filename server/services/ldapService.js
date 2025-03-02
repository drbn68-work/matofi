import ldap from 'ldapjs';
import config from '../config/ldapConfig.js';

class LDAPService {
  constructor() {
    this.client = ldap.createClient({
      url: config.url,
      reconnect: true,
      tlsOptions: { rejectUnauthorized: false }
    });

    this.client.on('error', (err) => {
      console.error('🚨 LDAP connection error:', err);
    });
  }

  async authenticate(username, password) {
    return new Promise((resolve, reject) => {
      // Log de depuración: mostrar el DN y la contraseña de bind
      console.log("Intentando bind con:", {
        bindDN: config.bindDN,
        bindCredentials: config.bindCredentials
      });
  
      // Bind inicial con FP\matofi_bind
      this.client.bind(config.bindDN, config.bindCredentials, (bindErr) => {
        if (bindErr) {
          console.error("🚨 Error en bind inicial:", bindErr);
          return reject(new Error('Error en la conexión al servidor LDAP'));
        }
        console.log("✅ Bind inicial exitoso con", config.bindDN);

        // Búsqueda por sAMAccountName, solicitando atributos adicionales
        const searchOptions = {
          scope: 'sub',
          filter: `(sAMAccountName=${username})`,
          attributes: ['dn', 'cn', 'sAMAccountName', 'mail', 'department']
        };

        this.client.search(config.baseDN, searchOptions, (searchErr, res) => {
          if (searchErr) {
            console.error("🚨 Error al buscar el usuario en LDAP:", searchErr);
            return reject(searchErr);
          }

          let userFound = false;

          res.on('searchEntry', (entry) => {
            userFound = true;
            console.log("🔍 Entrada LDAP recibida:", entry);

            // Obtener el DN: se usa entry.object.dn o entry.objectName y se convierte a cadena
            let rawDN = (entry.object && entry.object.dn) || entry.objectName;
            const userDN = rawDN && typeof rawDN.toString === 'function' ? rawDN.toString() : rawDN;
            if (!userDN || typeof userDN !== 'string' || userDN.trim() === "") {
              console.error("❌ Error: No se encontró un DN válido para el usuario", entry);
              return reject(new Error('Error interno: No se encontró DN del usuario'));
            }

            // Reconstruir datos del usuario:
            let entryData = null;
            if (entry.object && Object.keys(entry.object).length > 0) {
              entryData = entry.object;
            } else if (entry.pojo) {
              entryData = {};
              if (Array.isArray(entry.pojo.attributes)) {
                entry.pojo.attributes.forEach(attr => {
                  // Forzamos la clave a minúsculas para consistencia
                  entryData[attr.type.toLowerCase()] = attr.values[0];
                });
              }
              // Asignamos el DN usando objectName
              entryData.dn = entry.pojo.objectName;
              console.log("🔎 Se reconstruyó entryData desde 'entry.pojo':", entryData);
            }
            if (!entryData) {
              console.error("❌ Error: No se pudo extraer datos del usuario:", entry);
              return reject(new Error('Error interno: No se pudo extraer datos del usuario'));
            }

            console.log("✅ Usuario encontrado:", entryData);
            console.log("🔑 Intentando autenticar con DN:", userDN);
            console.log("🔑 Tipo de password recibido:", typeof password);
            console.log("🔑 Password recibido (enmascarado):", password ? '*'.repeat(password.length) : "No definido");

            if (typeof userDN !== 'string' || typeof password !== 'string') {
              console.error("❌ Error: `userDN` o `password` no son cadenas válidas", { userDN, password });
              return reject(new Error('Error interno: Formato inválido de credenciales'));
            }

            // Bind con las credenciales del usuario
            this.client.bind(userDN, password, (err) => {
              if (err) {
                console.error("❌ Error en autenticación del usuario:", err);
                return reject(new Error('Credenciales inválidas'));
              }

              console.log("🔓 Autenticación exitosa para", username);
              // Devuelve el objeto de usuario, dejando costCenter vacío
              resolve({
                success: true,
                user: {
                  username: entryData.samaccountname,
                  fullName: entryData.cn,
                  department: entryData.department || "",
                  email: entryData.mail || "",
                  costCenter: ""  // Se deja vacío para que el usuario lo complete posteriormente
                }
              });
            });
          });

          res.on('error', (err) => {
            console.error("🚨 Error en búsqueda de usuario:", err);
            reject(err);
          });

          res.on('end', () => {
            if (!userFound) {
              console.error("❌ Usuario no encontrado en LDAP");
              reject(new Error('Usuario no encontrado'));
            }
          });
        });
      });
    });
  }
}

export default new LDAPService();
