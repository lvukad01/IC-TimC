import { BadRequestException } from '@nestjs/common';

export class InvalidDepositException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
