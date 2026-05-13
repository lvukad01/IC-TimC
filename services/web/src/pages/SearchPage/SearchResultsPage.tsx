import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './SearchPage.module.css';
import { api } from '../../api';
import { SalonCard } from '../../components/Home/SalonCard/SalonCard';
import { AppPaths } from 'common/routes/paths';
import { getSignedFiles } from '@api/files';

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [salons, setSalons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();

    if (state?.search) params.append('search', state.search);
    if (state?.city) params.append('city', state.city);
    if (state?.category && state.category !== 'Sve' && state.category !== 'ALL') {
      params.append('category', state.category.toUpperCase().replace(' ', '_'));
    }
    if (state?.date) params.append('date', state.date);
    if (state?.serviceId) params.append('serviceId', state.serviceId);

    api
      .get(`/salons?${params.toString()}`)
      .then(async (data) => {
        const results = data?.results ?? data ?? [];

        const keys = results.map((salon: any) => salon.profileImageKey).filter(Boolean);

        const signedData = keys.length > 0 ? await getSignedFiles(keys) : { files: [] };

        const urlMap = new Map<string, string>(
          signedData.files.map((file) => [file.key, file.url]),
        );

        const salonsWithImages = results.map((salon: any) => ({
          ...salon,
          imageUrl: salon.profileImageKey ? (urlMap.get(salon.profileImageKey) ?? null) : null,
        }));

        setSalons(salonsWithImages);
      })
      .catch((error) => {
        console.error(error);
        setSalons([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [state]);

  return (
    <section className={styles.page}>
      <div className={styles.topbar}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ←
        </button>

        <span className={styles.filterLabel}>{state?.category || 'Sve'}</span>

        <button
          className={styles.timeFilter}
          onClick={() =>
            navigate('/search/date-time', {
              state: {
                ...state,
                returnTo: AppPaths.SEARCH_RESULTS,
              },
            })
          }
        >
          ◷ {state?.date ? state.date : 'Bilo kada'}
        </button>
      </div>

      {loading ? (
        <p className={styles.loading}>Učitavanje...</p>
      ) : salons.length === 0 ? (
        <p className={styles.empty}>Nema rezultata</p>
      ) : (
        <div className={styles.list}>
          {salons.map((salon) => (
            <div key={salon.id} onClick={() => navigate(`/salons/${salon.id}`)}>
              <SalonCard
                image={salon.imageUrl ?? ''}
                name={salon.name}
                rating={salon.avgRating ?? 0}
                type={salon.type ?? ''}
                address={`${salon.street}, ${salon.city}`}
                borderColor="#DC6AB8"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default SearchResultsPage;
