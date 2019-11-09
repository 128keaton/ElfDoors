require('dotenv').config();

const env = {
  port: process.env.APP_PORT || '3000',
};

module.exports = () => {
  return { code: 'module.exports = ' + JSON.stringify(env) };
};
