import ldap from 'ldapjs';
import { config, fallbackConfig } from '../config/ldapConfig.js';

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
    // Intentamos con el LDAP principal (cliente creado en el constructor)
    try {
      console.log("Intentando autenticación con el LDAP primario");
      return await this._authenticateWithConfig(config, username, password, this.client);
    } catch (primaryError) {
      console.error("Error en LDAP primario:", primaryError.message);
      // Si falla, creamos un nuevo cliente con la configuración de respaldo
      const fallbackClient = ldap.createClient({
        url: fallbackConfig.url,
        reconnect: true,
        tlsOptions: { rejectUnauthorized: false }
      });
      fallbackClient.on('error', (err) => {
        console.error('🚨 LDAP fallback connection error:', err);
      });
      console.log("Intentando autenticación con el LDAP secundario (fallback)");
      return await this._authenticateWithConfig(fallbackConfig, username, password, fallbackClient);
    }
  }

  /**
   * Función auxiliar que realiza el proceso de bind inicial, búsqueda del usuario
   * y autenticación del usuario usando la configuración pasada.
   * Se conserva la lógica original (incluida la reconstrucción con 'pojo').
   * Solo se modifica la parte de bind con las credenciales del usuario para
   * usar un DN simple (por ejemplo, "fp\<username>") en lugar del obtenido.
   * Además, si la variable de entorno SKIP_LDAP_AUTH está activada,
   * se omite la validación de la contraseña para pruebas.
   * @param {Object} currentConfig Configuración (principal o fallback).
   * @param {string} username 
   * @param {string} password 
   * @param {Object} client Cliente LDAP a utilizar.
   * @returns {Promise<Object>}
   */
  _authenticateWithConfig(currentConfig, username, password, client) {
    return new Promise((resolve, reject) => {
      console.log("Intentando bind con:", {
        bindDN: currentConfig.bindDN,
        bindCredentials: currentConfig.bindCredentials
      });

      // Bind inicial con la cuenta de servicio
      client.bind(currentConfig.bindDN, currentConfig.bindCredentials, (bindErr) => {
        if (bindErr) {
          client.unbind();
          return reject(new Error(`Error en bind inicial con ${currentConfig.url}: ${bindErr.message}`));
        }
        console.log("✅ Bind inicial exitoso con", currentConfig.bindDN);

        // Búsqueda por sAMAccountName, solicitando atributos adicionales,
        // Use "employeeNumber" (capital N) to match your LDAP screenshot
        const searchOptions = {
          scope: 'sub',
          filter: `(sAMAccountName=${username})`,
          attributes: ['dn', 'cn', 'sAMAccountName', 'mail', 'department', 'employeeNumber']
        };

        client.search(currentConfig.baseDN, searchOptions, (searchErr, res) => {
          if (searchErr) {
            client.unbind();
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
            console.log("🔑 Intentando autenticar con DN obtenido:", userDN);
            console.log("🔑 Tipo de password recibido:", typeof password);
            console.log("🔑 Password recibido (enmascarado):", password ? '*'.repeat(password.length) : "No definido");

            if (typeof userDN !== 'string' || typeof password !== 'string') {
              console.error("❌ Error: `userDN` o `password` no son cadenas válidas", { userDN, password });
              return reject(new Error('Error interno: Formato inválido de credenciales'));
            }

            // Admin check: use environment variable ADMIN_EMPLOYEES (e.g., "133,6912,625")
            const adminEmployeeNumbersStr = process.env.ADMIN_EMPLOYEES || "";
            const adminEmployeeNumbers = adminEmployeeNumbersStr.split(",").map(num => num.trim());
            // Check both 'employeeNumber' and 'employeenumber'
            const isAdmin = adminEmployeeNumbers.includes(String(entryData.employeeNumber || entryData.employeenumber));


            // En lugar de usar el DN obtenido, se construye un simple DN: "fp\<username>"
            const simpleDN = `fp\\${username}`;
            console.log("🔑 Intentando autenticar con DN simple:", simpleDN);

            // Modo pruebas: si SKIP_LDAP_AUTH está activado, se omite la validación de la contraseña.
            if (process.env.SKIP_LDAP_AUTH === "true") {
              console.log("⚠️ Modo pruebas activado: se omite la validación de la contraseña.");
              client.unbind();
              return resolve({
                success: true,
                user: {
                  username: entryData.sAMAccountName || entryData.samaccountname,
                  fullName: entryData.cn,
                  department: entryData.department || "",
                  email: entryData.mail || "",
                  costCenter: "",  // Se deja vacío para que el usuario lo complete posteriormente
                  isAdmin: isAdmin
                }
              });
            }

            // Bind con las credenciales del usuario usando el simple DN
            client.bind(simpleDN, password, (err) => {
              client.unbind();
              if (err) {
                console.error("❌ Error en autenticación del usuario:", err);
                return reject(new Error('Credenciales inválidas'));
              }

              console.log("🔓 Autenticación exitosa para", username);
              resolve({
                success: true,
                user: {
                  username: entryData.sAMAccountName || entryData.samaccountname,
                  fullName: entryData.cn,
                  department: entryData.department || "",
                  email: entryData.mail || "",
                  costCenter: "",  // Se deja vacío para que el usuario lo complete posteriormente
                  isAdmin: isAdmin
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
