import Layout from '@components/Layout';
import { AuthProvider } from '@context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from 'common/boundary/ErrorBoundary';
import { AppPaths } from 'common/routes/paths';
import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const queryClient = new QueryClient();
const LoginPage = lazy(() => import('@pages/LoginPage'));
const RegisterClientPage = lazy(() => import('@pages/RegisterClientPage'));
const RegisterOwnerPage = lazy(() => import('@pages/RegisterOwnerPage'));

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path={AppPaths.LOGIN} element={<LoginPage />} />
              <Route path={AppPaths.REGISTER_CLIENT} element={<RegisterClientPage />} />
              <Route path={AppPaths.REGISTER_SALON_OWNER} element={<RegisterOwnerPage />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
