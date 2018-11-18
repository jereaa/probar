export const CONFIG = {
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/probar",
    PORT: process.env.PORT || "8083",

    AUTH0_ISSUER: "https://jereaa.auth0.com/",
    AUTH0_NAMESPACE: "https://jereaa.com/",
    AUTH0_AUDIENCE: "https://probar-barras.com/api"
};
