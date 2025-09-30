module.exports = {
  apps: [
    {
      name: 'chenqinodejs-api',
      script: 'dist/main.js',
      instances: 'max', // 或者指定具体数量，如 2
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      // 日志配置
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // 自动重启配置
      watch: false,
      ignore_watch: ['node_modules', 'logs'],
      
      // 内存限制
      max_memory_restart: '1G',
      
      // 其他配置
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000
    }
  ]
};
