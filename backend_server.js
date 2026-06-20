import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const app = express();
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/generate-scripts', async (req, res) => {
  try {
    const { userData } = req.body;
    const { niche } = userData;

    console.log('🎬 Gerando scripts para:', niche);

    const prompt = `Gere 5 scripts virais para Instagram Reels sobre: ${niche}

Retorne UM JSON válido com esta estrutura EXATA:
{
  "scripts": [
    {
      "titulo": "Título aqui",
      "gancho": "Hook aqui",
      "desenvolvimento": "Desenvolvimento aqui",
      "cta": "CTA aqui",
      "duracao": "22s",
      "dificuldade": "Fácil"
    }
  ]
}

SÓ RETORNE O JSON, NADA MAIS.`;

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = message.content[0].text;
    console.log('📝 Resposta da IA:', responseText.substring(0, 500));

    // Parse JSON
    let scripts = [];
    try {
      const parsed = JSON.parse(responseText);
      scripts = parsed.scripts || [];
      console.log('✅ Scripts parseados:', scripts.length);
    } catch (e) {
      console.error('❌ Erro ao fazer parse:', e.message);
      console.error('Resposta completa:', responseText);
      
      // Tenta extrair JSON se estiver embutido em texto
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          scripts = parsed.scripts || [];
          console.log('✅ JSON extraído com sucesso');
        } catch (e2) {
          console.error('❌ Ainda não conseguiu fazer parse');
        }
      }
    }

    // Se não conseguiu scripts, retorna fallback
    if (scripts.length === 0) {
      console.log('⚠️ Usando fallback data');
      scripts = [
        {
          titulo: 'Os 3 Segredos',
          gancho: 'Você não sabe isto',
          desenvolvimento: 'Explicação aqui',
          cta: 'Clique para saber mais',
          duracao: '22s',
          dificuldade: 'Fácil'
        }
      ];
    }

    res.json({ success: true, scripts });

  } catch (error) {
    console.error('❌ Erro:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/signup', (req, res) => {
  res.json({ success: true });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ success: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor na porta ${PORT}`);
});