import Layout from '@components/Layout';
import { AuthProvider } from '@context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from 'common/boundary/ErrorBoundary';
import { AppPaths } from 'common/routes/paths';
import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const queryClient = new QueryClient();

const HomePage = lazy(() => import('@pages/HomePage'));
const LoginPage = lazy(() => import('@pages/LoginPage'));
const RegisterClientPage = lazy(() => import('@pages/RegisterClientPage'));
const RegisterOwnerPage = lazy(() => import('@pages/RegisterOwnerPage'));
const SearchLocationPage = lazy(() => import('@pages/SearchPage/SearchLocationPage'));
const SearchResultsPage = lazy(() => import('@pages/SearchPage/SearchResultsPage'));
const SearchServicePage = lazy(() => import('@pages/SearchPage/SearchServicePage'));
const DateTimePage = lazy(() => import('@pages/DateTimePage/DateTimePage'));
const ViewMorePage = lazy(() => import('@pages/ViewMorePage/ViewMorePage'));
const OwnerSalonIntro = lazy(() => import('@pages/SalonRegistrationIntro'));

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
              <Route path={AppPaths.OWNER_SALON_INTRO} element={<OwnerSalonIntro />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
