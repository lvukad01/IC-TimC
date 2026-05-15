import cross from '@assets/media/cross.png';
import logo from '@assets/media/lumii logo.svg';

import useAuth from '@hooks/useAuth';
import { AppPaths } from 'common/routes/paths';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authenticated, logout } = useAuth();

  const isLoginPage = location.pathname === AppPaths.LOGIN;
  const isRegisterPage =
    location.pathname === AppPaths.REGISTER_CLIENT ||
    location.pathname === AppPaths.REGISTER_SALON_OWNER;

  const isSalonIntroPage = location.pathname === AppPaths.OWNER_SALON_INTRO;

  function goToLogin() {
    navigate(AppPaths.LOGIN);
  }

  function goHome() {
    navigate(AppPaths.HOME);
  }

  return (
    <header className={styles.header}>
      <div className={styles.logoWrapper}>
        <img src={logo} alt="Lumii" className={styles.logoImage} />
      </div>
      {isLoginPage || isRegisterPage || isSalonIntroPage ? (
        <button className={styles.closeButton} onClick={goHome}>
          <img src={cross} alt="Zatvori" />
        </button>
      ) : authenticated ? (
        <button className={styles.loginButton} onClick={logout}>
          Odjava
        </button>
      ) : (
        <button className={styles.loginButton} onClick={goToLogin}>
          Prijava
        </button>
      )}
    </header>
  );
};

export default Header;
