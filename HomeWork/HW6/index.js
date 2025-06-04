const express = require("express");
const app = express();

app.use((req, res, next) => {
  const startTime = Date.now();

  res.once("finish", () => {
    const elapsedTime = Date.now() - startTime;
    console.log(
      `${new Date().toISOString()} | Method: ${req.method} | URL: ${
        req.url
      } | Status: ${res.statusCode} | Time: ${elapsedTime}ms`
    );
  });

  next();
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
