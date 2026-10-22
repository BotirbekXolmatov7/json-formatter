#!/usr/bin/env node

/**
 * Backwards-compatibility kirish proksisi
 * Asosiy server: server.js yoki src/server/index.js
 */

const { startServer, createServer } = require('./server.js');

if (require.main === module) {
  startServer().catch(err => {
    console.error('❌ Serverni ishga tushirishda xatolik:', err);
    process.exit(1);
  });
}

module.exports = { startServer, createServer };

