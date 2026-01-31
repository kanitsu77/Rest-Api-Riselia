const ytdl = require('ytdl-core');

module.exports = function(app) {
    app.get('/download/ytmp3', async (req, res) => {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ status: false, error: 'URL is required' });
        }

        try {
            if (!ytdl.validateURL(url)) {
                return res.status(400).json({ status: false, error: 'Invalid YouTube URL' });
            }

            const info = await ytdl.getInfo(url);
            const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });

            res.status(200).json({
                creator: "Nixx",
                status: true,
                result: {
                    imgurl: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
                    audiourl: audioFormat.url,
                    title: info.videoDetails.title,
                    duration: info.videoDetails.lengthSeconds,
                    author: info.videoDetails.author.name
                }
            });
        } catch (error) {
            res.status(500).json({ creator: "Nixx", status: false, error: error.message });
        }
    });
};
