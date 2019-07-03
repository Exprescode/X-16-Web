const fs = require('fs');
module.exports = {
  devServer: {
    host: '0.0.0.0',
    //port: 80,
    public: 'chat.lukeng.io',
    port: 8443,
    https: {
      key: fs.readFileSync('/etc/letsencrypt/live/chat.lukeng.io/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/chat.lukeng.io/fullchain.pem'),
    }
  }
};
