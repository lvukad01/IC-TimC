import {
  MediaType,
  SalonDetailResponse,
  SalonListResponse,
} from '@lumii/types';
import { Injectable } from '@nestjs/common';
import { S3Service } from '@s3/s3.service';
import { SalonsWithMedia, SalonsWithReviews } from '@tstypes/salon';

@Injectable()
export class SalonsMapper {
  constructor(private readonly s3Service: S3Service) {}

  mapSalonDetails(salon: SalonsWithMedia): SalonDetailResponse {
    return {
      ...salon,
      media: salon.media.map((m) => ({
        id: m.id,
        type: m.type,
        sortOrder: m.sortOrder,
        key: m.key,
      })),
    };
  }

  mapSalonListItem(salon: SalonsWithReviews): SalonListResponse {
    const profilePicture = salon.media.find(
      (p) => p.type === MediaType.PROFILE,
    );

    const reviewCount = salon._count.reviews;
    const avgRating =
      reviewCount === 0
        ? 0
        : salon.reviews.reduce(
            (ratingSum, review) => ratingSum + review.rating,
            0,
          ) / reviewCount;

    return {
      id: salon.id,
      name: salon.name,
      city: salon.city,
      street: salon.street,
      profileImageKey: profilePicture?.key,
      avgRating,
    };
  }
}
