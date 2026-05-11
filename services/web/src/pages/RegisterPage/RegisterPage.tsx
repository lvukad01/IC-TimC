import FormInput from '@components/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuth from '@hooks/useAuth';
import { UserRole } from '@lumii/types';
import { registrationFormSchema, type RegisterFormSchemaProps } from '@validation/registrationForm';
import { AppPaths } from 'common/routes/paths';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const form = useForm<RegisterFormSchemaProps>({
    resolver: zodResolver(registrationFormSchema),
  });

  const { register: registerMutation } = useAuth();

  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  const onSubmit = (data: RegisterFormSchemaProps) => {
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
    <div>
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

          <FormInput
            label="Broj mobitela"
            fullWidth
            margin="normal"
            {...register('phone')}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />

          <FormInput
            label="Password"
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

          <FormInput
            label="Država"
            fullWidth
            margin="normal"
            {...register('country')}
            error={!!errors.country}
            helperText={errors.country?.message}
          />

          <button type="submit">Registriraj se</button>
        </form>
      </FormProvider>
    </div>
  );
};

export default RegisterPage;
