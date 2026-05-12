import styles from './SearchBar.module.css';

import locationIcon from '../../../assets/media/location1.svg';
import searchIcon from '../../../assets/media/search.svg';

export const SearchBar = () => {
  return (
    <div className={styles.textHolder}>
      <section className={styles.wrapper}>
        <div className={styles.inputWrapper}>
          <img src={searchIcon} alt="" className={styles.icon} />

          <input type="text" placeholder="Usluga, salon..." className={styles.input} />
        </div>

        <div className={styles.inputWrapper}>
          <img src={locationIcon} alt="" className={styles.icon} />

          <input type="text" placeholder="Bilo gdje" className={styles.input} />
        </div>

        <button className={styles.button}>Pretraži</button>
      </section>

      <p className={styles.todayCount}>
        <b>128</b> termina zakazano danas
      </p>
    </div>
  );
};
