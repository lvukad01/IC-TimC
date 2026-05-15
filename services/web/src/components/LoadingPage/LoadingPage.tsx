import loadingIcon from '@assets/media/loading.svg';
import { useNavigate } from 'react-router-dom';
import styles from './LoadingPage.module.scss';

const LoadingPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ←
        </button>
      </header>

      <div className={styles.loading}>
        <img src={loadingIcon} alt="Loading" />
      </div>
    </div>
  );
};

export default LoadingPage;
