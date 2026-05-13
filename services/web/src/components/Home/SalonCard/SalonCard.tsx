import { useState } from 'react';
import styles from './SalonCard.module.css';
import favoriteOn from '../../../assets/media/Vector.svg';
import favoriteOff from '../../../assets/media/Frame 117 (1).svg';

interface SalonCardProps {
  image: string;
  name: string;
  rating: number;
  type: string;
  address: string;
  borderColor?: string;
}

export const SalonCard = ({ image, name, rating, type, address, borderColor }: SalonCardProps) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className={styles.card} style={{ borderColor: borderColor ?? '#e0e0e0' }}>
      <div className={styles.imageWrapper}>
        {image ? (
          <img src={image} alt={name} className={styles.image} />
        ) : (
          <div className={styles.image} />
        )}{' '}
        <button className={styles.heartBtn} onClick={() => setLiked((prev) => !prev)} type="button">
          <img
            src={liked ? favoriteOn : favoriteOff}
            alt={liked ? 'Ukloni iz favorita' : 'Dodaj u favorite'}
            className={styles.heartIcon}
          />
        </button>
      </div>
      <div className={styles.info}>
        <div className={styles.nameRow}>
          <span className={styles.name}>{name}</span>
          <span className={styles.rating}>★ {rating}</span>
        </div>
        <p className={styles.type}>{type}</p>
        <p className={styles.address}>{address}</p>
      </div>
    </div>
  );
};
