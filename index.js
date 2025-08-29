const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // If using Node.js < 18
const { URLSearchParams } = require('url');

const dotenv = require('dotenv');
dotenv.config();


const app = express();
const PORT = 3000;

// Parse incoming JSON from SendGrid webhook
app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
    try {
        const formData = req.body;

        console.log('Received webhook data:', formData);

        // Construct the payload you want to forward
        const postData = {
            body: JSON.stringify(formData), // You can change this based on actual need
            to: 'deepanshu.kumar@hbgknowledge.com',
            subject: 'Notification - Vendor Portal',
            from: 'no-reply@hbgknowledge.in'
        };

        // Send POST request using fetch
        const response = await fetch('https://web-dev-team-429810.as.r.appspot.com/send-mail/web-dev', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': process.env.AUTHORIZATION,
            },
           
            body: new URLSearchParams(postData).toString()
        });

        const result = await response.text(); // use .json() if API returns JSON

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
