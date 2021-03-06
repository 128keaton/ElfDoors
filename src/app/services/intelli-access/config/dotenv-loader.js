require('dotenv').config();

const env = {
  port: process.env.PORT || '80',
  host: process.env.HOST || null,
  title: process.env.TITLE || 'ElfDoors'
};

module.exports = () => {
  return { code: 'module.exports = ' + JSON.stringify(env) };
};
