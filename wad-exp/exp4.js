server.js

const express = require("express");
const mysql = require("mysql2");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const app = express();

app.use(express.urlencoded({extended:false}));
app.use(session({
secret:"classroom-secret-change-me",
resave:false, saveUninitialized:false
}));
const db = mysql.createConnection({
host:"localhost", user:"root",
password:"YOUR_PASSWORD", database:"wad_lab"
});
db.query(`CREATE TABLE IF NOT EXISTS users(
id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(50) UNIQUE,
password VARCHAR(255)
)`);
app.get("/", (req,res) => res.send(`
<h2>Register</h2>
<form method="post" action="/register">
<input name="username" placeholder="Username" required>
<input name="password" type="password" placeholder="Password" required>
<button>Register</button></form>
<h2>Login</h2>
<form method="post" action="/login">
<input name="username" placeholder="Username" required>
<input name="password" type="password" placeholder="Password" required>
<button>Login</button></form>`));
app.post("/register", async (req,res) => {
const hash = await bcrypt.hash(req.body.password,10);
db.query("INSERT INTO users(username,password) VALUES(?,?)",
[req.body.username,hash],
e => res.send(e ? "Registration failed" : "Registered successfully"));
});
app.post("/login", (req,res) => {
db.query("SELECT * FROM users WHERE username=?",
[req.body.username], async (e,rows) => {
if(e || !rows.length ||
!await bcrypt.compare(req.body.password,rows[0].password))
return res.send("Invalid login");
req.session.user = rows[0].username;

res.redirect("/home");
});
});
app.get("/home", (req,res) =>
res.send(req.session.user
? `Welcome ${req.session.user} <a href="/logout">Logout</a>`
: "Please log in first"));
app.get("/logout", (req,res) =>
req.session.destroy(() => res.redirect("/")));
app.listen(3004, () => console.log("http://localhost:3004"));
