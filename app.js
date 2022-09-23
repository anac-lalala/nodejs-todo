const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

const dailyTasks = ["Buy food", "Cook foof", "Eat Food"];
const workTasks = [];

app.get("/", function (req, res) {
  const currentDay = date.getDate();

  res.render("list", { listTitle: currentDay, taskList: dailyTasks });
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work", taskList: workTasks });
});
app.get("/about", function (req, res) {
  res.render("about");
});

app.post("/", function (req, res) {
  const newTask = req.body.newTask;

  if (req.body.listName === "Work") {
    workTasks.push(newTask);
    res.redirect("/work");
  } else {
    dailyTasks.push(newTask);
    res.redirect("/");
  }
});

app.listen(3000, function () {
  console.log("Server started on por 3000 🏁");
});
