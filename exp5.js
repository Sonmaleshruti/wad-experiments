server.js

const express = require("express");
const mysql = require("mysql2");
const session = require("express-session");
const crypto = require("crypto");
const app = express();
app.use(express.json());
app.use(session({
secret:"security-practical-secret",
resave:false, saveUninitialized:true
}));
const db = mysql.createConnection({
host:"localhost", user:"root",
password:"YOUR_PASSWORD", database:"wad_lab"
});
db.query(`CREATE TABLE IF NOT EXISTS comments(
id INT AUTO_INCREMENT PRIMARY KEY, message TEXT
)`);
app.get("/", (req,res) => {
req.session.token ||= crypto.randomBytes(24).toString("hex");

res.send(`<h2>Secure Comment Form</h2>
<input id="msg" placeholder="Enter comment">
<button onclick="send()">Submit</button><pre id="out"></pre>
<script>
async function send(){
const r=await fetch('/comments',{
method:'POST',
headers:{'Content-Type':'application/json',
'X-CSRF-Token':'${req.session.token}'},
body:JSON.stringify({message:msg.value})
});
out.textContent=await r.text();
}
</script>`);
});
app.post("/comments", (req,res,next) => {
if(req.get("X-CSRF-Token") !== req.session.token)
return res.status(403).send("Invalid CSRF token");
next();
}, (req,res) => {
// Parameterized query prevents SQL injection
db.query("INSERT INTO comments(message) VALUES(?)",
[req.body.message],
e => res.status(e?500:201).send(e?"Database error":"Comment saved safely"));
});
app.listen(3005, () => console.log("http://localhost:3005"));
