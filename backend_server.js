import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/generate-scripts', async (req, res) => {
  try {
    const niche = req.body?.userData?.niche || 'general';
    
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `Gere 5 scripts para: ${niche}. Retorne JSON com scripts array contendo 5 objetos com campos: titulo, gancho, desenvolvimento, cta, duracao, dificuldade`
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
app.listen(PORT, () => console.log(`Rodando ${PORT}`));