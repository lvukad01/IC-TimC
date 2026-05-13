import CategorySelect from '@components/CategorySelect';
import EmployeeAddition from '@components/EmployeeAddition';
import OwnerPersonalInformation from '@components/Forms/OwnerPersonalInformation';
import SalonLocation from '@components/Forms/SalonLocation';
import ProfileFinishedState from '@components/ProfileFinishedState';
import { zodResolver } from '@hookform/resolvers/zod';
import useAddEmployees from '@hooks/useAddEmployees';
import useAddSalon from '@hooks/useAddSalon';
import useAuth from '@hooks/useAuth';
import { UserRole } from '@lumii/types';
import {
  ownerRegistrationFormSchema,
  OwnerRegistrationFormTypeEnum,
  type OwnerRegistrationFormSchemaProps,
} from '@validation/ownerRegistrationForm';
import { useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './RegisterOwnerPage.module.scss';

const RegisterOwnerPage = () => {
  const location = useLocation();
  const email: string = location.state?.email;
  const { register: registerMutation } = useAuth();
  const navigate = useNavigate();

  const addSalonMutation = useAddSalon();
  const addEmployeesMutation = useAddEmployees();
  const salonIdRef = useRef<string | null>(null);

  const form = useForm<OwnerRegistrationFormSchemaProps>({
    resolver: zodResolver(ownerRegistrationFormSchema) as any,
    defaultValues: {
      formType: OwnerRegistrationFormTypeEnum.PersonalInformation,

      ownerPersonalInformation: {
        email,
      },

      salonLocation: {
        name: '',
        street: '',
        city: '',
        zipcode: '',
        country: '',
      },

      categorySelection: {
        categories: [],
      },
      employeesAddition: {
        employees: [],
      },
    },
    shouldUnregister: false,
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

  const { watch, handleSubmit, setValue, getValues } = form;

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

      case OwnerRegistrationFormTypeEnum.CategorySelection: {
        const values = getValues();
        addSalonMutation.mutate(
          { ...values.salonLocation, ...values.categorySelection },
          {
            onSuccess: (response) => {
              salonIdRef.current = response.id;
              setFormType(OwnerRegistrationFormTypeEnum.EmployeeAddition);
            },
          },
        );
        break;
      }
      case OwnerRegistrationFormTypeEnum.EmployeeAddition: {
        const values = getValues();
        addEmployeesMutation.mutate(
          {
            salonId: salonIdRef.current!,
            data: {
              employees: values.employeesAddition?.employees ?? [],
            },
          },
          {
            onSuccess: () => {
              setFormType(OwnerRegistrationFormTypeEnum.Completed);
            },
          },
        );

        break;
      }
    }
  };

  return (
    <div className={styles.container}>
      {formType === OwnerRegistrationFormTypeEnum.Completed && <ProfileFinishedState />}
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(handleNextFormType)}>
          {formType === OwnerRegistrationFormTypeEnum.PersonalInformation && (
            <OwnerPersonalInformation />
          )}
          {formType === OwnerRegistrationFormTypeEnum.SalonLocation && <SalonLocation />}
          {formType === OwnerRegistrationFormTypeEnum.CategorySelection && <CategorySelect />}
          {formType === OwnerRegistrationFormTypeEnum.EmployeeAddition && <EmployeeAddition />}
          {formType === OwnerRegistrationFormTypeEnum.Completed ? (
            <button
              className={styles.submitButton}
              type="button"
              onClick={() => navigate('/profile')}
            >
              Završi
            </button>
          ) : (
            <button className={styles.submitButton} type="submit">
              Nastavi
            </button>
          )}
        </form>
      </FormProvider>
    </div>
  );
};

export default RegisterOwnerPage;
