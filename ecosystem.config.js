module.exports = {
  apps: [{
    name: "cleartrip-serp",
    script: "npm",
    args: "run start:production",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    env_production: {
      NODE_ENV: "production"
    }
  }],

  deploy: {
    production: {
      user: "ubuntu",
      host: "13.250.127.183",
      ref: "origin/master",
      repo: "git@github.com:soreddysirish/serpFend.git",
      path: "/var/www/serp_frontend",
      key: "/Users/sireeshreddy/Documents/cleartrip/pempfiles/imp/cleartrip_pem/dynamic-flights-high-config.pem",
      ssh_options: ["ForwardAgent=yes"],
      "post-deploy": "npm install --production && npm run build"
    }
  }
};