import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// GENERATE SCRIPTS
app.post('/api/generate-scripts', (req, res) => {
  res.json({ 
    success: true, 
    scripts: [{
      titulo: 'Script Teste',
      gancho: 'Hook aqui',
      desenvolvimento: 'Conteúdo',
      cta: 'Call to action'
    }]
  });
});

// AUTH SIGNUP
app.post('/api/auth/signup', (req, res) => {
  res.json({ success: true, user: { id: 'user123' } });
});

// AUTH LOGIN
app.post('/api/auth/login', (req, res) => {
  res.json({ success: true, user: { id: 'user123' } });
});

// Catch 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor na porta ${PORT}`));