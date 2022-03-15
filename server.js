const express = require("express");

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));

app.get("/", function (req, res) {
  // Render login template
  res.render("index.ejs");
});
app.listen(3000);
cd 