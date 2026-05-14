import Layout from '@components/Layout';
import { AuthProvider } from '@context/AuthContext';
import HomePage from '@pages/HomePage';
import SearchLocationPage from '@pages/SearchPage/SearchLocationPage';
import { SearchPage } from '@pages/SearchPage/SearchPage';
import SearchResultsPage from '@pages/SearchPage/SearchResultsPage';
import SearchServicePage from '@pages/SearchPage/SearchServicePage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from 'common/boundary/ErrorBoundary';
import { AppPaths } from 'common/routes/paths';
import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import DateTimePage from '@pages/DateTimePage/DateTimePage';
import ViewMorePage from '@pages/ViewMorePage/ViewMorePage';

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
              <Route path={AppPaths.HOME} element={<HomePage />} />
              <Route path={AppPaths.SEARCH_SERVICE} element={<SearchServicePage />} />
              <Route path={AppPaths.SEARCH_LOCATION} element={<SearchLocationPage />} />
              <Route path={AppPaths.SEARCH_RESULTS} element={<SearchResultsPage />} />{' '}
              <Route path={AppPaths.DATE_TIME} element={<DateTimePage />} />
              <Route path="/salons/:type" element={<ViewMorePage />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
