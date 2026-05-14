import { getTodayBookingsCount } from '@api/todayBookingCount';
import styles from './SearchBar.module.css';
import locationIcon from '@assets/media/location1.svg';
import searchIcon from '@assets/media/search.svg';
import { AppPaths } from 'common/routes/paths';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const SearchBar = () => {
  const [todayCount, setTodayCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  useEffect(() => {
    if (location.state?.category) setCategory(location.state.category);
    if (location.state?.city) setCity(location.state.city);
  }, [location.state]);

  const handleSearch = () => {
    navigate(AppPaths.SEARCH_RESULTS, { state: { category, city } });
  };

  useEffect(() => {
    getTodayBookingsCount()
      .then((data) => setTodayCount(data.count ?? 0))
      .catch(() => setTodayCount(0));
  }, []);

  return (
    <div className={styles.textHolder}>
      <section className={styles.wrapper}>
        <div className={styles.inputWrapper}>
          <img src={searchIcon} alt="" className={styles.icon} />

          <input
            onFocus={() =>
              navigate(AppPaths.SEARCH_SERVICE, {
                state: {
                  category,
                  city,
                },
              })
            }
            type="text"
            placeholder="Usluga, salon..."
            className={styles.input}
            value={category}
            readOnly
          />
        </div>

        <div className={styles.inputWrapper}>
          <img src={locationIcon} alt="" className={styles.icon} />

          <input
            onFocus={() =>
              navigate(AppPaths.SEARCH_LOCATION, {
                state: {
                  category,
                  city,
                },
              })
            }
            type="text"
            placeholder="Bilo gdje"
            className={styles.input}
            value={city}
            readOnly
          />
        </div>

        <button onClick={handleSearch} className={styles.button}>
          Pretraži
        </button>
      </section>

      <p className={styles.todayCount}>
        <b>{todayCount}</b> termina zakazano danas
      </p>
    </div>
  );
};
