server.js

const express = require("express");
const app = express();
const tasks = [

{id:1, task:"Complete assignment"},
{id:2, task:"Prepare practical file"},
{id:3, task:"Study for viva"}
];
app.get("/api/tasks", (req,res) => res.json(tasks));
app.get("/", (req,res) => res.send(`
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
body{font-family:Arial;max-width:400px;margin:30px auto;padding:10px}
p{padding:12px;border:1px solid #ccc;border-radius:8px}
</style>
<h2>Mobile Task App</h2>
<button onclick="loadTasks()">Fetch Tasks</button>
<div id="out"></div>
<script>
async function loadTasks(){
const r=await fetch('/api/tasks');
const data=await r.json();
out.replaceChildren();
data.forEach(t=>{
const p=document.createElement('p');
p.textContent=t.id+'. '+t.task;
out.appendChild(p);
});
}
loadTasks();
</script>`));
app.listen(3008, () => console.log("http://localhost:3008"));
