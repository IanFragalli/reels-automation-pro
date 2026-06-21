import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// TESTE 1: Chave existe?
app.get('/api/debug1', (req, res) => {
  const key = process.env.ANTHROPIC_API_KEY;
  res.json({ 
    teste: 'chave', 
    existe: !!key,
    primeiros10: key ? key.substring(0, 10) : 'VAZIO'
  });
});

// TESTE 2: Consegue conectar?
app.get('/api/debug2', async (req, res) => {
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    res.json({ teste: 'conexao', status: 'ok', cliente: 'criado' });
  } catch (e) {
    res.json({ teste: 'conexao', erro: e.message });
  }
});

// TESTE 3: Consegue chamar a IA?
app.get('/api/debug3', async (req, res) => {
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: 'Responda apenas: OK'
      }]
    });
    
    res.json({ 
      teste: 'ia',
      status: 'ok',
      resposta: message.content[0].text
    });
  } catch (e) {
    res.json({ teste: 'ia', erro: e.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor ${PORT}`));