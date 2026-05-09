import { BadRequestException } from '@nestjs/common';

export class GeocodingException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
