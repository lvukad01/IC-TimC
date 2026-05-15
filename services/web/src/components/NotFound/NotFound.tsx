import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.scss';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ←
        </button>
      </header>

      <div className={styles.notFound}>
        <h1>Upss... Stranica nije pronađena :( </h1>
        <button className={styles.homeButton} onClick={() => navigate('/')}>
          Vrati me na početnu
        </button>
      </div>
    </div>
  );
};

export default NotFound;
