import { useState } from 'react';

import logo from '../../../assets/media/lumii logo.svg';
import loginBtn from '../../../assets/media/state=default (2).svg';
import loginBtnClick from '../../../assets/media/state=selected (2).svg';

import styles from './Header.module.css';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();

  function handleClick() {
    setClicked(!clicked);
    navigate('/login');
  }

  return (
    <header className={styles.header}>
      <div className={styles.logoWrapper}>
        <img src={logo} alt="Lumii" className={styles.logoImage} />
      </div>

      <button className={styles.loginButton} onClick={() => handleClick()}>
        <img src={clicked ? loginBtnClick : loginBtn} alt="Prijava" />
      </button>
    </header>
  );
};
