import { Prisma } from '@prisma/client';

export type BookingAggregate = Prisma.BookingsGetPayload<{
  include: {
    service: true;
    salon: true;
    employee: true;
    payments: true;
  };
}>;
