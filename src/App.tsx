import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { PrivateRoute } from './components/PrivateRoute';
import { ClientesPage } from './pages/clientes/ClientesPage'
import { ProdutosPage } from './pages/produtos/ProdutosPage'
import { VendasPage } from './pages/vendas/VendasPage'
import { DespesasPage } from './pages/despesas/DespesasPage'
import { FornecedoresPage } from './pages/fornecedores/FornecedoresPage'
import { Header } from './layout/Header'

function App() {
  return (
    <>
      <Header/>
      <div className='flex flex-row'>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/clientes/cadastrar" element={<ClientesPage />} />
          <Route path="/produtos" element={<ProdutosPage />} />
          <Route path="/vendas" element={<VendasPage />} />
          <Route path="/despesas" element={<DespesasPage />} />
          <Route path="/fornecedores" element={<FornecedoresPage />} />

          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;