import CountrySelect from '@components/CountrySelect';
import FormInput from '@components/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuth from '@hooks/useAuth';
import { UserRole } from '@lumii/types';
import {
  clientRegistrationFormSchema,
  type ClientRegisterFormSchemaProps,
} from '@validation/clientRegistrationForm';
import { AppPaths } from 'common/routes/paths';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './RegisterClientPage.module.scss';

const RegisterClientPage = () => {
  const location = useLocation();
  const email: string = location.state?.email;
  const navigate = useNavigate();

  const form = useForm<ClientRegisterFormSchemaProps>({
    resolver: zodResolver(clientRegistrationFormSchema),
    defaultValues: {
      email,
    },
  });

  const { register: registerMutation } = useAuth();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  const onSubmit = (data: ClientRegisterFormSchemaProps) => {
    registerMutation.mutate(
      { ...data, role: UserRole.CLIENT },
      {
        onSuccess: () => {
          navigate(AppPaths.HOME);
        },
      },
    );
  };
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Napravi račun</h1>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            label="Email"
            fullWidth
            margin="normal"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <div className={styles.nameRow}>
            <FormInput
              label="Ime"
              fullWidth
              margin="normal"
              {...register('firstName')}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />

            <FormInput
              label="Prezime"
              fullWidth
              margin="normal"
              {...register('lastName')}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </div>

          <FormInput
            label="Broj mobitela"
            fullWidth
            margin="normal"
            {...register('phone')}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />

          <FormInput
            label="Lozinka"
            type="password"
            fullWidth
            margin="normal"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <FormInput
            label="Ulica"
            fullWidth
            margin="normal"
            {...register('street')}
            error={!!errors.street}
            helperText={errors.street?.message}
          />

          <FormInput
            label="Grad"
            fullWidth
            margin="normal"
            {...register('city')}
            error={!!errors.city}
            helperText={errors.city?.message}
          />

          <FormInput
            label="Poštanski broj"
            fullWidth
            margin="normal"
            {...register('zipcode')}
            error={!!errors.zipcode}
            helperText={errors.zipcode?.message}
          />

          <CountrySelect name="country" />

          <button className={styles.registerButton} type="submit">
            Registriraj se
          </button>
        </form>
      </FormProvider>
    </div>
  );
};

export default RegisterClientPage;
