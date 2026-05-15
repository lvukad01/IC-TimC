import { getFavorites } from '@api/favorites';
import { getSignedFiles } from '@api/files';
import { getNearbySalons } from '@api/salons';
import { SalonCard } from '@components/Home/SalonCard/SalonCard';
import { searchSalons } from '@helpers/SearchSalons';
import { AppPaths } from 'common/routes/paths';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './SearchPage.module.scss';

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [salons, setSalons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchSalons = async () => {
      setLoading(true);
      let favoriteIdsSet = new Set<string>();

      try {
        const params = new URLSearchParams();

        if (state?.date && state?.time && state?.serviceId) {
          params.append('date', state.date.split('T')[0]);
          params.append('time', state.time);
          params.append('serviceId', state.serviceId);
        }
        params.append('page', '1');
        params.append('limit', '50');

        if (state?.date && state?.serviceId) {
          const selectedDate = new Date(state.date);

          params.append('date', selectedDate.toISOString().split('T')[0]);
          params.append('time', selectedDate.toTimeString().slice(0, 5));
          params.append('serviceId', state.serviceId);
        }
        if (state?.serviceId) params.append('serviceId', state.serviceId);

        try {
          const favoritesData = await getFavorites();
          const favoriteResults = favoritesData?.results ?? favoritesData ?? [];
          favoriteIdsSet = new Set(favoriteResults.map((salon: any) => salon.id));
        } catch {}
        const data = state?.useMyLocation
          ? await getNearbySalons()
          : await searchSalons(params.toString());

        const results = Array.isArray(data) ? data : (data?.results ?? []);

        const keys = results.map((salon: any) => salon.profileImageKey).filter(Boolean);
        const signedData = keys.length > 0 ? await getSignedFiles(keys) : { files: [] };

        const urlMap = new Map<string, string>(
          signedData.files.map((file: any) => [file.key, file.url]),
        );
        const salonsWithImages = results.map((salon: any) => ({
          ...salon,
          isFavorite: favoriteIdsSet.has(salon.id),
          imageUrl: salon.profileImageKey ? (urlMap.get(salon.profileImageKey) ?? null) : null,
        }));

        setSalons(salonsWithImages);
      } catch (error) {
        console.error(error);
        setSalons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSalons();
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
          ◷ {getDateTimeLabel()}
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
                profileImage={salon.imageUrl ?? ''}
                name={salon.name}
                rating={salon.avgRating ?? 0}
                categories={salon.categories ?? []}
                address={`${salon.street}, ${salon.city}`}
                borderColor="#A59DBD"
                isFavorite={favoriteIds.has(salon.id)}
                onFavoriteChange={(salonId, isFavorite) => {
                  setFavoriteIds((prev) => {
                    const next = new Set(prev);

                    if (isFavorite) next.add(salonId);
                    else next.delete(salonId);

                    return next;
                  });

                  setSalons((prev) =>
                    prev.map((s) => (s.id === salonId ? { ...s, isFavorite } : s)),
                  );
                }}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default SearchResultsPage;
