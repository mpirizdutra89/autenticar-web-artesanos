module.exports = {
    apps: [{
        name: "artesanos1",
        script: "./app.js",
        env: {
            NODE_ENV: "production",
            PORT: 3003,
            HOST: "localhost",
            DB_HOST: "localhost",
            DB_USER: "root",
            DB_PASSWORD: "nicolas89",
            SESSION_SECRET: "nicolas89",
            DB_NAME: "mpd_artesanos",
            REDIS_URL: "redis://<IP_INTERNA_DE_REDIS_EN_LA_VPN>:6379", // ¡AJUSTA AQUÍ!
            JWTSECRET: "$2b$10$LDs84NnwMC48/PSF9lMOo.AJJ794AB4r79mCmVZqQJ77JpSW0Kr82",
            EMAIL: "artesanos.mpd@gmail.com",
            PASSEMAIL: "edarauhwijpipdrq"
        }
    }]
};