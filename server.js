#!/usr/bin/env node

/**
 * JSON Formatter & Object Viewer - Node.js Veb-Server
 * Ishga tushirish: node server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url === '/' ? '/index.html' : req.url;
  // Query parametrlarni tozalash
  reqPath = reqPath.split('?')[0];

  const filePath = path.join(BASE_DIR, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'text/plain';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end("404: Sahifa topilmadi");
      } else {
        res.writeHead(500);
        res.end(`Server xatosi: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

function openBrowser(url) {
  const start = process.platform === 'darwin' ? 'open' :
                process.platform === 'win32' ? 'start' : 'xdg-open';
  exec(`${start} ${url}`).catch?.(() => {});
}

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log('='.repeat(55));
  console.log(' 🚀 JSON Formatter (Node.js Server) Ishga Tushdi!');
  console.log(` 🌐 Manzil: ${url}`);
  console.log(' 💡 To\'xtatish uchun: Ctrl + C tugmalarini bosing');
  console.log('='.repeat(55));

  openBrowser(url);
});
