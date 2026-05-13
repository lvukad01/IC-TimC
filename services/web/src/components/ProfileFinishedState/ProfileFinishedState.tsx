import checkcircle from '@assets/media/checkcircle.svg';
import styles from './ProfileFinishedState.module.scss';

const ProfileFinishedState = () => {
  return (
    <div className={styles.container}>
      <img className={styles.check} src={checkcircle} alt="gotovo" />
      <h1 className={styles.message}>Vaš profil je gotov!</h1>
    </div>
  );
};

export default ProfileFinishedState;
