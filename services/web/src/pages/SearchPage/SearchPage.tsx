import { useState } from 'react';
import styles from './SearchPage.module.css';

const serviceSuggestions = ['sve', 'kosa', 'nokti', 'make up'];
const locationSuggestions = ['Zagreb', 'Split', 'Rijeka', 'Osijek'];

export const SearchPage = () => {
  const [activeInput, setActiveInput] = useState<'service' | 'location' | null>(null);

  return (
    <div className={styles.textHolder}>
      <section className={styles.wrapper}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Usluga, salon..."
            className={styles.input}
            onFocus={() => setActiveInput('service')}
          />

          {activeInput === 'service' && (
            <div className={styles.suggestions}>
              {serviceSuggestions.map((item) => (
                <button key={item} className={styles.chip}>
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Bilo gdje"
            className={styles.input}
            onFocus={() => setActiveInput('location')}
          />

          {activeInput === 'location' && (
            <div className={styles.suggestions}>
              {locationSuggestions.map((item) => (
                <button key={item} className={styles.chip}>
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className={styles.button}>Pretraži</button>
      </section>
    </div>
  );
};
