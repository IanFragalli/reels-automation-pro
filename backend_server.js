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

    const prompt = `Você é um especialista em scripts virais para Instagram Reels.

Tarefa: Gere EXATAMENTE 5 scripts diferentes para o nicho: ${niche}

IMPORTANTE: Cada script DEVE ter os 6 campos abaixo. Nenhum campo pode estar vazio.

Retorne UM JSON válido com esta estrutura:
{
  "scripts": [
    {
      "titulo": "Título catchy e atraente",
      "gancho": "Primeira linha que prende atenção (0-3 segundos)",
      "desenvolvimento": "Conteúdo completo que resolve o problema ou curiosidade",
      "cta": "Call-to-action claro e direto (exemplo: Salva esse vídeo)",
      "duracao": "22s",
      "dificuldade": "Fácil"
    },
    {
      "titulo": "Segundo script diferente",
      "gancho": "Hook diferente do anterior",
      "desenvolvimento": "Conteúdo diferente",
      "cta": "CTA diferente",
      "duracao": "25s",
      "dificuldade": "Médio"
    }
  ]
}

REGRAS:
1. SEMPRE retorne EXATAMENTE 5 scripts
2. TODOS os 6 campos devem estar preenchidos
3. Retorne APENAS JSON, sem explicações
4. Não adicione campos extras
5. Cada script deve ser DIFERENTE do anterior
6. Conteúdo em PORTUGUÊS do Brasil

Agora gere:`;

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = message.content[0].text;
    console.log('📝 Resposta IA (primeiros 300 chars):', responseText.substring(0, 300));

    let scripts = [];
    try {
      // Tenta fazer parse direto
      scripts = JSON.parse(responseText).scripts || [];
      console.log('✅ Scripts parseados:', scripts.length);
    } catch (e) {
      console.error('❌ Erro parse 1:', e.message);
      
      // Tenta extrair JSON se estiver embutido
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          scripts = JSON.parse(jsonMatch[0]).scripts || [];
          console.log('✅ JSON extraído:', scripts.length);
        } catch (e2) {
          console.error('❌ Erro parse 2:', e2.message);
        }
      }
    }

    // Validação: certificar que tem todos os campos
    const scriptsValidos = scripts.filter(s => 
      s.titulo && s.gancho && s.desenvolvimento && s.cta && s.duracao && s.dificuldade
    );

    console.log('✅ Scripts válidos:', scriptsValidos.length, 'de', scripts.length);

    res.json({ 
      success: true, 
      scripts: scriptsValidos.length > 0 ? scriptsValidos : scripts,
      count: scriptsValidos.length
    });

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
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});