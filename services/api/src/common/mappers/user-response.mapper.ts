import { Users } from '@prisma/client';
import { UserResponseDto } from '@users/dto/user-response.dto';

export function toUserResponse(user: Users): UserResponseDto {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone ?? undefined,
    role: user.role,
    street: user.street ?? undefined,
    city: user.city ?? undefined,
    zipcode: user.zipcode ?? undefined,
    country: user.country ?? undefined,
  };
}
