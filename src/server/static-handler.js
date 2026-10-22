/**
 * Xavfsiz statik fayllar xizmati (Static File Handler)
 */

const fs = require('fs');
const path = require('path');
const { getMimeType } = require('./mime-types');

function createStaticHandler(publicDir) {
  const resolvedPublicDir = path.resolve(publicDir);

  return function handleStaticRequest(req, res) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('405: Method Not Allowed');
      return;
    }

    let reqUrlPath = req.url === '/' ? '/index.html' : req.url;
    // Query parametrlarni tozalash
    reqUrlPath = reqUrlPath.split('?')[0];

    // URL decode qilish
    let decodedPath = '';
    try {
      decodedPath = decodeURIComponent(reqUrlPath);
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('400: Bad Request');
      return;
    }

    // Xavfsiz yo'l yaratish (Path Traversal himoyasi)
    const safePath = path.normalize(decodedPath).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(resolvedPublicDir, safePath);

    // publicDir dan tashqariga chiqmasligini tekshirish
    if (!filePath.startsWith(resolvedPublicDir)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('403: Forbidden - Kirish taqiqlangan');
      return;
    }

    fs.stat(filePath, (statErr, stats) => {
      if (statErr) {
        if (statErr.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(`
            <!DOCTYPE html>
            <html lang="uz">
            <head><meta charset="UTF-8"><title>404 - Sahifa topilmadi</title></head>
            <body style="font-family: sans-serif; text-align: center; padding: 50px; background: #0f172a; color: #f8fafc;">
              <h1 style="color: #ef4444;">404</h1>
              <p>So'ralgan sahifa yoki fayl topilmadi.</p>
              <a href="/" style="color: #3b82f6; text-decoration: none;">Bosh sahifaga qaytish &rarr;</a>
            </body>
            </html>
          `);
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end(`500: Server xatosi (${statErr.code})`);
        }
        return;
      }

      // Agar katalog bo'lsa va / bilan tugasa, index.html ni tekshirish
      if (stats.isDirectory()) {
        const indexHtmlPath = path.join(filePath, 'index.html');
        if (fs.existsSync(indexHtmlPath)) {
          serveFile(indexHtmlPath, req, res);
          return;
        }
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('403: Katalog ro\'yxatini ko\'rish taqiqlangan');
        return;
      }

      serveFile(filePath, req, res);
    });
  };

  function serveFile(filePath, req, res) {
    const ext = path.extname(filePath);
    const contentType = getMimeType(ext);

    const headers = {
      'Content-Type': contentType,
      'X-Content-Type-Options': 'nosniff'
    };

    if (req.method === 'HEAD') {
      res.writeHead(200, headers);
      res.end();
      return;
    }

    const stream = fs.createReadStream(filePath);
    stream.on('error', (err) => {
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      }
      res.end(`O'qish xatosi: ${err.message}`);
    });

    res.writeHead(200, headers);
    stream.pipe(res);
  }
}

module.exports = {
  createStaticHandler
};
