import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SalonCard.module.scss';
import favoriteOn from '@assets/media/Vector.svg';
import favoriteOff from '@assets/media/Frame 117 (1).svg';
import { addFavorite, removeFavorite } from '@api/favorites';
import toast from 'react-hot-toast';

interface SalonCardProps {
  id: string;
  image: string;
  name: string;
  rating: number;
  type: string;
  address: string;
  borderColor?: string;
  isFavorite?: boolean;
}

export const SalonCard = ({
  id,
  image,
  name,
  rating,
  type,
  address,
  borderColor,
  isFavorite = false,
}: SalonCardProps) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(isFavorite);

  const handleFavorites = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    try {
      if (liked) {
        await removeFavorite(id);
        setLiked(false);
        toast.success('Salon uklonjen iz favorita');
      } else {
        await addFavorite(id);
        setLiked(true);
        toast.success('Salon dodan u favorite');
      }
    } catch {
      toast.error('Greška pri ažuriranju favorita');
    }
  };

  return (
    <div className={styles.card} style={{ borderColor: borderColor ?? '#e0e0e0' }}>
      <div className={styles.imageWrapper}>
        {image ? (
          <img src={image} alt={name} className={styles.image} />
        ) : (
          <div className={styles.image} />
        )}

        <button className={styles.heartBtn} onClick={handleFavorites} type="button">
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
