import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch('http://your-api-url/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao enviar e-mail de recuperação');
      }

      setSuccess(true);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar e-mail de recuperação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8 relative">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-blue-600 mb-2">
            Recuperar Senha
          </h1>
          <p className="text-gray-500">Digite seu e-mail para recuperar sua senha</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-xl text-sm">
            E-mail de recuperação enviado com sucesso! Verifique sua caixa de entrada.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-blue-50/50 border border-blue-100 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
              placeholder="Digite seu e-mail"
              required
              disabled={loading}
            />
          </div>

          <div className="text-sm text-center">
            <Link to="/" className="text-blue-600 hover:text-blue-700">
              Voltar para o login
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all transform hover:scale-[1.02] font-medium disabled:opacity-50 disabled:cursor-not-allowed ${loading ? 'animate-pulse' : ''}`}
          >
            {loading ? 'Enviando...' : 'Enviar e-mail de recuperação'}
          </button>
        </form>
      </div>
    </div>
  );
}