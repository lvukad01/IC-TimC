import styles from './SalonSection.module.css';
import { SalonCard } from '../SalonCard/SalonCard';

interface SalonSectionProps {
  title: string;
  borderColor: string;
  salons: {
    id: string;
    image: string;
    name: string;
    rating: number;
    type: string;
    address: string;
  }[];
  loadMoreRef?: React.Ref<HTMLDivElement>;
}

export const SalonSection = ({ title, borderColor, salons, loadMoreRef }: SalonSectionProps) => {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <button className={styles.viewMore} style={{ color: borderColor }}>
          vidi više →
        </button>
      </div>
      <div className={styles.cards}>
        {salons.map((salon) => (
          <SalonCard key={salon.id} {...salon} borderColor={borderColor} />
        ))}
        <div ref={loadMoreRef} className={styles.loaderTrigger} />
      </div>
    </section>
  );
};
