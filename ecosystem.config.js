// ecosystem.config.js
module.exports = {
    apps: [{
        name: "mi-app-artesanos", // Puedes cambiar este nombre si lo deseas
        script: "./app.js",      // Asegúrate de que esta ruta sea la correcta a tu archivo principal
        instances: "max",        // Utiliza el máximo de CPUs disponibles para clúster
        exec_mode: "cluster",    // Habilita el modo clúster
        watch: false,            // Deshabilitar watch en producción es crucial
        ignore_watch: ["node_modules", "logs"],
        merge_logs: true,
        log_file: "logs/app.log",
        error_file: "logs/err.log",
        out_file: "logs/out.log",

        // Variables de entorno generales (pueden ser para desarrollo, por ejemplo)
        env: {
            NODE_ENV: "development",
            PORT: 3003, // Puedes poner las mismas por si acaso
            HOST: "localhost",
            // ... otras variables para desarrollo si las tuvieras
        },

        // Variables de entorno específicas para el ambiente de PRODUCCIÓN
        env_production: {
            NODE_ENV: "production", // ¡Importante para producción!
            PORT: 3003,
            HOST: "localhost",

            DB_HOST: "localhost",
            DB_USER: "root",
            DB_PASSWORD: "nicolas89",
            DB_DATABASE: "mpd_artesanos", // Cambiado a DB_DATABASE para coincidir con tu lista
            DB_PORT: 3306,

            SESSION_SECRET: "nicolas89",

            REDIS_URL: "redis://localhost:6379",

            // Atención: Generalmente JWTSECRET y PASSEMAIL son muy sensibles
            // y se manejan mejor fuera del archivo de configuración (ej. con secretos del SO)
            // Sin embargo, si los tienes aquí, PM2 los cargará.
            JWTSECRET: "$2b$10$LDs84NnwMC48/PSF9lMOo.AJJ794AB4r79mCmVZqQJ77JpSW0Kr82",

            EMAIL: "artesanos.mpd@gmail.com",
            PASSEMAIL: "edarauhwijpipdrq"
        }
    }]
};