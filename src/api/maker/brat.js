const axios = require('axios');

module.exports = (app) => {
  app.get('/maker/brat', async (req, res) => {
    const { text } = req.query;

    if (!text) {
      return res.status(400).json({
        status: false,
        message: "Query parameter 'text' is required"
      });
    }

    try {
      const response = await axios.get(
        'https://api.deline.web.id/maker/brat',
        {
          params: { text },
          responseType: 'arraybuffer'
        }
      );

      res.setHeader('Content-Type', 'image/png');
      res.send(response.data);

    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: false,
        message: "Failed to generate brat image"
      });
    }
  });
};
