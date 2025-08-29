import { Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext'
// Paginas
import { DashboardPage } from './features/dashboardHome/pages/DashboardPage';

import { LoginPage } from './features/login/pages/LoginPage';
import { RegisterPage } from './features/login/pages/RegisterPage';
import { ForgotPasswordPage } from './features/login/pages/ForgotPasswordPage';

import { ClientesCadastro } from './features/clientes/pages/ClientesCadastro'
import { ClientesPage } from './features/clientes/pages/ClientesPage'

import { Produtos } from './features/produtos/pages/Produtos'
import { ProdutosCadastro } from './features/produtos/pages/ProdutosCadastro'

import { VendasPage } from './features/vendas/pages/VendasPage'
import { VendasCadastro } from './features/vendas/pages/VendasCadastro'

import { DespesasPage } from './features/despesas/pages/DespesasPage'

import { FornecedoresPage } from './features/fornecedores/pages/FornecedoresPage'
import { ClienteVisualizarDados } from './features/clientes/pages/ClienteVisualizarDados';
import { ClienteEditarDados } from './features/clientes/pages/ClienteEditarDados';
import { ProdutoEditarDados } from './features/produtos/pages/ProdutoEditarDados';
import FornecedoresCadastro from './features/fornecedores/pages/FornecedoresCadastro';
import { FornecedorEditarDados } from './features/fornecedores/pages/FornecedoresEditarDados';
import { Oftalmologista } from './features/oftalmologista/pages/Oftalmologista';
import OftamologistaCadastro from './features/oftalmologista/pages/OftamologistaCadastro';

function App() {
  
  return (
    <AuthProvider>
      <div className='flex flex-row'>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/clientes/cadastrar" element={<ClientesCadastro />} />
          <Route path="/cliente/historico" element={<ClienteVisualizarDados />} />
          <Route path="/cliente/editar" element={<ClienteEditarDados />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/produtos/cadastrar" element={<ProdutosCadastro />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/produto/editar" element={<ProdutoEditarDados />} />
          <Route path="/vendas/cadastrar" element={<VendasCadastro />} />
          <Route path="/vendas" element={<VendasPage />} />
          <Route path="/despesas/cadastrar" element={<DespesasPage />} />
          <Route path="/despesas" element={<DespesasPage />} />
          <Route path="/fornecedores/cadastrar" element={<FornecedoresCadastro />} />
          <Route path="/fornecedores/editar" element={<FornecedorEditarDados />} />
          <Route path="/fornecedores" element={<FornecedoresPage />} />
          <Route path="/oftalmologista/editar" element={<FornecedorEditarDados />} />
          <Route path="/oftalmologista" element={<Oftalmologista />} />
          <Route path="/oftamologista/cadastrar" element={<OftamologistaCadastro />} />


          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;