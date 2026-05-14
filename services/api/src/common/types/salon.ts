import { Prisma } from 'generated/prisma';

export type SalonsWithMedia = Prisma.SalonsGetPayload<{
  include: { media: true; categories: true };
}>;

export type SalonsWithReviews = Prisma.SalonsGetPayload<{
  include: {
    media: true;
    _count: {
      select: { reviews: true };
    };
    reviews: {
      select: { rating: true };
    };
    categories: true;
  };
}>;
