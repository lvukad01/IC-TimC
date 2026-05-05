export const UserRole = {
  CLIENT: 'CLIENT',
  SALON_OWNER: 'SALON_OWNER',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export enum EmployeeRole {
  HAIRDRESSER,
  NAIL_TECH,
  MAKEUP_ARTIST,
  BARBER,
}

export enum SalonStatus {
  ACTIVE,
  PENDING,
  SUSPENDED,
}

export enum MediaType {
  PROFILE,
  GALLERY,
}

export enum SalonCategory {
  HAIR,
  NAILS,
  MAKEUP,
  BARBERSHOP,
}

export enum BookingStatus {
  PENDING,
  CONFIRMED,
  CANCELLED,
  COMPLETED,
}

export enum PaymentMethod {
  CARD,
  CASH,
  PAYPAL,
}

export enum PaymentType {
  DEPOSIT,
  FULL,
}

export enum PaymentStatus {
  PENDING,
  PAID,
  REFUNDED,
  FAILED,
}
