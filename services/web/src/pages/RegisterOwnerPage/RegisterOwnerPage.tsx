import CategorySelect from '@components/CategorySelect';
import OwnerPersonalInformation from '@components/Forms/OwnerPersonalInformation';
import SalonLocation from '@components/Forms/SalonLocation';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuth from '@hooks/useAuth';
import { UserRole } from '@lumii/types';
import {
  ownerRegistrationFormSchema,
  OwnerRegistrationFormTypeEnum,
  type OwnerRegistrationFormSchemaProps,
} from '@validation/ownerRegistrationForm';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import styles from './RegisterOwnerPage.module.scss';

const RegisterOwnerPage = () => {
  const location = useLocation();
  const email: string = location.state?.email;
  const { register: registerMutation } = useAuth();

  const form = useForm<OwnerRegistrationFormSchemaProps>({
    resolver: zodResolver(ownerRegistrationFormSchema) as any,
    defaultValues: {
      formType: OwnerRegistrationFormTypeEnum.CategorySelection,
      ownerPersonalInformation: { email },
    },
  });

  const onRegister = (data: OwnerRegistrationFormSchemaProps) => {
    const { ownerPersonalInformation } = data;
    registerMutation.mutate(
      {
        email: ownerPersonalInformation.email,
        password: ownerPersonalInformation.password,
        firstName: ownerPersonalInformation.firstName,
        lastName: ownerPersonalInformation.lastName,
        phone: ownerPersonalInformation.phone,
        role: UserRole.SALON_OWNER,
      },
      {
        onSuccess: () => {
          setFormType(OwnerRegistrationFormTypeEnum.SalonLocation);
        },
      },
    );
  };

  const { watch, handleSubmit, setValue } = form;

  const formType = watch('formType');

  const setFormType = (type: OwnerRegistrationFormTypeEnum) => {
    setValue('formType', type);
  };

  const handleNextFormType = (data: OwnerRegistrationFormSchemaProps) => {
    switch (formType) {
      case OwnerRegistrationFormTypeEnum.PersonalInformation:
        setFormType(OwnerRegistrationFormTypeEnum.SalonLocation);
        onRegister(data);
        break;

      case OwnerRegistrationFormTypeEnum.SalonLocation:
        setFormType(OwnerRegistrationFormTypeEnum.CategorySelection);
        break;

      case OwnerRegistrationFormTypeEnum.CategorySelection:
        break;
    }
  };

  return (
    <div className={styles.container}>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(handleNextFormType)}>
          {formType === OwnerRegistrationFormTypeEnum.PersonalInformation && (
            <OwnerPersonalInformation />
          )}
          {formType === OwnerRegistrationFormTypeEnum.SalonLocation && <SalonLocation />}
          {formType === OwnerRegistrationFormTypeEnum.CategorySelection && <CategorySelect />}

          <button className={styles.submitButton} type="submit">
            Nastavi
          </button>
        </form>
      </FormProvider>
    </div>
  );
};

export default RegisterOwnerPage;
