const express = require('express');
const twilio = require('twilio');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

app.post('/send-messages', async (req, res) => {
  const { messages } = req.body; // Expecting an array of { to, body } objects

  if (!Array.isArray(messages)) {
    return res.status(400).json({ success: false, error: 'Messages must be an array of { to, body } objects.' });
  }

  try {
    const results = await Promise.all(
      messages.map(({ to, body }) =>
        client.messages.create({
          from: process.env.TWILIO_Mobile_Number,  // Ensure the 'from' number is in the WhatsApp format
          to: `whatsapp:${to}`,      // Ensure the 'to' number is in the WhatsApp format
          body: `${body}`,
        })
      )
    );
    res.json({ success: true, results });
  } catch (error) {
    console.error('Error sending messages:', error);
    res.status(500).json({ success: false, error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
