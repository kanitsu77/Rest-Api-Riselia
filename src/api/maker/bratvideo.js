const axios = require('axios')

module.exports = function (app) {
  app.get('/bratvid', async (req, res) => {
    const { text } = req.query
    if (!text) return res.status(400).send("Query 'text' required")

    try {
      const url = `https://brat.siputzx.my.id/gif?text=${encodeURIComponent(text)}&mode=animated`
      const response = await axios.get(url, { responseType: 'arraybuffer' })
      res.set('Content-Type', 'image/gif')
      res.send(response.data)
    } catch (e) {
      res.status(500).send('Error: ' + e.message)
    }
  })
}
