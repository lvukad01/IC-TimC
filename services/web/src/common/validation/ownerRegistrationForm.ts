import { z } from 'zod';
import {
  categorySelectionSchema,
  type CategorySelectionFormSchemaProps,
} from './categorySelection';
import { employeesAdditionSchema, type EmployeesAdditionFormSchemaProps } from './employeeAddition';
import {
  ownerPersonalInformationSchema,
  type PersonalInformationFormSchemaProps,
} from './ownerPersonalInformation';
import { salonLocationSchema, type SalonLocationFormSchemaProps } from './salonLocationForm';

export enum OwnerRegistrationFormTypeEnum {
  PersonalInformation = 'personalInformation',
  SalonLocation = 'salonLocation',
  CategorySelection = 'categorySelection',
  EmployeeAddition = 'employeeAddition',
}

export const ownerRegistrationFormSchema = z.discriminatedUnion('formType', [
  z.object({
    formType: z.literal(OwnerRegistrationFormTypeEnum.PersonalInformation),
    ownerPersonalInformation: ownerPersonalInformationSchema,
  }),
  z.object({
    formType: z.literal(OwnerRegistrationFormTypeEnum.SalonLocation),
    salonLocation: salonLocationSchema,
  }),
  z.object({
    formType: z.literal(OwnerRegistrationFormTypeEnum.CategorySelection),
    categorySelection: categorySelectionSchema,
  }),
  z.object({
    formType: z.literal(OwnerRegistrationFormTypeEnum.EmployeeAddition),
    employees: employeesAdditionSchema,
  }),
]);

export type OwnerRegistrationFormSchemaProps = {
  formType: OwnerRegistrationFormTypeEnum;
  ownerPersonalInformation: PersonalInformationFormSchemaProps;
  salonLocation: SalonLocationFormSchemaProps;
  categorySelection: CategorySelectionFormSchemaProps;
  employeesAddition: EmployeesAdditionFormSchemaProps;
};
