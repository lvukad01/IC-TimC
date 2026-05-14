import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './SearchPage.module.scss';
import { SalonCard } from '@components/Home/SalonCard/SalonCard';
import { AppPaths } from 'common/routes/paths';
import { getSignedFiles } from '@api/files';
import { getNearbySalons } from '@api/salons';
import { searchSalons } from '@helpers/SearchSalons';

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [salons, setSalons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();

    if (state?.search) params.append('search', state.search);
    if (state?.city && !state?.useMyLocation) {
      params.append('city', state.city);
    }
    if (state?.category && state.category !== 'Sve' && state.category.toLowerCase() !== 'all') {
      params.append('category', state.category.toUpperCase().replace(' ', '_'));
    }
    if (state?.date) params.append('date', state.date);
    if (state?.serviceId) params.append('serviceId', state.serviceId);

    const request = state?.useMyLocation ? getNearbySalons() : searchSalons(params.toString());

    request
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

  const getDateTimeLabel = () => {
    if (!state?.date) return 'Bilo kada';

    const date = new Date(state.date);

    return date.toLocaleString('hr-HR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
          ◷ {state?.dateLabel ?? 'Bilo kada'}{' '}
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
                id={salon.id}
                image={salon.imageUrl ?? ''}
                name={salon.name}
                rating={salon.avgRating ?? 0}
                type={salon.type ?? ''}
                address={`${salon.street}, ${salon.city}`}
                borderColor="#A59DBD"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default SearchResultsPage;
