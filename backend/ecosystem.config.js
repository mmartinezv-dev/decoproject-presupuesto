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
      },
    },
  ],
}
