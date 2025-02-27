require('dotenv').config();

module.exports = {
  url: process.env.LDAP_URL || 'ldap://192.168.100.68:389',
  baseDN: process.env.LDAP_BASE_DN || 'dc=fp,dc=local',
  bindDN: process.env.LDAP_BIND_DN || 'uid=binduser,cn=users,dc=fundacio-puigvert,dc=com',
  bindCredentials: process.env.LDAP_BIND_CREDENTIALS || 'j15V$I62V48jxI7'
};
