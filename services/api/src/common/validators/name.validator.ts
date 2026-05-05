import { VALIDATION_MESSAGES } from '@lumii/messages';
import { nameRegex } from '@lumii/types';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsValidName(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isValidName',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && nameRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return VALIDATION_MESSAGES.NAME_INVALID;
        },
      },
    });
  };
}
