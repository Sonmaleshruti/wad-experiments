server.js

const express = require("express");
const app = express();
app.use(express.json());
let tasks = [];
let id = 1;
app.get("/tasks", (req,res) => res.json(tasks));

app.post("/tasks", (req,res) => {
if(!req.body.task) return res.status(400).send("Task required");
const task = {id:id++, task:req.body.task};
tasks.push(task);
res.status(201).json(task);
});
app.put("/tasks/:id", (req,res) => {
const task = tasks.find(t => t.id === +req.params.id);
if(!task) return res.status(404).send("Not found");
task.task = req.body.task;
res.json(task);
});
app.delete("/tasks/:id", (req,res) => {
const old = tasks.length;
tasks = tasks.filter(t => t.id !== +req.params.id);
res.send(tasks.length < old ? "Deleted" : "Not found");
});
app.listen(3006, () => console.log("API: http://localhost:3006/tasks"));
