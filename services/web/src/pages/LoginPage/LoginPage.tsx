import FormInput from '@components/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuth from '@hooks/useAuth';
import useCheckMail from '@hooks/useCheckMail';
import { loginFormSchema, type LoginFormSchemaProps } from '@validation/loginForm';
import { LoginSteps } from '@validation/types/loginSteps';
import { AppPaths } from 'common/routes/paths';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const form = useForm<LoginFormSchemaProps>({
    resolver: zodResolver(loginFormSchema),
  });

  const checkMail = useCheckMail();
  const { login } = useAuth();

  const [step, setStep] = useState<LoginSteps>(LoginSteps.EMAIL);

  const navigate = useNavigate();

  const {
    getValues,
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  const onSubmit = (data: LoginFormSchemaProps) => {
    if (step === LoginSteps.EMAIL) {
      checkMail.mutate(data.email, {
        onSuccess: (exists) => {
          if (!exists) {
            navigate(AppPaths.REGISTER, {
              state: { email: data.email },
            });
            return;
          }

          setStep(LoginSteps.PASSWORD);
        },
        onError: () => toast.error('Nešto je pošlo po krivu, pokušaj ponovno kasnije'),
      });
    } else if (step === LoginSteps.PASSWORD) {
      const { email } = getValues();

      login.mutate(
        {
          email,
          password: data.password,
        },
        {
          onSuccess: () => navigate(AppPaths.HOME),
        },
      );
    }
  };

  return (
    <div>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {step === LoginSteps.EMAIL && (
            <FormInput
              label="Email"
              fullWidth
              margin="normal"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          )}

          {step === LoginSteps.PASSWORD && (
            <FormInput
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          )}
          <button type="submit">{step === LoginSteps.EMAIL ? 'Nastavi' : 'Prijavi se'}</button>
        </form>
      </FormProvider>
    </div>
  );
};

export default LoginPage;
