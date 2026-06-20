import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
  const key = process.env.ANTHROPIC_API_KEY;
  res.json({ hasKey: !!key, keyExists: key ? 'SIM' : 'NÃO' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/generate-scripts', async (req, res) => {
  try {
    const { userData } = req.body;
    const { niche } = userData;

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.json({ success: false, error: 'API Key não configurada', scripts: [] });
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `Gere 5 scripts virais para: ${niche}\n\nRetorne APENAS JSON com 5 scripts completos com: titulo, gancho, desenvolvimento, cta, duracao, dificuldade`
      }]
    });

    const text = message.content[0].text;
    const json = JSON.parse(text);

    res.json({ success: true, scripts: json.scripts || [] });

  } catch (error) {
    res.json({ success: false, error: error.message, scripts: [] });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor ${PORT}`));