import styles from './SalonSection.module.css';
import { SalonCard } from '../SalonCard/SalonCard';
import { useNavigate } from 'react-router-dom';

interface SalonSectionProps {
  title: string;
  borderColor: string;
  viewMorePath: string;
  salons: {
    id: string;
    image: string;
    name: string;
    rating: number;
    type: string;
    address: string;
    isFavorite?: boolean;
  }[];
  loadMoreRef?: React.Ref<HTMLDivElement>;
}

export const SalonSection = ({
  title,
  borderColor,
  salons,
  loadMoreRef,
  viewMorePath,
}: SalonSectionProps) => {
  const navigate = useNavigate();

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <button
          className={styles.viewMore}
          style={{ color: borderColor }}
          onClick={() => navigate(viewMorePath)}
        >
          vidi više →
        </button>
      </div>
      <div className={styles.cards}>
        {salons.map((salon) => (
          <SalonCard
            key={salon.id}
            {...salon}
            borderColor={borderColor}
            isFavorite={salon.isFavorite}
          />
        ))}
        <div ref={loadMoreRef} className={styles.loaderTrigger} />
      </div>
    </section>
  );
};
