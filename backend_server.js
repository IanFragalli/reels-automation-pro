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
    const body = req.body;
    const userData = body.userData || {};
    const niche = userData.niche || 'geral';

    console.log('Nicho recebido:', niche);

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.json({ 
        success: false, 
        error: 'API Key não configurada', 
        scripts: [] 
      });
    }

    const anthropic = new Anthropic({ 
      apiKey: process.env.ANTHROPIC_API_KEY 
    });

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `Gere 5 scripts DIFERENTES para Instagram Reels sobre: ${niche}

Retorne APENAS JSON com esta estrutura:
{
  "scripts": [
    {"titulo":"Título 1","gancho":"Hook 1","desenvolvimento":"Conteúdo 1","cta":"CTA 1","duracao":"22s","dificuldade":"Fácil"},
    {"titulo":"Título 2","gancho":"Hook 2","desenvolvimento":"Conteúdo 2","cta":"CTA 2","duracao":"22s","dificuldade":"Fácil"},
    {"titulo":"Título 3","gancho":"Hook 3","desenvolvimento":"Conteúdo 3","cta":"CTA 3","duracao":"22s","dificuldade":"Fácil"},
    {"titulo":"Título 4","gancho":"Hook 4","desenvolvimento":"Conteúdo 4","cta":"CTA 4","duracao":"22s","dificuldade":"Fácil"},
    {"titulo":"Título 5","gancho":"Hook 5","desenvolvimento":"Conteúdo 5","cta":"CTA 5","duracao":"22s","dificuldade":"Fácil"}
  ]
}`
      }]
    });

    const text = message.content[0].text;
    console.log('Resposta IA (primeiros 200 chars):', text.substring(0, 200));

    let scripts = [];
    try {
      const json = JSON.parse(text);
      scripts = json.scripts || [];
      console.log('Scripts extraídos:', scripts.length);
    } catch (parseError) {
      console.error('Erro ao fazer parse:', parseError.message);
      // Tenta extrair JSON se estiver embutido
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const json = JSON.parse(jsonMatch[0]);
        scripts = json.scripts || [];
      }
    }

    res.json({ 
      success: true, 
      scripts: scripts,
      niche: niche 
    });

  } catch (error) {
    console.error('Erro geral:', error.message);
    res.json({ 
      success: false, 
      error: error.message, 
      scripts: [] 
    });
  }
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor ${PORT}`));