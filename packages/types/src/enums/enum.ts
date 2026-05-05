export const UserRole = {
  CLIENT: 'CLIENT',
  SALON_OWNER: 'SALON_OWNER',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const EmployeeRole = {
  HAIRDRESSER: 'HAIRDRESSER',
  NAIL_TECH: 'NAIL_TECH',
  MAKEUP_ARTIST: 'MAKEUP_ARTIST',
  BARBER: 'BARBER',
} as const;

export type EmployeeRole = (typeof EmployeeRole)[keyof typeof EmployeeRole];

export const SalonStatus = {
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING',
  SUSPENDED: 'SUSPENDED',
} as const;

export type SalonStatus = (typeof SalonStatus)[keyof typeof SalonStatus];

export const MediaType = {
  PROFILE: 'PROFILE',
  GALLERY: 'GALLERY',
} as const;

export type MediaType = (typeof MediaType)[keyof typeof MediaType];

export const SalonCategory = {
  HAIR: 'HAIR',
  NAILS: 'NAILS',
  MAKEUP: 'MAKEUP',
  BARBERSHOP: 'BARBERSHOP',
} as const;

export type SalonCategory = (typeof SalonCategory)[keyof typeof SalonCategory];

export const BookingStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

export const PaymentMethod = {
  CARD: 'CARD',
  CASH: 'CASH',
  PAYPAL: 'PAYPAL',
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const PaymentType = {
  DEPOSIT: 'DEPOSIT',
  FULL: 'FULL',
} as const;

export type PaymentType = (typeof PaymentType)[keyof typeof PaymentType];

export const PaymentStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  REFUNDED: 'REFUNDED',
  FAILED: 'FAILED',
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
