const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const accountSid = 'AC7cc3682562bdc6e23b53c0ed2a9841a7';
const authToken = 'e39a59f1eb1da8c1cfe565144bd87f0b';
const twilioClient = twilio(accountSid, authToken);

const apiKey = '28f03a7d662e4eaf58f85448481bd955';

app.post('/subscribe', async (req, res) => {
  const { phone, city } = req.body;
  console.log('Incoming request:', req.body); // Debugging

  try {
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    console.log('Weather data:', weatherResponse.data); // Debugging

    const weather = weatherResponse.data;

    const message = await twilioClient.messages.create({
      body: `Subscribed! Weather in ${city}: ${weather.weather[0].description}, Temp: ${weather.main.temp}°C`,
      from: '+17752699543',
      to: phone,
    });
    console.log('Twilio message sent:', message.sid); // Debugging

    res.status(200).send({ message: `Subscribed to weather updates for ${city}` });
  } catch (error) {
    console.error('Error subscribing user:', error);
    res.status(500).send({ message: 'Error subscribing to updates' });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
