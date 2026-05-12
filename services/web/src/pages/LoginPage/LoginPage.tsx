import FormInput from '@components/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuth from '@hooks/useAuth';
import useCheckMail from '@hooks/useCheckMail';
import { LoginMode } from '@tstypes/loginMode';
import { LoginSteps } from '@tstypes/loginSteps';
import { loginFormSchema, type LoginFormSchemaProps } from '@validation/loginForm';
import { AppPaths } from 'common/routes/paths';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './LoginPage.module.scss';

const LoginPage = () => {
  const checkMail = useCheckMail();
  const { login } = useAuth();

  const [step, setStep] = useState<LoginSteps>(LoginSteps.EMAIL);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const loginMode = searchParams.get('mode');

  const emailSchema = loginFormSchema.pick({
    email: true,
  });

  const passwordSchema = loginFormSchema.pick({
    email: true,
    password: true,
  });

  const schema = step === LoginSteps.EMAIL ? emailSchema : passwordSchema;

  const form = useForm<LoginFormSchemaProps>({
    resolver: zodResolver(schema) as any,
  });

  const {
    getValues,
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  const onSubmit = (data: LoginFormSchemaProps) => {
    if (step === LoginSteps.EMAIL) {
      checkMail.mutate(data.email, {
        onSuccess: (response) => {
          if (!response.exists) {
            if (loginMode === LoginMode.OWNER)
              navigate(AppPaths.REGISTER_SALON_OWNER, {
                state: { email: data.email },
              });
            else
              navigate(AppPaths.REGISTER_CLIENT, {
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

  console.log(errors);

  return (
    <div>
      <h1 className={styles.title}>Prijavi se ili registriraj</h1>
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
