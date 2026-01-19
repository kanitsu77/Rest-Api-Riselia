const axios = require('axios');

module.exports = function (app) {
  app.get('/maker/bratvideo', async (req, res) => {
    const { text } = req.query;
    if (!text) {
      return res.status(400).json({
        status: false,
        message: "Parameter 'text' wajib diisi"
      });
    }

    try {
      const response = await axios.get(
        'https://api.deline.web.id/maker/bratvid',
        {
          params: { text },
          responseType: 'arraybuffer'
        }
      );

      res.writeHead(200, {
        'Content-Type': 'video/mp4',
        'Content-Length': response.data.length
      });

      res.end(Buffer.from(response.data));

    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: 'Failed to generate brat Video'
      });
    }
  });
};
