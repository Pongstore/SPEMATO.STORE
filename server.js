require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); 

// បម្រើឯកសារ index.html នៅពេលគេចូលមកកាន់គេហទំព័រ
app.use(express.static(path.join(__dirname)));

// API សម្រាប់ទទួលទិន្នន័យពី Frontend
app.post('/api/preorder', async (req, res) => {
    try {
        const { robloxUser, tgPhone, tgUser, currentRolls, currentPrice } = req.body;

        if (!robloxUser || !tgUser) {
            return res.status(400).json({ ok: false, message: 'Missing required fields' });
        }

        // រៀបចំសារវិក័យប័ត្រ
        const receiptMessage = `
🧾 *វិក័យប័ត្រកក់ទុកថ្មី (SPEMATO)*
━━━━━━━━━━━━━━
📦 កញ្ចប់: ${currentRolls} Rolls
💰 តម្លៃ: $${currentPrice}
👤 Roblox Username: ${robloxUser}
📱 Telegram Phone: ${tgPhone || 'មិនបានបំពេញ'}
✈️ Telegram User: ${tgUser}
🕒 ពេលវេលា: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh' })}
━━━━━━━━━━━━━━
សូមរង់ចាំការបញ្ជាក់ពីអ្នកលក់។
        `;

        // ផ្ញើទៅ Telegram
        const telegramUrl = `https://api.telegram.org/bot${process.env.8733104653:AAH7zdDv0HmkEeWW11I5P9mUkL0sf1UKPBk}/sendMessage`;
        const response = await axios.post(telegramUrl, {
            chat_id: process.env.1323988810,
            text: receiptMessage,
            parse_mode: 'Markdown'
        });

        if (response.data.ok) {
            res.status(200).json({ ok: true, message: 'Order sent successfully' });
        } else {
            res.status(500).json({ ok: false, message: 'Telegram API error' });
        }

    } catch (error) {
        console.error("Error sending message:", error.response ? error.response.data : error.message);
        res.status(500).json({ ok: false, message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server ដំណើរការនៅលើ: http://localhost:${PORT}`);
});
