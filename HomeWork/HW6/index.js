const express = require("express");
const morgan = require("morgan");
const app = express();


app.use(morgan('combined'));


app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/about", (req, res) => {
  res.send("This is the about page.");
});


app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
