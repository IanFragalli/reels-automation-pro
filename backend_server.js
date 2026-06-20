import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/generate-scripts', (req, res) => {
  res.json({ 
    success: true, 
    scripts: [
      { titulo: 'Script 1', gancho: 'Hook 1' },
      { titulo: 'Script 2', gancho: 'Hook 2' }
    ]
  });
});

app.post('/api/auth/signup', (req, res) => {
  res.json({ success: true });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ success: true });
});

// Error handler
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada: ' + req.path });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});