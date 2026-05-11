import Layout from '@components/Layout';
import { AuthProvider } from '@context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppPaths } from 'common/routes/paths';
import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const queryClient = new QueryClient();
const LoginPage = lazy(() => import('@pages/LoginPage'));
const RegisterPage = lazy(() => import('@pages/RegisterPage'));

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path={AppPaths.LOGIN} element={<LoginPage />} />
            <Route path={AppPaths.REGISTER} element={<RegisterPage />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
