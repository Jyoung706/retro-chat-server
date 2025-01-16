module.exports = {
  apps: [
    {
      name: 'retro-chat-server',
      script: 'dist/main.js',
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
      log_data_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/var/log/retro-chat-log/error.log',
      out_file: '/var/log/retro-chat-log/out.log',
    },
  ],
};
