import FormInput from '@components/FormInput';
import type { OwnerRegistrationFormSchemaProps } from '@validation/ownerRegistrationForm';
import { useFormContext } from 'react-hook-form';
import styles from '../RegistrationForm/RegistrationForm.module.scss';

const OwnerPersonalInformation = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<OwnerRegistrationFormSchemaProps>();

  return (
    <fieldset className={styles.formInner}>
      <FormInput
        label="Email"
        fullWidth
        margin="normal"
        {...register('ownerPersonalInformation.email')}
        error={!!errors.ownerPersonalInformation?.email}
        helperText={errors.ownerPersonalInformation?.email?.message}
      />

      <FormInput
        label="Ime"
        fullWidth
        margin="normal"
        {...register('ownerPersonalInformation.firstName')}
        error={!!errors.ownerPersonalInformation?.firstName}
        helperText={errors.ownerPersonalInformation?.firstName?.message}
      />

      <FormInput
        label="Prezime"
        fullWidth
        margin="normal"
        {...register('ownerPersonalInformation.lastName')}
        error={!!errors.ownerPersonalInformation?.lastName}
        helperText={errors.ownerPersonalInformation?.lastName?.message}
      />

      <FormInput
        label="Broj mobitela"
        fullWidth
        margin="normal"
        {...register('ownerPersonalInformation.phone')}
        error={!!errors.ownerPersonalInformation?.phone}
        helperText={errors.ownerPersonalInformation?.phone?.message}
      />

      <FormInput
        label="Lozinka"
        type="password"
        fullWidth
        margin="normal"
        {...register('ownerPersonalInformation.password')}
        error={!!errors.ownerPersonalInformation?.password}
        helperText={errors.ownerPersonalInformation?.password?.message}
      />
    </fieldset>
  );
};

export default OwnerPersonalInformation;
