import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './SearchPage.module.scss';
import { getSalons } from '@api/salons';
import LocalStorage from '@helpers/LocalStorage';

const SearchLocationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [filtered, setFiltered] = useState<string[]>([]);
  const token = LocalStorage.getAccessToken();

  useEffect(() => {
    getSalons()
      .then((data) => {
        console.log('getSalons data', data);

        const results = data?.results ?? data?.data?.results ?? data?.data ?? [];

        const uniqueCities = [...new Set<string>(results.map((s: any) => s.city).filter(Boolean))];

        console.log('cities', uniqueCities);

        setCities(uniqueCities);
        setFiltered(uniqueCities);
      })
      .catch((error) => {
        console.error('Failed to fetch cities:', error);
        setCities([]);
        setFiltered([]);
      });
  }, []);
  useEffect(() => {
    if (search === '') {
      setFiltered(cities);
    } else {
      setFiltered(cities.filter((c) => c.toLowerCase().includes(search.toLowerCase())));
    }
  }, [search, cities]);

  const handleSelect = (city: string) => {
    navigate('/', {
      state: {
        ...location.state,
        city,
        useMyLocation: false,
      },
    });
  };

  const handleMyLocation = () => {
    navigate('/', {
      state: {
        ...location.state,
        city: 'Moja lokacija',
        useMyLocation: true,
      },
    });
  };

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className={styles.title}>Lokacija</h1>
      </div>
      <input
        className={styles.input}
        placeholder="Bilo gdje"
        autoFocus
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {token && (
        <button className={styles.locationBtn} onClick={handleMyLocation}>
          📍 Koristi moju lokaciju
        </button>
      )}

      <div className={styles.cityList}>
        {filtered.map((city) => (
          <button key={city} className={styles.cityItem} onClick={() => handleSelect(city)}>
            {city}
          </button>
        ))}
      </div>
    </section>
  );
};

export default SearchLocationPage;
