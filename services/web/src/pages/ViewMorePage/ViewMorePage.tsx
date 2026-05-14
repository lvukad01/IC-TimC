import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api';
import { getSignedFiles } from '@api/files';
import { SalonCard } from '@components/Home/SalonCard/SalonCard';
import styles from '../SearchPage/SearchPage.module.css';

type ViewMoreType = 'recommended' | 'popular' | 'newest';

type SalonCardData = {
  id: string;
  image: string;
  name: string;
  rating: number;
  type: string;
  address: string;
  isFavorite?: boolean;
};

const getResults = (response: any) =>
  response?.data?.results ?? response?.results ?? response?.data?.data?.results ?? [];

const pageConfig: Record<ViewMoreType, { title: string; endpoint: string; borderColor: string }> = {
  recommended: {
    title: 'Preporuke',
    endpoint: '/salons/recommended',
    borderColor: '#DC6AB8',
  },
  popular: {
    title: 'Popularno',
    endpoint: '/salons/popular',
    borderColor: '#9786CA',
  },
  newest: {
    title: 'Novo',
    endpoint: '/salons/newest',
    borderColor: '#029ED8',
  },
};

const ViewMorePage = () => {
  const navigate = useNavigate();
  const { type } = useParams<{ type: ViewMoreType }>();

  const [salons, setSalons] = useState<SalonCardData[]>([]);
  const [loading, setLoading] = useState(true);

  const config = pageConfig[type ?? 'recommended'];

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const response = await api.get(config.endpoint);
        const results = getResults(response);

        const keys = [
          ...new Set(results.map((salon: any) => salon.profileImageKey).filter(Boolean)),
        ];

        const signedData = keys.length > 0 ? await getSignedFiles(keys) : { files: [] };

        const urlMap = new Map<string, string>(
          signedData.files.map((file: any) => [file.key, file.url]),
        );

        const mappedSalons = results.map((salon: any) => ({
          id: salon.id,
          image: salon.profileImageKey ? (urlMap.get(salon.profileImageKey) ?? '') : '',
          name: salon.name,
          rating: salon.avgRating ?? 0,
          type: salon.type ?? '',
          address: `${salon.street}, ${salon.city}`,
          isFavorite: salon.isFavorite,
        }));

        setSalons(mappedSalons);
      } catch (error) {
        console.error('Failed to fetch salons:', error);
        setSalons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSalons();
  }, [config.endpoint]);

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className={styles.title}>{config.title}</h1>
      </div>

      {loading ? (
        <p className={styles.loading}>Učitavanje...</p>
      ) : salons.length === 0 ? (
        <p className={styles.empty}>Nema salona</p>
      ) : (
        <div className={styles.list}>
          {salons.map((salon) => (
            <div key={salon.id} onClick={() => navigate(`/salons/${salon.id}`)}>
              <SalonCard {...salon} borderColor={config.borderColor} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ViewMorePage;
