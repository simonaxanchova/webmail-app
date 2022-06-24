export const SETTINGS = {
  API_URL: process.env.REACT_APP_API_SERVER_URL.includes("localhost")
    ? process.env.REACT_APP_API_SERVER_URL
    : window.location.origin + "/api/",
  API_AUTHORIZATION_HEADER: process.env.REACT_APP_API_AUTHORIZATION_HEADER,
  APP_NAME: process.env.REACT_APP_APP_NAME,
  AUDIT_LOG_TYPES: [
    { name: "users_audit_log", value: "USERS_AUD" },
    { name: "groups_audit_log", value: "GROUPS_AUD" },
    { name: "system_settings_audit_log", value: "SYSTEM_SETTINGS_PROPS_AUD" },
  ],
  UVMK_CENTAR_REGISTRYAREA_ID: "8a94e4004cb6972a014cbc487569385d",
  LANGUAGES: [
    {
      label: "mk",
      value: "mk",
    },
    {
      label: "gb",
      value: "en",
    },
  ],
};
