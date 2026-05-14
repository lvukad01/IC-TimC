import styles from './BusinessSection.module.scss';
import businessPhone2 from '@assets/media/phone kalendar.svg';
import businessPhone1 from '@assets/media/2.svg';

export const BusinessSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <h2 className={styles.title}>
          Prijavi svoj <br /> biznis
        </h2>

        <p className={styles.description}>
          Neka vaš salon zablista uz najmoderniju platformu za rezervacije koju profesionalci biraju
          zbog jednostavnosti i elegancije.
        </p>

        <button className={styles.button}>Saznaj više →</button>
      </div>
      <div className={styles.phonesWrapper}>
        <img src={businessPhone1} alt="" className={styles.phoneLeft} />

        <img src={businessPhone2} alt="" className={styles.phoneRight} />
      </div>
    </section>
  );
};
