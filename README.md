# 🚀 Nixx API Documentation

Smart API system built with **HTML, CSS, JavaScript + Vercel Serverless Functions**.

Developed by **Nixx**

---

## 🌐 Live Demo

After deploy to Vercel:

https://your-project-name.vercel.app

API Endpoint:

https://your-project-name.vercel.app/api/docs

---

## 📁 Project Structure

projek/
│
├── api/
│   ├── docs.js
│   ├── data-api.json
│   └── ai/
│       └── dola.js
│
├── api-page/
│   ├── style.css
│   └── script.js
│
├── index.html
├── package.json
└── vercel.json

---

## ⚙️ How It Works

- `/api` folder = Serverless backend (Node.js runtime)
- `docs.js` reads JSON database using `fs`
- Frontend fetches `/api/docs`
- Dynamic API cards rendered automatically
- Search filter built-in
- Marquee header animation

---

## 🚀 Deploy to Vercel

### 1️⃣ Upload to GitHub

Push this project to your GitHub repository.

### 2️⃣ Deploy

1. Go to https://vercel.com
2. Import GitHub project
3. Click **Deploy**

Done 🎉

No configuration needed.

---

## 📦 Dependencies

This project uses:

- Native Node.js modules (`fs`, `path`)
- No external dependencies required

If you add external APIs (like axios), install them:

npm install axios

---

## 🧠 Example API JSON Structure

```json
{
  "Developer": "Nixx",
  "Apikey": "Tee",
  "APIs": {
    "categories": {
      "Ai": [
        {
          "name": "Dola",
          "description": "Ai Smart By Dola",
          "status": "ready",
          "path": "ai/dola",
          "apikey": true,
          "type": "json",
          "params": {
            "q": "Ask To Dola"
          }
        }
      ]
    }
  }
}
```

---

## 🔐 Example Request

GET /api/ai/dola?q=hello&apikey=Tee

---

## 🛠 Features

- Dynamic API loader
- Auto category mapping
- Built-in search filter
- Execute test button
- JSON preview result
- Marquee animated header
- Vercel-ready deployment

---

## 👨‍💻 Developer

Nixx

---

## 📄 License

Free to use for learning and personal projects.
