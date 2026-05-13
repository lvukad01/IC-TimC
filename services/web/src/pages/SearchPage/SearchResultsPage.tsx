import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './SearchPage.module.css';

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [salons, setSalons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (state?.search) params.append('search', state.search);
    if (state?.city) params.append('city', state.city);
    if (state?.category && state.category !== 'Sve') {
      params.append('category', state.category.toUpperCase().replace(' ', '_'));
    }

    fetch(`http://localhost:3000/api/salons?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setSalons(data.results ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <section className={styles.page}>
      <div className={styles.topbar}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ←
        </button>
        <span className={styles.filterLabel}>
          {state?.category || 'Sve'} • {state?.city || 'Bilo gdje'}
        </span>
      </div>

      {loading ? (
        <p className={styles.loading}>Učitavanje...</p>
      ) : salons.length === 0 ? (
        <p className={styles.empty}>Nema rezultata</p>
      ) : (
        <div className={styles.list}>
          {salons.map((salon) => (
            <article
              key={salon.id}
              className={styles.card}
              onClick={() => navigate(`/salons/${salon.id}`)}
            >
              <div className={styles.imageWrapper}>
                <img src={salon.media?.[0]?.url ?? ''} alt={salon.name} className={styles.image} />
                <button className={styles.heart}>♡</button>
              </div>
              <div className={styles.info}>
                <div className={styles.nameRow}>
                  <h2>{salon.name}</h2>
                  <span>★ {salon.avgRating?.toFixed(1) ?? '—'}</span>
                </div>
                <p>{salon.city}</p>
                <p>{salon.street}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default SearchResultsPage;
