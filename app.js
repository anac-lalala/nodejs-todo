const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");

app.get("/", function (req, res) {
  const today = new Date();
  const currentDay = today.toLocaleString("en-us", { weekday: "long" });

  res.render("list", { day: currentDay });
});

app.listen(3000, function () {
  console.log("Server started on por 3000 🏁");
});
