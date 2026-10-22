/**
 * Loyiha konfiguratsiyasi
 */

const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

module.exports = {
  env: process.env.NODE_ENV || 'development',
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
    host: process.env.HOST || 'localhost',
    publicDir: path.join(ROOT_DIR, 'public'),
    autoOpenBrowser: process.env.AUTO_OPEN !== 'false'
  },
  cli: {
    defaultIndent: 2
  },
  paths: {
    root: ROOT_DIR,
    public: path.join(ROOT_DIR, 'public'),
    samples: path.join(ROOT_DIR, 'samples')
  }
};
