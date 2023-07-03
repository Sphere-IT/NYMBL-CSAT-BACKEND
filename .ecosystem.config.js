module.exports = {
    apps: [
      {
        name: "nymbl-csat-app-backend",
        script: "dist\\main.js",
        env: {
          NODE_ENV: "development",
        },
        env_production: {
          NODE_ENV: "production",
        },
        instances: 1,
        exec_mode: "fork",
      },
    ],
  };
  