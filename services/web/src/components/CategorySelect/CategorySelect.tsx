import { SalonCategory } from '@lumii/types';
import type { OwnerRegistrationFormSchemaProps } from '@validation/ownerRegistrationForm';
import { useFormContext } from 'react-hook-form';

const CATEGORY_OPTIONS = [
  { label: 'Hair', value: SalonCategory.HAIR },
  { label: 'Nails', value: SalonCategory.NAILS },
  { label: 'Beauty', value: SalonCategory.MAKEUP },
];

const CategorySelect = () => {
  const { watch, setValue } = useFormContext<OwnerRegistrationFormSchemaProps>();
  const selected = watch('categorySelection.categories');

  const selectCategory = (value: SalonCategory) => {
    setValue('categorySelection.categories', value, {
      shouldValidate: true,
    });
  };
  return (
    <div>
      {CATEGORY_OPTIONS.map((c) => {
        const active = selected === c.value;
        return (
          <button key={c.value} type="button" onClick={() => selectCategory(c.value)}>
            {c.label}
          </button>
        );
      })}
    </div>
  );
};

export default CategorySelect;
