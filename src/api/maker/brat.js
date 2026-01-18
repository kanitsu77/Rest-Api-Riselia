const axios = require('axios');

module.exports = function (app) {
  app.get('/maker/brat', async (req, res) => {
    const text = req.query.text || 'Hello World';

    try {
      const response = await axios.get(
        'https://api.deline.web.id/maker/brat',
        {
          params: { text },
          responseType: 'arraybuffer'
        }
      );

      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': response.data.length
      });

      res.end(Buffer.from(response.data));

    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: 'Failed to generate brat image'
      });
    }
  });
};
