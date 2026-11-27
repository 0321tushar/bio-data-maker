const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const filePath = path.join(BASE_DIR, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found: ' + reqPath);
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error: ' + err.code);
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`\n======================================================`);
  console.log(`  🌟 Royal Bio Data Maker is Running!`);
  console.log(`  🔗 Access URL: ${url}`);
  console.log(`  Press Ctrl + C in this terminal to stop.`);
  console.log(`======================================================\n`);

  // Automatically open browser on Windows
  exec(`start ${url}`, (err) => {
    if (err) {
      console.log(`Open ${url} in your browser.`);
    }
  });
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    const fallbackPort = 3001;
    console.log(`Port ${PORT} in use, trying port ${fallbackPort}...`);
    server.listen(fallbackPort, () => {
      const url = `http://localhost:${fallbackPort}`;
      console.log(`  🌟 Running at: ${url}`);
      exec(`start ${url}`);
    });
  } else {
    console.error('Server error:', e);
  }
});
