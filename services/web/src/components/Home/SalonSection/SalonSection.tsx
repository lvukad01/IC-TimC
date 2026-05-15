import useHorizontalScroll from '@hooks/useHorizontalScroll';
import type { SalonCategory } from '@lumii/types';
import { useNavigate } from 'react-router-dom';
import { SalonCard } from '../SalonCard/SalonCard';
import styles from './SalonSection.module.scss';

interface SalonSectionProps {
  title: string;
  borderColor: string;
  viewMorePath: string;
  salons: {
    id: string;
    profileImage: string;
    name: string;
    rating: number;
    categories: SalonCategory[];
    address: string;
    isFavorite?: boolean;
  }[];
}

export const SalonSection = ({ title, borderColor, salons, viewMorePath }: SalonSectionProps) => {
  const navigate = useNavigate();
  const ref = useHorizontalScroll();

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
      <div ref={ref} className={styles.cards}>
        {salons.map((salon) => (
          <SalonCard
            key={salon.id}
            {...salon}
            borderColor={borderColor}
            isFavorite={salon.isFavorite}
          />
        ))}
      </div>
    </section>
  );
};
