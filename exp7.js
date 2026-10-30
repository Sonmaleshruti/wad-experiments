server.js

const express = require("express");
const {DatabaseSync} = require("node:sqlite");
const app = express();
app.use(express.urlencoded({extended:false}));
const db = new DatabaseSync("blog.db");
db.exec(`CREATE TABLE IF NOT EXISTS blogs(
id INTEGER PRIMARY KEY AUTOINCREMENT,
title TEXT, content TEXT
)`);
app.get("/", (req,res) => res.send(`
<h2>Blog Application</h2>
<form method="post" action="/add">

<input name="title" placeholder="Blog title" required>
<textarea name="content" placeholder="Content" required></textarea>
<button>Post</button></form>
<a href="/blogs">View Blogs</a>`));
app.post("/add", (req,res) => {
db.prepare("INSERT INTO blogs(title,content) VALUES(?,?)")
.run(req.body.title,req.body.content);
res.redirect("/blogs");
});
app.get("/blogs", (req,res) => {
const blogs = db.prepare("SELECT * FROM blogs").all();
res.send(blogs.map(b =>
`<p>${b.id}. ${escapeHtml(b.title)}: ${escapeHtml(b.content)}
<a href="/delete/${b.id}">Delete</a></p>`
).join("") || "No blogs yet");
});
function escapeHtml(s) {
return String(s).replace(/[&<>"']/g, c => ({
"&":"&amp;", "<":"&lt;", ">":"&gt;",
'"':"&quot;", "'":"&#39;"
})[c]);
}
app.get("/delete/:id", (req,res) => {
db.prepare("DELETE FROM blogs WHERE id=?").run(+req.params.id);
res.redirect("/blogs");
});
app.listen(3007, () => console.log("http://localhost:3007"));
