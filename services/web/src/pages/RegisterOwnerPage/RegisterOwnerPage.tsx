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
import { AppPaths } from 'common/routes/paths';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

const RegisterOwnerPage = () => {
  const location = useLocation();
  const email: string = location.state?.email;
  const navigate = useNavigate();

  const form = useForm<OwnerRegistrationFormSchemaProps>({
    resolver: zodResolver(ownerRegistrationFormSchema) as any,
    defaultValues: {
      formType: OwnerRegistrationFormTypeEnum.PersonalInformation,
      ownerPersonalInformation: { email },
    },
  });

  const { register: registerMutation } = useAuth();

  const { watch, handleSubmit, setValue } = form;

  const formType = watch('formType');

  const setFormType = (type: OwnerRegistrationFormTypeEnum) => {
    setValue('formType', type);
  };

  const handleNextFormType = () => {
    switch (formType) {
      case OwnerRegistrationFormTypeEnum.PersonalInformation:
        setFormType(OwnerRegistrationFormTypeEnum.SalonLocation);
        break;

      case OwnerRegistrationFormTypeEnum.SalonLocation:
        setFormType(OwnerRegistrationFormTypeEnum.CategorySelection);
        break;

      case OwnerRegistrationFormTypeEnum.CategorySelection:
        break;
    }
  };

  const onSubmit = (data: OwnerRegistrationFormSchemaProps) => {
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
          navigate(AppPaths.HOME);
        },
      },
    );
  };

  return (
    <div>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(handleNextFormType)}>
          <OwnerPersonalInformation />
          <SalonLocation />
          <CategorySelect />

          <button type="submit">Nastavi</button>
        </form>
      </FormProvider>
    </div>
  );
};

export default RegisterOwnerPage;
