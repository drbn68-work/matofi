require('dotenv').config();

module.exports = {
  url: process.env.LDAP_URL || 'ldap://your-ldap-server:389',
  baseDN: process.env.LDAP_BASE_DN || 'dc=example,dc=com',
  bindDN: process.env.LDAP_BIND_DN || 'cn=admin,dc=example,dc=com',
  bindCredentials: process.env.LDAP_BIND_CREDENTIALS || 'admin_password'
};
