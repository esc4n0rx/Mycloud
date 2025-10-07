module.exports = {
  apps: [
    {
      name: 'secure-file-server',
      script: './dist/server.js',
      instances: 'max', // Roda uma instância por núcleo de CPU
      exec_mode: 'cluster', // Habilita o modo cluster
      autorestart: true, // Reinicia automaticamente em caso de falha
      watch: false, // Desabilitado por padrão, pode ser útil em desenvolvimento
      max_memory_restart: '1G', // Reinicia se a memória exceder 1GB
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
        // Aqui você pode definir variáveis de ambiente específicas para produção,
        // como a porta, se for diferente.
        // PORT: 8080
      },
    },
  ],
};
