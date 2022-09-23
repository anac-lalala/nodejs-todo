const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

let dailyTasks = ["Buy food", "Cook foof", "Eat Food"];

app.get("/", function (req, res) {
  const today = new Date();
  const currentDay = today.toLocaleString("en-us", { weekday: "long" });

  res.render("list", { day: currentDay, taskList: dailyTasks });
});

app.post("/", function (req, res) {
  const newTask = req.body.newTask;
  dailyTasks.push(newTask);

  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server started on por 3000 🏁");
});
