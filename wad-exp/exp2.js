server.js

const express = require("express");
const app = express();
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
app.get("/hello", (req, res) => res.send("HTTP GET request successful!"));
app.listen(3002, () => console.log("http://localhost:3002"));

Index.html

<h1>My Web Application</h1>
<button onclick="fetch('/hello').then(r=>r.text()).then(t=>out.textContent=t)">
Send HTTP Request
</button>
<p id="out"></p>
