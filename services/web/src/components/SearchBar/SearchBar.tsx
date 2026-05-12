import styles from './SearchBar.module.css';

export const SearchBar = () => {
  return (
    <div className={styles.wrapper}>
      <input type="text" placeholder="Usluga, salon..." className={styles.input} />

      <input type="text" placeholder="Bilo gdje" className={styles.input} />

      <button className={styles.button}>Pretraži</button>
    </div>
  );
};
