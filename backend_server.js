import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/debug-prompt', async (req, res) => {
  try {
    const niche = 'Marketing Digital'; // teste fixo
    
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 3000,
      messages: [{
        role: 'user',
        content: `Gere 5 scripts para: ${niche}. Retorne JSON com "scripts" array com EXATAMENTE 5 objetos.`
      }]
    });
    
    const text = message.content[0].text;
    
    res.json({ 
      resposta_ia: text.substring(0, 500),
      resposta_completa_length: text.length,
      tem_5_scripts: (text.match(/"titulo":/g) || []).length
    });
  } catch (error) {
    res.json({ erro: error.message });
  }
});

app.post('/api/generate-scripts', async (req, res) => {
  try {
    const niche = req.body?.userData?.niche || 'geral';
    
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 3000,
      messages: [{
        role: 'user',
        content: `Você é um especialista em scripts virais para Instagram Reels.

TAREFA: Gere EXATAMENTE 5 scripts DIFERENTES e ESPECÍFICOS para o nicho: "${niche}"

IMPORTANTE: Cada script deve ser ÚNICO, com conteúdo ESPECÍFICO do nicho, NÃO genérico.

Retorne APENAS este JSON, sem explicações:
{
  "scripts": [
    {
      "titulo": "Script 1 - Título específico para ${niche}",
      "gancho": "Hook específico que chama atenção sobre ${niche}",
      "desenvolvimento": "Conteúdo detalhado e específico para ${niche}",
      "cta": "Call-to-action específico para ${niche}",
      "duracao": "22s",
      "dificuldade": "Fácil"
    },
    {
      "titulo": "Script 2 - DIFERENTE do anterior",
      "gancho": "Hook DIFERENTE - outro ângulo sobre ${niche}",
      "desenvolvimento": "Conteúdo DIFERENTE - outro aspecto de ${niche}",
      "cta": "CTA DIFERENTE",
      "duracao": "25s",
      "dificuldade": "Médio"
    },
    {
      "titulo": "Script 3 - TERCEIRA abordagem",
      "gancho": "Hook NOVO - terceiro ângulo sobre ${niche}",
      "desenvolvimento": "Conteúdo NOVO - terceiro aspecto",
      "cta": "CTA NOVO",
      "duracao": "22s",
      "dificuldade": "Fácil"
    },
    {
      "titulo": "Script 4 - QUARTA abordagem",
      "gancho": "Hook DIFERENTE - quarto ângulo",
      "desenvolvimento": "Conteúdo DIFERENTE - quarto aspecto",
      "cta": "CTA DIFERENTE",
      "duracao": "28s",
      "dificuldade": "Médio"
    },
    {
      "titulo": "Script 5 - QUINTA abordagem",
      "gancho": "Hook NOVO - quinto ângulo",
      "desenvolvimento": "Conteúdo NOVO - quinto aspecto",
      "cta": "CTA NOVO",
      "duracao": "22s",
      "dificuldade": "Fácil"
    }
  ]
}`
      }]
    });
    
    const text = message.content[0].text;
    console.log('Resposta IA:', text.substring(0, 300));
    
    let scripts = [];
    try {
      const json = JSON.parse(text);
      scripts = json.scripts || [];
      console.log('Scripts gerados:', scripts.length);
    } catch (parseError) {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const json = JSON.parse(jsonMatch[0]);
        scripts = json.scripts || [];
      }
    }
    
    res.json({ success: true, scripts: scripts, count: scripts.length });
  } catch (error) {
    console.error('Erro:', error.message);
    res.json({ success: false, error: error.message, scripts: [] });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Rodando ${PORT}`));