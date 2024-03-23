const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const data = require("./modules/officeData.js");

const app = express();
app.use(express.urlencoded({ extended: true }));

const HTTP_PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/PartTimer", (req, res) => {
  data.getPartTimers().then((data) => {
    res.json(data);
  });
});

app.get("/employees/add", (req, res) => {
  const filePath = path.join(__dirname, "views", "addEmployee.html");
  res.sendFile(filePath);
});

app.post("/employees/add", (req, res) => {
  data
    .addEmployee(req.body)
    .then(() => {
      res.redirect("/employees");
    })
    .catch((error) => {
      console.error("Error adding employee:", error);
      res.render("error", { message: "Error adding employee" });
    });
});

app.get("/description", (req, res) => {
  res.render("description");
});

app.get("/employees", (req, res) => {
  data
    .getAllEmployees()
    .then((data) => {
      res.render("employees", { employees: data });
    })
    .catch((error) => {
      res.render("employees", { message: "no results" });
    });
});

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

app.engine("hbs", exphbs.engine({ extname: ".hbs", defaultLayout: "main" }));
app.set("view engine", "hbs");

data
  .initialize()
  .then(function () {
    app.listen(HTTP_PORT, function () {
      console.log("app listening on: " + HTTP_PORT);
    });
  })
  .catch(function (err) {
    console.log("unable to start server: " + err);
  });
