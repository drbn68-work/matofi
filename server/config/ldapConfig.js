import 'dotenv/config';

const config = {
  url: process.env.LDAP_URL || 'ldaps://192.168.100.50:636',
  baseDN: process.env.LDAP_BASE_DN || 'CN=Users,DC=fp,DC=local',
  bindDN: process.env.LDAP_BIND_DN || 'FP\\matofi_bind',
  bindCredentials: process.env.LDAP_BIND_CREDENTIALS || '53Z=J*gj8A^4'
};

export default config; 
