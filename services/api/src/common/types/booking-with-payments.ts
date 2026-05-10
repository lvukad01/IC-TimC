import { Prisma } from '@prisma/client';

export type BookingWithPayments = Prisma.BookingsGetPayload<{
  include: {
    payments: true;
  };
}>;
