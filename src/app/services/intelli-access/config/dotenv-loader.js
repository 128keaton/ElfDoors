require('dotenv').config();

const env = {
  port: process.env.PORT || '80',
  host: null
};

module.exports = () => {
  return { code: 'module.exports = ' + JSON.stringify(env) };
};
