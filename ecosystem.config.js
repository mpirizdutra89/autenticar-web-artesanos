module.exports = {
    apps: [{
        name: "artesanos-app",
        script: "./app.js", // O el nombre de tu archivo principal
        instances: "max",
        exec_mode: "cluster",
        env: {
            NODE_ENV: "production",
            PORT: 3003,
            HOST: "localhost",
            DB_HOST: "localhost",
            DB_USER: "root",
            DB_PASSWORD: "nicolas89",
            SESSION_SECRET: "nicolas89",
            DB_NAME: "mpd_artesanos",
            REDIS_URL: "redis://localhost:6379", // ¡Ajusta esta si Redis no es localhost!
            JWTSECRET: "$2b$10$LDs84NnwMC48/PSF9lMOo.AJJ794AB4r79mCmVZqQJ77JpSW0Kr82",
            EMAIL: "artesanos.mpd@gmail.com",
            PASSEMAIL: "edarauhwijpipdrq"
        }
    }]
};