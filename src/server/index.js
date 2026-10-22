/**
 * JSON Formatter & Object Viewer - HTTP Veb Server
 */

const http = require('http');
const { exec } = require('child_process');
const config = require('../../config');
const { createStaticHandler } = require('./static-handler');

function openBrowser(url) {
  const start = process.platform === 'darwin' ? 'open' :
                process.platform === 'win32' ? 'start' : 'xdg-open';
  exec(`${start} ${url}`, () => {});
}

function createServer(options = {}) {
  const publicDir = options.publicDir || config.server.publicDir;
  const staticHandler = createStaticHandler(publicDir);

  const server = http.createServer((req, res) => {
    staticHandler(req, res);
  });

  return server;
}

function startServer(port = config.server.port, options = {}) {
  const host = options.host || config.server.host;
  const autoOpen = options.autoOpen !== undefined ? options.autoOpen : config.server.autoOpenBrowser;

  return new Promise((resolve, reject) => {
    const server = createServer(options);

    server.listen(port, () => {
      const url = `http://${host}:${port}`;
      console.log('='.repeat(58));
      console.log('  🚀 JSON Formatter & Object Viewer Web Server Ishga Tushdi!');
      console.log(`  🌐 Manzil: \x1b[36m${url}\x1b[0m`);
      console.log('  💡 To\'xtatish uchun: [Ctrl + C] tugmalarini bosing');
      console.log('='.repeat(58));

      if (autoOpen) {
        openBrowser(url);
      }

      resolve({ server, url, port });
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`\n⚠️  Port ${port} band. Muqobil port (${port + 1}) sinab ko'rilmoqda...`);
        startServer(port + 1, options).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });

    // To'g'ri to'xtatish (Graceful shutdown)
    const handleClose = () => {
      console.log('\n  🛑 Server to\'xtatilmoqda...');
      server.close(() => {
        console.log('  ✅ Server muvaffaqiyatli to\'xtatildi.');
        process.exit(0);
      });
    };

    process.once('SIGINT', handleClose);
    process.once('SIGTERM', handleClose);
  });
}

// To'g'ridan-to'g'ri chaqirilganda ishga tushirish
if (require.main === module) {
  startServer().catch(err => {
    console.error('❌ Serverni ishga tushirishda xatolik:', err);
    process.exit(1);
  });
}

module.exports = {
  createServer,
  startServer
};
