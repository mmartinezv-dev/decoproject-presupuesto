'use strict';

const {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  unlinkSync,
} = require('fs');
const { spawnSync } = require('child_process');
const environment = existsSync('./ecosystem.config.js')
  ? require('./ecosystem.config.js').apps?.[0]?.env
  : process.env;

if (!environment?.DB_HOST || !environment.DB_USER || !environment.DB_NAME) {
  throw new Error('Falta la configuracion de base de datos');
}

const backupDirectory = process.env.DB_BACKUP_DIR || '/home/admin/db_backups';
mkdirSync(backupDirectory, { recursive: true });

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupPath = `${backupDirectory}/decoproject-${timestamp}.sql`;
const output = openSync(backupPath, 'wx', 0o600);

const result = spawnSync(
  'mysqldump',
  [
    '--single-transaction',
    '--quick',
    '--skip-lock-tables',
    '--host',
    environment.DB_HOST,
    '--port',
    String(environment.DB_PORT || 3306),
    '--user',
    environment.DB_USER,
    environment.DB_NAME,
  ],
  {
    env: { ...process.env, MYSQL_PWD: environment.DB_PASS },
    stdio: ['ignore', output, 'inherit'],
  },
);

closeSync(output);

if (result.status !== 0) {
  unlinkSync(backupPath);
  throw new Error(`mysqldump termino con codigo ${String(result.status)}`);
}

console.log(`Respaldo creado: ${backupPath}`);
