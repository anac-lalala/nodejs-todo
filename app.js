const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const _ = require("lodash");

dotenv.config();

const app = express();
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
});

// Schemas & default tasks definition

const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: [true, "Error: The task needs a name to be saved!"],
  },
});

const Task = mongoose.model("Task", taskSchema);

const defTask1 = new Task({
  taskName: "Create a new custom task with the + button",
});
const defTask2 = new Task({
  taskName: "<--- Finish the task clicking on the box",
});

const defaultTasks = [defTask1, defTask2];

const listSchema = new mongoose.Schema({
  listName: {
    type: String,
    required: [true, "Error: The list need a name"],
  },
  tasks: [taskSchema],
});

const List = mongoose.model("List", listSchema);

// App Actions

app.get("/", function (req, res) {
  Task.find({}, function (err, dbTasks) {
    if (err) {
      console.log(err);
    } else {
      if (dbTasks.length === 0) {
        Task.insertMany(defaultTasks, function (err, tasks) {
          if (err) {
            console.log(err);
          } else {
            console.log(`Success: ${tasks}`);
          }
        });
        console.log(`Default tasks added: ${dbTasks}`);
        res.redirect("/");
      }
      res.render("list", { listTitle: "today", taskList: dbTasks });
    }
  });
});

// app.get("/work", function (req, res) {
//   res.render("list", { listTitle: "Work", taskList: workTasks });
// });

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ listName: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        const list = new List({
          listName: customListName,
          tasks: defaultTasks,
        });
        list.save();
        res.redirect(`/${customListName}`);
      } else {
        res.render("list", {
          listTitle: foundList.listName,
          taskList: foundList.tasks,
        });
      }
    } else {
      console.log(err);
    }
  });
});

app.post("/", function (req, res) {
  const newTask = req.body.newTask;
  const btnList = req.body.btnAdd;

  const task = new Task({
    taskName: newTask,
  });

  if (btnList === "today") {
    task.save();
    res.redirect(`/`);
  } else {
    List.findOne({ listName: btnList }, function (err, foundList) {
      if (err) {
        console.log(err);
      } else {
        foundList.tasks.push(task);
        foundList.save();
      }
    });
    res.redirect(`/${btnList}`);
  }
});

app.post("/delete", function (req, res) {
  const deleteTaskId = req.body.checkDelete;
  const checkList = req.body.checkList;

  if (checkList === "today") {
    Task.findByIdAndRemove(deleteTaskId, function (err) {
      if (err) {
        console.log(err);
      }
      console.log(`Deleted: ${deleteTaskId}`);
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate(
      { listName: checkList },
      { $pull: { tasks: { _id: deleteTaskId } } },
      function (err, foundList) {
        if (!err) {
          res.redirect(`/${checkList}`);
        }
      }
    );
  }
});

app.listen(process.env.PORT, function () {
  console.log("Server started on por 3000 🏁");
});
