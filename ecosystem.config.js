//jshint ignore: start
module.exports = {
  apps: [
    {
      name: "mongod",
      script: "mongod",
      args: "--auth --port 27017 --dbpath data",
      error_file: "./log/db/err.log",
      out_file: "./log/db/out.log",
      kill_timeout: 5000
    },
    {
      name: "webserver",
      script: "./bin/www.js",
      args: "--trace-deprecation",
      env: {
        NODE_ENV: "production"
      },
      error_file: "./log/env/err.log",
      out_file: "./log/env/out.log",
      kill_timeout: 3000,
      wait_ready: true
    }
  ]
}

/*
module.exports = {
  apps : [

    // First application
    {
      name      : 'API',
      script    : 'app.js',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'production'
      }
    },

    // Second application
    {
      name      : 'WEB',
      script    : 'web.js'
    }
  ],
  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    },
    dev : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/development',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env dev',
      env  : {
        NODE_ENV: 'dev'
      }
    }
  }
};
*/
