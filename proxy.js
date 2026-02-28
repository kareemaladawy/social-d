/**
 * Local dev server for social-dashboard.html
 * Serves files from the same directory on http://localhost:3000
 * This gives the page a real origin instead of "null" (file://),
 * which fixes the CORS preflight rejection from external APIs.
 *
 * Usage:  node proxy.js
 * Then open:  http://localhost:3000
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

const server = http.createServer(function (req, res) {
  // Default path → index file
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/' || urlPath === '') urlPath = '/social-dashboard.html';

  const filePath = path.join(ROOT, urlPath);

  // Security: don't allow directory traversal outside ROOT
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, function (err, data) {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found: ' + urlPath);
      return;
    }

    const ext  = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type':  mime,
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', function () {
  console.log('');
  console.log('  ✅  Server running at http://localhost:' + PORT);
  console.log('  📊  Open your dashboard: http://localhost:' + PORT + '/social-dashboard.html');
  console.log('');
  console.log('  Press Ctrl+C to stop.');
});
