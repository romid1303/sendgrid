const express = require('express');
const bodyParser = require('body-parser');
const { URLSearchParams } = require('url');

const app = express();
const PORT = 3000;

// Parse incoming JSON from SendGrid webhook
app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
    try {
        const formData = req.body;

        console.log('Received webhook data:', formData);

        // Convert to x-www-form-urlencoded
        const params = new URLSearchParams();
        for (const key in formData) {
            if (formData.hasOwnProperty(key)) {
                params.append(key, formData[key]);
            }
        }

        // Send POST request using fetch
        const response = await fetch('https://web-dev-team-429810.as.r.appspot.com/send-mail/web-dev', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer mail_89786',
            },
            body: params.toString(),
        });

        const result = await response.text(); // or .json() if it's JSON

        console.log('Forwarded successfully:', result);

        res.status(200).send('Webhook received and forwarded.');
    } catch (error) {
        console.error('Error forwarding webhook:', error);
        res.status(500).send('Failed to forward webhook.');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
