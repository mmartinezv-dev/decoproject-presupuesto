'use strict';

const { existsSync } = require('fs');
const environment = existsSync('./ecosystem.config.js')
  ? require('./ecosystem.config.js').apps?.[0]?.env
  : process.env;

if (!environment?.DB_HOST || !environment.DB_USER || !environment.DB_NAME) {
  throw new Error('Falta la configuracion de base de datos');
}

Object.assign(process.env, environment);

const { AppDataSource } = require('./dist/infrastructure/config/data-source');

async function run() {
  await AppDataSource.initialize();
  try {
    const migrations = await AppDataSource.runMigrations({ transaction: 'each' });
    console.log(
      migrations.length
        ? `Migraciones aplicadas: ${migrations.map((migration) => migration.name).join(', ')}`
        : 'Base de datos al dia',
    );
  } finally {
    await AppDataSource.destroy();
  }
}

run().catch((error) => {
  console.error('Error ejecutando migraciones:', error);
  process.exitCode = 1;
});
