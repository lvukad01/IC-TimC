import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './SearchPage.module.css';
import { getSalons } from '@api/salons';

const SearchLocationPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [filtered, setFiltered] = useState<string[]>([]);

  useEffect(() => {
    getSalons()
      .then((res) => res.json())
      .then((data) => {
        const uniqueCities = [...new Set<string>(data.results?.map((s: any) => s.city) ?? [])];
        setCities(uniqueCities);
        setFiltered(uniqueCities);
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
    navigate('/', { state: { city } });
  };

  const handleMyLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      navigate('/', { state: { lat: pos.coords.latitude, lng: pos.coords.longitude } });
    });
  };

  return (
    <section className={styles.page}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        ←
      </button>
      <h1 className={styles.title}>Lokacija</h1>
      <input
        className={styles.input}
        placeholder="Bilo gdje"
        autoFocus
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button className={styles.locationBtn} onClick={handleMyLocation}>
        📍 Koristi moju lokaciju
      </button>
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
