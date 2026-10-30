server.js

const express = require("express");
const mysql = require("mysql2");
const app = express();
app.use(express.json());
app.use(express.static("public"));
const db = mysql.createConnection({
host: "localhost", user: "root",
password: "YOUR_PASSWORD", database: "wad_lab"
});
db.query(`CREATE TABLE IF NOT EXISTS students(
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(50), email VARCHAR(100)
)`);
app.get("/students", (req, res) =>
db.query("SELECT * FROM students", (e, r) => res.json(r)));
app.post("/students", (req, res) =>
db.query("INSERT INTO students(name,email) VALUES(?,?)",
[req.body.name, req.body.email],
e => res.send(e ? "Error" : "Student added")));
app.put("/students/:id", (req, res) =>
db.query("UPDATE students SET name=?,email=? WHERE id=?",
[req.body.name, req.body.email, req.params.id],
e => res.send(e ? "Error" : "Student updated")));
app.delete("/students/:id", (req, res) =>
db.query("DELETE FROM students WHERE id=?",
[req.params.id], e => res.send(e ? "Error" : "Student deleted")));
app.listen(3003, () => console.log("http://localhost:3003"));

Index.html

<h2>Student Registration</h2>
<input id="name" placeholder="Name">

<input id="email" placeholder="Email">
<input id="id" placeholder="ID for update/delete">
<button onclick="save()">Add</button>
<button onclick="update()">Update</button>
<button onclick="removeStudent()">Delete</button>
<button onclick="load()">View Students</button>
<pre id="out"></pre>
<script>
async function save() {
await fetch("/students", {
method: "POST", headers: {"Content-Type":"application/json"},
body: JSON.stringify({name:name.value,email:email.value})
});
load();
}
async function update() {
await fetch("/students/"+id.value, {
method:"PUT", headers:{"Content-Type":"application/json"},
body:JSON.stringify({name:name.value,email:email.value})
});
load();
}
async function removeStudent() {
await fetch("/students/"+id.value,{method:"DELETE"});
load();
}
async function load() {
out.textContent = JSON.stringify(await (await fetch("/students")).json(),null,2);
}
</script>
