import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import cors from 'cors';
import express from 'express';



const app = express();
const port = 3000; // Pode ser ajustado conforme necessário
app.use(cors());
app.use(express.static('public'));
app.use(express.json()); // Para interpretar requisições JSON

const API_KEY = "AIzaSyCdUao1tfMxvhoN10g-JWnAo6haxVUkg8s";
const MODEL_NAME = "gemini-1.0-pro";

const GENERATION_CONFIG = {
    temperature: 0.7,
    maxOutputTokens: 2048
};

const SAFETY_SETTINGS = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    }
];

app.post('/chat', async (req, res) => {
    try {
        const { userInput } = req.body;

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = await genAI.getGenerativeModel({ model: MODEL_NAME });
        const chat = await model.startChat({
            generationConfig: GENERATION_CONFIG,
            safetySettings: SAFETY_SETTINGS,
            history: [],
        });



        app.get('/Home', (req, res) => {
            res.sendFile(__dirname + 'public/Home.html');
        });

        app.get('/Bcorp', (req, res) => {
            res.sendFile(__dirname + 'public/bcorp.html');
        });

        app.get('/Shield', (req, res) => {
            res.sendFile(__dirname + 'public/shield.html');
        });

        app.get('/Negocios', (req, res) => {
            res.sendFile(__dirname + 'public/negocios.html');
        });

        app.get('/Seguranca', (req, res) => {
            res.sendFile(__dirname + 'public/seguranca.html');
        });

        const result = await chat.sendMessage(userInput);

        if (result && result.response && result.response.candidates && result.response.candidates[0]) {
            const candidate = result.response.candidates[0];
            const response = candidate.content.parts[0].text;
            res.json({ response });
        } else {
            res.status(500).json({ error: 'Erro inesperado na resposta' });
        }
    } catch (error) {
        console.error('Erro encontrado:', error.message);
        res.status(500).json({ error: 'Erro ao processar a requisição' });
    }
});

app.listen(port, () => {
    console.log(`Servidor em execução em http://localhost:${port}`);
});
