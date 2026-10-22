#!/usr/bin/env node

/**
 * JSON Formatter & Object Viewer - Server kirish nuqtasi
 * Asosiy kod: src/server/index.js
 */

const { startServer, createServer } = require('./src/server/index.js');

if (require.main === module) {
  startServer().catch(err => {
    console.error('❌ Serverni ishga tushirishda xatolik:', err);
    process.exit(1);
  });
}

module.exports = { startServer, createServer };

