import React, { useState } from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState('welcome');
  const [data, setData] = useState({});

  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex flex-col items-center justify-center">
        <Sparkles className="text-purple-600 mb-4" size={48} />
        <h1 className="text-5xl font-bold text-purple-600 mb-4">Reels Automation Pro</h1>
        <p className="text-gray-700 text-xl mb-8">Gere scripts virais em 60 segundos</p>
        <button
          onClick={() => setStep('form')}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-bold flex items-center gap-2"
        >
          Gerar Scripts <ChevronRight size={20} />
        </button>
      </div>
    );
  }

  if (step === 'form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
          <h2 className="text-2xl font-bold mb-6">Qual é seu nicho?</h2>
          <input
            type="text"
            placeholder="Ex: Marketing, Saúde, E-commerce..."
            className="w-full border-2 border-gray-300 rounded-lg p-4 mb-6"
            onChange={(e) => setData({ niche: e.target.value })}
          />
          <button
            onClick={() => setStep('results')}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold"
          >
            Gerar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Seus Scripts!</h2>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-gray-700 mb-4">Script 1: Os 3 segredos que ninguém fala</p>
          <p className="text-gray-700 mb-4">Script 2: Antes vs Depois</p>
          <p className="text-gray-700 mb-4">Script 3: Dica Rápida</p>
          <button
            onClick={() => setStep('welcome')}
            className="mt-8 bg-gray-500 text-white px-8 py-2 rounded-lg"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}