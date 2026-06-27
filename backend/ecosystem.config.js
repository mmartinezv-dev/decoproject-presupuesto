module.exports = {
  apps: [
    {
      name: 'decoproject',
      script: 'dist/main.js',
      cwd: '/home/admin/app/backend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        DB_HOST: 'localhost',
        DB_PORT: 3306,
        DB_USER: 'decoproject',
        DB_PASS: 'cambia_esta_password',
        DB_NAME: 'decoproject',
        AUTH_USER: 'admin',
        AUTH_PASS: 'decoproject2024',
        JWT_SECRET: 'cambia_este_secret',
      },
    },
  ],
}
