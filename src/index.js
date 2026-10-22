/**
 * JSON Formatter & Object Viewer - Asosiy Kutubxona Kirish Nuqtasi
 */

const { sortKeys, printTree, colorizeJsonString, parseJsonWithLocation } = require('./core/formatter');
const { colors, colorizePrimitive } = require('./core/colors');
const { createServer, startServer } = require('./server');

if (require.main === module) {
  startServer().catch(err => {
    console.error('❌ Serverni ishga tushirishda xatolik:', err);
    process.exit(1);
  });
}

module.exports = {
  sortKeys,
  printTree,
  colorizeJsonString,
  parseJsonWithLocation,
  colors,
  colorizePrimitive,
  createServer,
  startServer
};
