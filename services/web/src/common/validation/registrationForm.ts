import { z } from 'zod';
import { type AddressFormSchemaProps, addressSchema } from './address';
import {
  type PaymentInformationFormSchemaProps,
  paymentInformationSchema,
} from './paymentInformation';
import {
  type PersonalInformationFormSchemaProps,
  personalInformationSchema,
} from './personalInformation';

export enum RegistrationFormTypeEnum {
  PersonalInformation = 'personalInformation',
  Address = 'address',
  PaymentInformation = 'paymentInformation',
}

export const registrationFormSchema = z.discriminatedUnion('formType', [
  z.object({
    formType: z.literal(RegistrationFormTypeEnum.PersonalInformation),
    personalInformation: personalInformationSchema,
  }),
  z.object({
    formType: z.literal(RegistrationFormTypeEnum.Address),
    shippingAddress: addressSchema,
    billingAddress: addressSchema,
  }),
  z.object({
    formType: z.literal(RegistrationFormTypeEnum.PaymentInformation),
    paymentInformation: paymentInformationSchema,
  }),
]);

export type RegistrationFormSchemaProps = {
  formType: RegistrationFormTypeEnum;
  personalInformation: PersonalInformationFormSchemaProps;
  billingAddress: AddressFormSchemaProps;
  shippingAddress: AddressFormSchemaProps;
  paymentInformation: PaymentInformationFormSchemaProps;
};
