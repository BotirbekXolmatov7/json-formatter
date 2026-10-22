/**
 * Statik fayllar uchun MIME turlari xaritasi
 */

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8'
};

function getMimeType(extension) {
  const ext = extension ? extension.toLowerCase() : '';
  return MIME_TYPES[ext] || 'application/octet-stream';
}

module.exports = {
  MIME_TYPES,
  getMimeType
};
