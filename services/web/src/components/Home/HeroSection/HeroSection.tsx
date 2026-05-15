import styles from './HeroSection.module.scss';
import { useEffect, useState } from 'react';

const texts = [
  { label: 'frizuru', className: 'hairText' },
  { label: 'šminku', className: 'makeupText' },
  { label: 'nokte', className: 'nailsText' },
];
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
        <h1 className={styles.title}>Rezerviraj svoj termin za</h1>

        <div className={styles.dynamicWrapper}>
          <span
            className={`${styles.dynamicText} ${styles[texts[current].className]} ${
              next !== null ? styles.slideOut : styles.currentText
            }`}
          >
            {texts[current].label}
          </span>

          {next !== null && (
            <span
              className={`${styles.dynamicText} ${styles[texts[next].className]} ${
                styles.slideInFromRight
              }`}
            >
              {texts[next].label}
            </span>
          )}
        </div>
      </div>
    </section>
  );
};
