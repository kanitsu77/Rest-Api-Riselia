const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();

/* ========================
   BASIC CONFIG
======================== */
app.enable("trust proxy");
app.set("json spaces", 2);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

/* ========================
   STATIC FILES
======================== */
const apiPagePath = path.join(__dirname, 'api-page');
const srcPath = path.join(__dirname, 'src');

if (fs.existsSync(apiPagePath)) {
  app.use('/', express.static(apiPagePath));
}

if (fs.existsSync(srcPath)) {
  app.use('/src', express.static(srcPath));
}

/* ========================
   SETTINGS (SAFE LOAD)
======================== */
let settings = {
  apiSettings: {
    creator: "Created Using Rynn UI"
  }
};

const settingsPath = path.join(__dirname, 'src/settings.json');
if (fs.existsSync(settingsPath)) {
  try {
    settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
  } catch (e) {
    console.error("Failed to load settings.json");
  }
}

/* ========================
   RESPONSE WRAPPER
======================== */
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function (data) {
    if (data && typeof data === 'object') {
      return originalJson.call(this, {
        creator: settings.apiSettings?.creator || "Created Using Rynn UI",
        ...data
      });
    }
    return originalJson.call(this, data);
  };
  next();
});

/* ========================
   API ROUTE LOADER (SAFE)
======================== */
const apiFolder = path.join(__dirname, 'src/api');

if (fs.existsSync(apiFolder)) {
  fs.readdirSync(apiFolder).forEach((subfolder) => {
    const subfolderPath = path.join(apiFolder, subfolder);

    if (fs.statSync(subfolderPath).isDirectory()) {
      fs.readdirSync(subfolderPath).forEach((file) => {
        if (file.endsWith('.js')) {
          try {
            require(path.join(subfolderPath, file))(app);
          } catch (err) {
            console.error(`Failed loading route: ${file}`);
          }
        }
      });
    }
  });
}

/* ========================
   MAIN PAGE
======================== */
app.get('/', (req, res) => {
  const indexFile = path.join(apiPagePath, 'index.html');
  if (fs.existsSync(indexFile)) {
    res.sendFile(indexFile);
  } else {
    res.json({
      status: true,
      message: "API is running"
    });
  }
});

/* ========================
   404 HANDLER
======================== */
app.use((req, res) => {
  const notFound = path.join(apiPagePath, '404.html');
  if (fs.existsSync(notFound)) {
    res.status(404).sendFile(notFound);
  } else {
    res.status(404).json({
      status: false,
      message: "404 Not Found"
    });
  }
});

/* ========================
   ERROR HANDLER
======================== */
app.use((err, req, res, next) => {
  console.error(err);
  const errorPage = path.join(apiPagePath, '500.html');
  if (fs.existsSync(errorPage)) {
    res.status(500).sendFile(errorPage);
  } else {
    res.status(500).json({
      status: false,
      message: "Internal Server Error"
    });
  }
});

/* ========================
   IMPORTANT FOR VERCEL
======================== */
// ❌ JANGAN app.listen()
// ✅ EXPORT SAJA
module.exports = app;
