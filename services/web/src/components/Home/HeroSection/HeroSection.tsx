import styles from './HeroSection.module.css';

import reserveTxt from '../../../assets/media/Rezerviraj svoj termin za.svg';
import hairTxt from '../../../assets/media/frizuru.svg';
import makeupTxt from '../../../assets/media/šminku.svg';
import nailsTxt from '../../../assets/media/nokte.svg';
import { useEffect, useState } from 'react';

const texts = [hairTxt, makeupTxt, nailsTxt];
const alts = ['frizuru', 'šminku', 'nokte'];

export const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (current + 1) % texts.length;
      setNext(nextIndex);
      setTimeout(() => {
        setCurrent(nextIndex);
        setNext(null);
      }, 400);
    }, 2500);

    return () => clearInterval(interval);
  }, [current]);

  return (
    <section className={styles.hero}>
      <div className={styles.titleWrapper}>
        <img src={reserveTxt} alt="Rezerviraj svoj termin za" className={styles.reserveText} />
        <div className={styles.dynamicWrapper}>
          <img
            src={texts[current]}
            alt={alts[current]}
            className={`${styles.dynamicText} ${
              next !== null ? styles.slideOut : styles.currentText
            }`}
          />

          {next !== null && (
            <img
              src={texts[next]}
              alt={alts[next]}
              className={`${styles.dynamicText} ${styles.slideInFromRight}`}
            />
          )}
        </div>
      </div>
    </section>
  );
};
