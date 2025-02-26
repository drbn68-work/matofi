
const ldap = require('ldapjs');
const config = require('../config/ldapConfig');

class LDAPService {
  constructor() {
    this.client = ldap.createClient({
      url: config.url,
      reconnect: true
    });

    this.client.on('error', (err) => {
      console.error('LDAP connection error:', err);
    });
  }

  async authenticate(username, password, costCenter) {
    return new Promise((resolve, reject) => {
      // Primero buscamos al usuario
      const searchOptions = {
        scope: 'sub',
        filter: `(&(uid=${username})(costCenter=${costCenter}))`,
        attributes: ['dn', 'cn', 'uid', 'departmentNumber']
      };

      this.client.bind(config.bindDN, config.bindCredentials, (bindErr) => {
        if (bindErr) {
          console.error('Error en bind inicial:', bindErr);
          return reject(bindErr);
        }

        this.client.search(config.baseDN, searchOptions, (searchErr, res) => {
          if (searchErr) {
            console.error('Error en búsqueda:', searchErr);
            return reject(searchErr);
          }

          let userFound = false;

          res.on('searchEntry', (entry) => {
            userFound = true;
            const userDN = entry.objectName;
            const userData = entry.attributes.reduce((acc, attr) => {
              acc[attr.type] = attr.vals[0];
              return acc;
            }, {});

            // Intentamos autenticar con las credenciales del usuario
            this.client.bind(userDN, password, (err) => {
              if (err) {
                console.error('Error en autenticación:', err);
                return reject(new Error('Credenciales inválidas'));
              }

              resolve({
                success: true,
                user: {
                  username: userData.uid,
                  fullName: userData.cn,
                  department: userData.departmentNumber,
                  costCenter: costCenter
                }
              });
            });
          });

          res.on('error', (err) => {
            console.error('Error en búsqueda:', err);
            reject(err);
          });

          res.on('end', () => {
            if (!userFound) {
              reject(new Error('Usuario no encontrado'));
            }
          });
        });
      });
    });
  }
}

module.exports = new LDAPService();