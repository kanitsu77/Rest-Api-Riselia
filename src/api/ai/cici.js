const axios = require('axios')
const { randomUUID } = require('crypto')

module.exports = function (app) {

    const rnd = () => Math.floor(Math.random() * 1e17) + 1
    const rndHex = () => rnd().toString(16)

    async function ciciai(question) {
        if (!question) throw new Error('Question is required')

        const random = rnd()
        const cdid = '2' + rndHex().padStart(23, '0')

        const body = {
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
        }

        const params = {
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
        }

        const headers = {
            'Content-Type': 'application/json',
            'Accept-Encoding': 'gzip',
            'User-Agent': 'com.larus.wolf/8090004 (Android 12)',
            'X-Tt-Token': 'ISI_TOKEN_ASLI_DI_SINI'
        }

        const { data: rawData } = await axios.post(
            'https://api-normal-i18n.ciciai.com/im/sse/send/message',
            body,
            {
                params,
                headers,
                responseType: 'text',
                timeout: 20000
            }
        )

        let chat = ''
        const sources = []

        const lines = rawData.toString().split('\n')

        for (const line of lines) {
            if (!line.startsWith('data:')) continue

            try {
                const json = JSON.parse(line.replace('data:', '').trim())
                const body = json?.downlink_body?.fetch_chunk_message_downlink_body
                if (!body?.content) continue

                const content = JSON.parse(body.content)

                if (content.text) {
                    chat += content.text
                }

                const tags = content?.text_tags || []
                for (const tag of tags) {
                    const info = JSON.parse(tag.tag_info || '{}')
                    if (info.url && info.title) {
                        sources.push({
                            title: info.title,
                            url: info.url
                        })
                    }
                }
            } catch {
                continue
            }
        }

        if (!chat) throw new Error('Jawaban kosong atau token invalid')

        return {
            chat,
            sources
        }
    }

    app.get('/ai/cici', async (req, res) => {
        try {
            const { text } = req.query
            if (!text) {
                return res.status(400).json({
                    creator: 'Nixx',
                    status: false,
                    error: 'Parameter "text" wajib diisi'
                })
            }

            const data = await ciciai(text)

            res.json({
                creator: 'Nixx',
                status: true,
                result: data.chat,
                sources: data.sources
            })
        } catch (error) {
            console.error(error.response?.data || error.message)
            res.status(500).json({
                creator: 'Nixx',
                status: false,
                error: error.response?.data || error.message
            })
        }
    })
                }
