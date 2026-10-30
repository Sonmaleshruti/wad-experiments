const http = require("http");
http.createServer((req, res) => {
res.writeHead(200, { "Content-Type": "text/html" });
res.end("<h1>My Node.js Web Server</h1><p>Server working!</p>");
}).listen(3001, () => console.log("Open http://localhost:3001"));
