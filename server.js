import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = 3000;

const CLIENT_ID = process.env.PAPAGO_API_CLIENT_ID;
const CLIENT_SECRET = process.env.PAPAGO_API_CLIENT_SECRET;

app.use(express.static('public'));
app.use(express.json());
app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.post('/detectLangs', async (req, res) => {
    const api_url = 'https://naveropenapi.apigw.ntruss.com/langs/v1/dect';
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'x-ncp-apigw-api-key-id': CLIENT_ID,
        'x-ncp-apigw-api-key': CLIENT_SECRET
    };
    try {
        const response = await fetch(api_url, {
            method: 'POST',
            headers: headers,
            body: `${req.body.query}`
        });
        const data = await response.json();
        console.log(data);
        data.statusCode = response.status;
        res.status(response.status).json(data);

    } catch (error) {
        console.error('Error detecting language:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/translate', async (req, res) => {
    const { source, target, text } = req.body;
    const api_url = 'https://naveropenapi.apigw.ntruss.com/nmt/v1/translation';
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'x-ncp-apigw-api-key-id': CLIENT_ID,
        'x-ncp-apigw-api-key': CLIENT_SECRET
    };
    const body = `source=${source}&target=${target}&text=${text}`;

    try {
        const response = await fetch(api_url, {
            method: 'POST',
            headers: headers,
            body: body
        });
        const data = await response.json();
        console.log(data);
        data.statusCode = response.status;
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Error translating text:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});