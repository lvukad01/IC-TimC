import { useMoreSalonsInfinite } from '@api/salons';
import { SalonCard } from '@components/Home/SalonCard/SalonCard';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import type { PaginatedResponse } from '@lumii/types';
import type { InfiniteData } from '@tanstack/react-query';
import { type SalonCardData } from '@tstypes/SalonCard';
import { AppPaths } from 'common/routes/paths';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../SearchPage/SearchPage.module.scss';

type ViewMoreType = 'recommended' | 'popular' | 'newest';

const getResults = <T,>(data?: InfiniteData<PaginatedResponse<T>>): T[] =>
  data?.pages.flatMap((page) => page.results) ?? [];

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

const LIMIT = 2;

const ViewMorePage = () => {
  const navigate = useNavigate();
  const { type } = useParams<{ type: ViewMoreType }>();

  const config = pageConfig[type ?? 'recommended'];
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } =
    useMoreSalonsInfinite(config.endpoint, LIMIT);

  const salons = getResults<SalonCardData>(data);

  const loadMoreRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className={styles.title}>{config.title}</h1>
      </div>

      {isLoading ? (
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

      <div ref={loadMoreRef} />
    </section>
  );
};

export default ViewMorePage;
