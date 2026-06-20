import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const anthropic = new Anthropic();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/generate-scripts', async (req, res) => {
  res.json({ success: true, scripts: [] });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor na porta ${PORT}`));