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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Generate scripts with AI
app.post('/api/generate-scripts', async (req, res) => {
  try {
    const { userData } = req.body;
    const { niche } = userData;

    if (!niche) {
      return res.status(400).json({ error: 'Nicho é obrigatório' });
    }

    // Prompt em português para gerar scripts virais
    const prompt = `Você é um especialista em conteúdo viral para Instagram Reels.

Gere exatamente 5 scripts de vídeo viral para o nicho: "${niche}"

Cada script deve ter:
- Um título catchy
- Um gancho irresistível (primeiros 3 segundos)
- Desenvolvimento do conteúdo
- Um CTA (call-to-action) claro
- Duração recomendada (sempre 22-30 segundos)
- Nível de dificuldade (Fácil/Médio/Difícil)

Retorne APENAS em formato JSON válido, sem markdown, sem explicações:
{
  "scripts": [
    {
      "titulo": "Título do script",
      "gancho": "Hook irresistível que prende o espectador",
      "desenvolvimento": "Desenvolvimento do conteúdo que resolve o problema",
      "cta": "Call-to-action claro e direto",
      "duracao": "22s",
      "dificuldade": "Fácil"
    }
  ]
}`;

    console.log('🎬 Gerando scripts com IA para nicho:', niche);

    // Chamada à API Anthropic
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extrair texto da resposta
    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    console.log('📝 Resposta da IA:', responseText.substring(0, 200));

    // Parsear JSON
    let scripts;
    try {
      // Tenta extrair JSON da resposta
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        scripts = parsed.scripts || [];
      } else {
        throw new Error('JSON não encontrado na resposta');
      }
    } catch (parseError) {
      console.error('❌ Erro ao fazer parse do JSON:', parseError.message);
      console.error('Resposta recebida:', responseText);
      
      // Fallback: mock scripts
      scripts = [
        {
          titulo: 'Os 3 Segredos que Ninguém Fala',
          gancho: 'Você está fazendo errado desde o início',
          desenvolvimento: 'A maioria não sabe disto. Aqui estão os 3 segredos que mudaram tudo',
          cta: 'Salva esse vídeo e compartilha com um amigo',
          duracao: '22s',
          dificuldade: 'Fácil'
        }
      ];
    }

    console.log('✅ Scripts gerados:', scripts.length);

    res.json({
      success: true,
      scripts: scripts,
      niche: niche,
    });

  } catch (error) {
    console.error('❌ Erro ao gerar scripts:', error.message);
    
    res.status(500).json({
      error: