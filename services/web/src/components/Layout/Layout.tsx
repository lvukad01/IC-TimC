import Header from '@components/Home/Header';
import { AppPaths } from 'common/routes/paths';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);

  return (
    <div>
      <Toaster
        position="top-right"
        containerStyle={{
          top: 20,
          right: 20,
        }}
        toastOptions={{
          style: {
            fontSize: '16px',
            color: 'white',
            background: 'rgba(30,30,30,0.8)',
            boxShadow: '0px 4px 4px var(--color-purple)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
      {(pathname === AppPaths.HOME || pathname === AppPaths.CLIENT_PROFILE) && <Header />}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
