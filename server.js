const exp = require("express");
const app = exp();
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const { check, validationResult } = require("express-validator");
const path = require("path");

app.use(bodyParser.urlencoded({ extended: false }));

// Database connect
const db = require("./static/dbConnect/data-server").MongoURI;

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Static Files
app.use(exp.static("static"));
app.use(exp.static(path.join("static")));
app.set("views", path.join(__dirname, "/static/views"));

// Templating Engine
app.set("view engine", ".hbs");
app.engine(
  ".hbs",
  handlebars({
    extname: ".hbs",
    defaultLayout: "main",
  })
);

// Routers
app.use("/", require("./static/routes/indexRoutes"));
app.use("/", require("./static/routes/loginRoutes"));

const HTTP_PORT = process.env.PORT || 8000;

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.listen(HTTP_PORT, onHttpStart);
