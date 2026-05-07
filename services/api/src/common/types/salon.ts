import { Prisma } from 'generated/prisma';

export type SalonsWithMedia = Prisma.SalonsGetPayload<{
  include: { media: true };
}>;
