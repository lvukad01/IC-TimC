import { Prisma } from '@prisma/client';

export type BookingEmailInfo = Prisma.BookingsGetPayload<{
  include: {
    employee: true;
    client: true;
    salon: true;
    service: true;
  };
}>;
