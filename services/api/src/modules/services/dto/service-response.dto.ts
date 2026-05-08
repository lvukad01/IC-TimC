import { ServiceResponse } from '@lumii/types';

export class ServiceResponseDto implements ServiceResponse {
  id: string;
  salonId: string;
  categoryId: string;
  name: string;
  price: number;
  durationMin: number;
  isActive: boolean;
}
