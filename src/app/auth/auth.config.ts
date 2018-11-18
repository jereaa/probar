import { ENV } from "../core/env.config";

export const AUTH_CONFIG = {
    CLIENT_ID: "JVgp5IHY2nwMzQxdtxtlRrVxhhl0c4hW",
    DOMAIN: "jereaa.auth0.com",
    AUDIENCE: "https://probar-barras.com/api",
    RESPONSE_TYPE: "token id_token",
    REDIRECT: `${ENV.BASE_URI}/callback`,
    SCOPE: "openid profile email",
    NAMESPACE: "https://jereaa.com/",
    SILENT_REDIRECT: `${ENV.SILENT_URI}`
};
