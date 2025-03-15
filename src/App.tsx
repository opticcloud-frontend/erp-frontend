import { Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';
import { Header } from './layout/Header'
import { AuthProvider } from './contexts/AuthContext'
// Paginas
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ClientesCadastro } from './pages/clientes/ClientesCadastro'
import { Clientes } from './pages/clientes/Clientes'
import { ClientesPage } from './pages/clientes/ClientesPage'

import { Produtos } from './pages/produtos/Produtos'
import { ProdutosCadastro } from './pages/produtos/ProdutosCadastro'
import { VendasPage } from './pages/vendas/VendasPage'
import { VendasCadastro } from './pages/vendas/VendasCadastro'
import { DespesasPage } from './pages/despesas/DespesasPage'
import { FornecedoresPage } from './pages/fornecedores/FornecedoresPage'

function App() {
  return (
    <AuthProvider>
      <Header/>
      <div className='flex flex-row'>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/clientes/cadastrar" element={<ClientesCadastro />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/produtos/cadastrar" element={<ProdutosCadastro />} />
          <Route path="/vendas" element={<VendasPage />} />
          <Route path="/vendas/nova" element={<VendasCadastro />} />
          <Route path="/despesas" element={<DespesasPage />} />
          <Route path="/fornecedores" element={<FornecedoresPage />} />

          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;