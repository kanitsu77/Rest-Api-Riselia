const axios = require('axios');

module.exports = function(app) {
  app.get('/maker/brat', async (req, res) => {
    const { text } = req.query;
    if (!text) return res.status(400).send("Query 'text' required");

    try {
      const response = await axios.get(
        `https://api.deline.web.id/maker/brat?text=${encodeURIComponent(text)}`,
        { responseType: 'arraybuffer' } 
      );
      res.set('Content-Type', 'image/png');
      res.send(response.data);

    } catch (error) {
      res.status(500).send("Error: " + error.message);
    }
  });
}
