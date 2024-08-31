const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8080;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    console.log(`Received request for: ${parsedUrl.pathname}`);
    
    let filePath;
    if (parsedUrl.pathname === '/' || parsedUrl.pathname === '/index.html') {
        filePath = path.join(__dirname, 'public', 'index.html');
    } else if (parsedUrl.pathname.startsWith('/data/')) {
        filePath = path.join(__dirname, parsedUrl.pathname);
    } else {
        filePath = path.join(__dirname, 'public', parsedUrl.pathname);
    }
    
    console.log(`Attempting to serve file: ${filePath}`);

    // Check if file exists and is not a directory
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        console.log(`File not found: ${filePath}`);
        res.writeHead(404);
        res.end('File not found');
        return;
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.mjs': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
    }[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            console.error(`Error reading file: ${filePath}`, error);
            res.writeHead(500);
            res.end(`Server Error: ${error.code}`);
        } else {
            console.log(`Serving file: ${filePath} with content type: ${contentType}`);
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}/`);
});