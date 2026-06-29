// Load environment variables from ecosystem.config.js FIRST
const config = require('./ecosystem.config.js');
const env = config.apps[0].env;
for (const [k, v] of Object.entries(env)) {
  process.env[k] = v;
}

// NOW require AppDataSource
const { AppDataSource } = require('./dist/infrastructure/config/data-source');

AppDataSource.initialize()
  .then(async () => {
    console.log("=== Sincronizando base de datos ===");
    await AppDataSource.synchronize(false); // Sincroniza el esquema sin borrar datos
    console.log("✓ Base de datos sincronizada con éxito.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error en la sincronización:", err);
    process.exit(1);
  });
