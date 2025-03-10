import 'dotenv/config';

const config = {
  url: process.env.LDAP_URL,
  baseDN: process.env.LDAP_BASE_DN,
  bindDN: process.env.LDAP_BIND_DN,
  bindCredentials: process.env.LDAP_BIND_CREDENTIALS
};

const fallbackConfig = {
  url: process.env.LDAP_URL_FALLBACK,
  baseDN: process.env.LDAP_BASE_DN,
  bindDN: process.env.LDAP_BIND_DN,
  bindCredentials: process.env.LDAP_BIND_CREDENTIALS,
};

export { config, fallbackConfig };
