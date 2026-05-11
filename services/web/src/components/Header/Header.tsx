import logo from '../../assets/media/lumii logo.svg';
import loginBtn from '../../assets/media/state=default (2).svg';
import styles from './Header.module.css';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoWrapper}>
        <img src={logo} alt="Lumii" className={styles.logoImage} />
      </div>

      <button className={styles.loginButton}>
        <img src={loginBtn} alt="Prijava" />
      </button>
    </header>
  );
};
