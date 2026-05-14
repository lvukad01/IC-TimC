import cross from '@assets/media/cross.png';
import loginBtn from '@assets/media/loginBtn.svg';
import logo from '@assets/media/lumii logo.svg';

import { AppPaths } from 'common/routes/paths';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname === AppPaths.LOGIN;
  const isRegisterPage =
    location.pathname === AppPaths.REGISTER_CLIENT ||
    location.pathname === AppPaths.REGISTER_SALON_OWNER;

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

      {isLoginPage || isRegisterPage ? (
        <button className={styles.loginButton} onClick={goHome}>
          <img src={cross} alt="Zatvori" />
        </button>
      ) : (
        <button className={styles.loginButton} onClick={goToLogin}>
          <img src={loginBtn} alt="Prijava" />
        </button>
      )}
    </header>
  );
};

export default Header;
