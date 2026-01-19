const axios = require('axios');
const { randomUUID } = require('crypto');

module.exports = function (app) {

    /* ================= HELPER ================= */

    const rnd = () => Math.floor(Math.random() * 1e17) + 1;
    const rndHex = () => rnd().toString(16);
    const rndStr = () => Math.random().toString(36).substring(2, 10);

    /* ================= CORE FUNCTION ================= */

    async function ciciai(question) {
        if (!question) throw new Error('Question is required');

        try {
            const random = rnd();
            const cdid = '2' + rndHex().padStart(23, '0');

            const { data: rawData } = await axios.post(
                'https://api-normal-i18n.ciciai.com/im/sse/send/message',
                {
                    channel: 3,
                    cmd: 100,
                    sequence_id: randomUUID(),
                    uplink_body: {
                        send_message_body: {
                            ack_only: false,
                            bot_id: '7241547611541340167',
                            bot_type: 1,
                            content: JSON.stringify({
                                im_cmd: -1,
                                text: question
                            }),
                            content_type: 1,
                            conversation_id: '485805516280081',
                            conversation_type: 3,
                            create_time: Math.floor(Date.now() / 1000),
                            ext: {
                                system_language: 'en',
                                is_audio: 'false',
                                need_net_search: '0'
                            },
                            local_message_id: rndHex(),
                            sender_id: '7584067883349640200',
                            unique_key: rndHex()
                        }
                    },
                    version: '1'
                },
                {
                    params: {
                        device_platform: 'android',
                        os: 'android',
                        aid: '489823',
                        app_name: 'nova_ai',
                        language: 'en',
                        region: 'US',
                        carrier_region: 'ID',
                        tz_name: 'Asia/Shanghai',
                        _rticket: random,
                        cdid,
                        uid: rnd(),
                        iid: rnd(),
                        device_id: rnd()
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept-Encoding': 'gzip',
                        'User-Agent': 'com.larus.wolf/8090004 (Android 12)',
                        'X-Tt-Token': 'PUT_YOUR_TOKEN_HERE'
                    }
                }
            );

            /* ================= PARSE RESPONSE ================= */

            const chat = [];
            const sources = [];

            // ambil text utama
            const originRegex = /"origin_content"\s*:\s*"([^"]*)"/g;
            let match;
            while ((match = originRegex.exec(rawData)) !== null) {
                chat.push(match[1]);
            }

            // ambil sumber (jika ada)
            const dataRegex = /data:\s*(\{.*?\})(?=\n|$)/gs;
            while ((match = dataRegex.exec(rawData)) !== null) {
                try {
                    const json = JSON.parse(match[1]);
                    const body = json?.downlink_body?.fetch_chunk_message_downlink_body;
                    if (!body) continue;

                    const content = JSON.parse(body.content);
                    const tags = content?.text_tags || [];

                    for (const tag of tags) {
                        const info = JSON.parse(tag.tag_info || '{}');
                        if (info.url && info.title) {
                            sources.push({
                                title: info.title,
                                url: info.url
                            });
                        }
                    }
                } catch {
                    continue;
                }
            }

            return {
                chat: chat.join(''),
                sources
            };

        } catch (err) {
            throw new Error(`CiciAI Error: ${err.message}`);
        }
    }



    app.get('/ai/cici', async (req, res) => {
        try {
            const { text } = req.query;
            if (!text) {
                return res.status(400).json({
                    status: false,
                    error: 'Parameter "text" wajib diisi'
                });
            }

            const data = await ciciai(text);

            res.json({
                creator: "Nixx",
                status: true,
                result: data.chat,
                sources: data.sources
            });

        } catch (error) {
            res.status(500).json({
                creator: "Nixx",
                status: false,
                error: error.message
            });
        }
    });
};
