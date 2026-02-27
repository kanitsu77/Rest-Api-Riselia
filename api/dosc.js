const fs = require('fs')
const path = require('path')

module.exports = (req, res) => {
  try {
    const filePath = path.join(__dirname, 'data-api.json')
    const data = fs.readFileSync(filePath, 'utf8')
    res.status(200).json(JSON.parse(data))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
