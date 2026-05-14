import { getSignedFiles } from '@api/files';
import { SalonCard } from '@components/Home/SalonCard/SalonCard';
import { mapSalonForCard } from '@helpers/salonMapper';
import type { SalonListResponse } from '@lumii/types';
import type { SalonCardData } from '@tstypes/SalonCard';
import { AppPaths } from 'common/routes/paths';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api';
import styles from '../SearchPage/SearchPage.module.scss';

type ViewMoreType = 'recommended' | 'popular' | 'newest';

const getResults = (response: any) =>
  response?.data?.results ?? response?.results ?? response?.data?.data?.results ?? [];

const borderColor = '#A59DBD';
const pageConfig: Record<ViewMoreType, { title: string; endpoint: string; borderColor: string }> = {
  recommended: {
    title: 'Preporuke',
    endpoint: AppPaths.VIEW_MORE_RECOMMENDED,
    borderColor: borderColor,
  },
  popular: {
    title: 'Popularno',
    endpoint: AppPaths.VIEW_MORE_POPULAR,
    borderColor: borderColor,
  },
  newest: {
    title: 'Novo',
    endpoint: AppPaths.VIEW_MORE_NEWEST,
    borderColor: borderColor,
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

        setSalons(results.map((s: SalonListResponse) => mapSalonForCard(s, urlMap)));
      } catch (error) {
        toast.error('Greška pri dohvaćanju salona');
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
