import CountrySelect from '@components/CountrySelect';
import FormInput from '@components/FormInput';
import styles from '@pages/RegisterOwnerPage/RegisterOwnerPage.module.scss';
import type { OwnerRegistrationFormSchemaProps } from '@validation/ownerRegistrationForm';
import { useFormContext } from 'react-hook-form';

const SalonLocation = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<OwnerRegistrationFormSchemaProps>();

  return (
    <>
      <h1 className={styles.title}>Unesi ime i lokaciju svog salona</h1>
      <FormInput
        label="Ime salona"
        fullWidth
        margin="normal"
        {...register('salonLocation.name')}
        error={!!errors.salonLocation?.name}
        helperText={errors.salonLocation?.name?.message}
      />

      <FormInput
        label="Ulica"
        fullWidth
        margin="normal"
        {...register('salonLocation.street')}
        error={!!errors.salonLocation?.street}
        helperText={errors.salonLocation?.street?.message}
      />

      <FormInput
        label="Grad"
        fullWidth
        margin="normal"
        {...register('salonLocation.city')}
        error={!!errors.salonLocation?.city}
        helperText={errors.salonLocation?.city?.message}
      />

      <FormInput
        label="Poštanski broj"
        fullWidth
        margin="normal"
        {...register('salonLocation.zipcode')}
        error={!!errors.salonLocation?.zipcode}
        helperText={errors.salonLocation?.zipcode?.message}
      />

      <CountrySelect name="salonLocation.country" />
    </>
  );
};

export default SalonLocation;
