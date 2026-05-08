import { CreateServiceRequest } from '@lumii/types';

export class AddServiceDto implements CreateServiceRequest {
  name: string;
  price: number;
  duration_min: number;
  is_active: boolean;
}
