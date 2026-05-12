import brush from '@assets/media/brush.svg';
import nails from '@assets/media/nails.svg';
import scissors from '@assets/media/scissors.svg';
import { SalonCategory } from '@lumii/types';
import type { OwnerRegistrationFormSchemaProps } from '@validation/ownerRegistrationForm';
import { useFormContext } from 'react-hook-form';
import styles from './CategorySelect.module.scss';

const CATEGORY_OPTIONS = [
  { label: 'Hair', value: SalonCategory.HAIR, image: scissors },
  { label: 'Nails', value: SalonCategory.NAILS, image: nails },
  { label: 'Beauty', value: SalonCategory.MAKEUP, image: brush },
];

const CategorySelect = () => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<OwnerRegistrationFormSchemaProps>();
  const selected = watch('categorySelection.categories');

  const selectCategory = (value: SalonCategory) => {
    setValue('categorySelection.categories', value, {
      shouldValidate: true,
    });
  };

  return (
    <>
      <h1 className={styles.title}>Odaberi kategoriju</h1>
      <h2 className={styles.subtitle}>
        Odaberi jednu ili više kategorija koje najbolje opisuju tvoj salon
      </h2>

      {errors?.categorySelection?.message && (
        <p className={styles.error}>{errors.categorySelection.message}</p>
      )}
      <div className={styles.categoryWrapper}>
        {CATEGORY_OPTIONS.map((c) => {
          const active = selected === c.value;
          return (
            <button
              className={`${styles.categoryButton} ${active ? styles.active : ''}`}
              key={c.value}
              type="button"
              onClick={() => selectCategory(c.value)}
            >
              <img className={styles.categoryImg} src={c.image} alt={c.label}></img>
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default CategorySelect;
