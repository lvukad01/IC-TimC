import { addFavorite, removeFavorite } from '@api/favorites';
import favoriteOff from '@assets/media/Frame 117 (1).svg';
import favoriteOn from '@assets/media/Vector.svg';
import { SalonCategory } from '@lumii/types';
import { useState } from 'react';
import toast from 'react-hot-toast';
import styles from './SalonCard.module.scss';

interface SalonCardProps {
  id: string;
  profileImage: string;
  name: string;
  rating: number;
  categories: SalonCategory[];
  address: string;
  borderColor?: string;
  isFavorite?: boolean;
}

const salonTypeLabel: Record<SalonCategory, string> = {
  [SalonCategory.HAIR]: 'frizerski salon',
  [SalonCategory.MAKEUP]: 'makeup studio',
  [SalonCategory.NAILS]: 'salon za nokte',
  [SalonCategory.BARBERSHOP]: 'barber shop',
};

export const SalonCard = ({
  id,
  profileImage,
  name,
  categories,
  rating,
  address,
  borderColor,
  isFavorite = false,
}: SalonCardProps) => {
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
        {profileImage ? (
          <img src={profileImage} alt={name} className={styles.image} />
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
          <span className={styles.rating}>★ {rating.toFixed(2)}</span>
        </div>
        <div className={styles.additionalInfo}>
          <p className={styles.type}>{categories.map((c) => salonTypeLabel[c]).join(', ')}</p>
          <p className={styles.address}>{address}</p>
        </div>
      </div>
    </div>
  );
};
