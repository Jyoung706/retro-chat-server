module.exports = {
  apps: [
    {
      name: 'retro-chat-server',
      script: 'dist/main.js',
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
