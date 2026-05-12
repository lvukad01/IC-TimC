import CountrySelect from '@components/CountrySelect';
import FormInput from '@components/FormInput';
import type { OwnerRegistrationFormSchemaProps } from '@validation/ownerRegistrationForm';
import { useFormContext } from 'react-hook-form';
import styles from '../RegistrationForm/RegistrationForm.module.scss';

const SalonLocation = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<OwnerRegistrationFormSchemaProps>();

  return (
    <fieldset className={styles.formInner}>
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

      <CountrySelect />
    </fieldset>
  );
};

export default SalonLocation;
