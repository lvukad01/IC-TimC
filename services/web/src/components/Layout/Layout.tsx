import Header from '@components/Home/Header';
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
          top: 130,
          right: 20,
        }}
        toastOptions={{
          style: {
            fontSize: '20px',
            color: 'white',
            background: 'rgba(30,30,30,0.8)',
            boxShadow: '0px 2px 10px #ffb3b3',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
      <Header />

      <main>{children}</main>
    </div>
  );
};

export default Layout;
