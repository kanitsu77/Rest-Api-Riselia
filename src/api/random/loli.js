const axios = require('axios');
module.exports = function(app) {
    async function loli() {
        try {
            const { data } = await axios.get(`https://raw.githubusercontent.com/synshin9/loli-r-img/refs/heads/main/links.json`)
            const response = await axios.get(data[Math.floor(data.length * Math.random())], { responseType: 'arraybuffer' });
            return Buffer.from(response.data);
        } catch (error) {
            throw error;
        }
    }
    app.get('/random/loli', async (req, res) => {
        try {
            const pedo = await loli();
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': pedo.length,
            });
            res.end(pedo);
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
    });
};
