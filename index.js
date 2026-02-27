const express = require("express");
const chalk = require("chalk");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();

app.enable("trust proxy");
app.set("json spaces", 2);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// ✅ STATIC FROM api-page
app.use(express.static(path.join(__dirname, "api-page")));

// SETTINGS
const settingsPath = path.join(__dirname, "api", "data-api.json");

let settings = { apiSettings: { creator: "Created Using Nixx" } };
if (fs.existsSync(settingsPath)) {
  settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
}

// JSON WRAPPER
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function (data) {
    if (data && typeof data === "object") {
      return originalJson.call(this, {
        status: data.status || true,
        creator: settings.apiSettings.creator,
        ...data,
      });
    }
    return originalJson.call(this, data);
  };
  next();
});

// AUTO LOAD ROUTES
const apiFolder = path.join(__dirname, "api", "database");
if (fs.existsSync(apiFolder)) {
  fs.readdirSync(apiFolder).forEach((subfolder) => {
    const subfolderPath = path.join(apiFolder, subfolder);
    if (fs.statSync(subfolderPath).isDirectory()) {
      fs.readdirSync(subfolderPath).forEach((file) => {
        if (path.extname(file) === ".js") {
          require(path.join(subfolderPath, file))(app);
          console.log(
            chalk.bgHex("#FFFF99").hex("#333").bold(` Loaded Route: ${file} `)
          );
        }
      });
    }
  });
}

// ROOT
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "api-page", "index.html"));
});

// 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "api-page", "404.html"));
});

// 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).sendFile(path.join(__dirname, "api-page", "500.html"));
});

module.exports = app;
