import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  const key = process.env.ANTHROPIC_API_KEY;
  res.json({ 
    hasKey: !!key,
    keyExists: key ? 'SIM' : 'NÃO'
  });
});

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Generate scripts
app.post('/api/generate-scripts', async (req, res) => {
  try {
    const { userData } = req.body;
    const { niche } = userData;

    // Verificar se tem chave
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.json({
        success: false,
        error: 'API Key não configurada',
        scripts: []
      });
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `Gere 5 scripts virais para: ${niche}\n\nRetorne APENAS este JSON:\n{\n  "scripts": [\n    {"titulo":"T1","gancho":"G1","desenvolvimento":"D1","cta":"C1","duracao":"22s","dificuldade":"Fácil"},\n    {"titulo":"T2","gancho":"G2","desenvolvimento":"D2","cta":"C2","duracao":"22s","dificuldade":"Fácil"},\n    {"titulo":"T3","gancho":"G3","desenvolvimento":"D3","cta":"C3","duracao":"22s","dificuldade":"Fácil"},\n    {"titulo":"T4","gancho":"G4","desenvolvimento":"D4","cta":"C4","duracao":"22s","dificuldade":"Fácil"},\n    {"titulo":"T5","gancho":"G5","desenvolvimento":"D5","cta":"C5","duracao":"22s","dificuldade":"Fácil"}\n  ]\n}`
      }]
    });

    const text = message.content[0].text;
    const json = JSON.parse(text);

    res.json({ success: true, scripts: json.scripts || [] });

  } catch (error) {
    console.error('Erro:', error.message);
    res.json({ success: false, error: error.message, scripts: [] });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor ${PORT}`));