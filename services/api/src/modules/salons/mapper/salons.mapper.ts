import {
  MediaType,
  SalonDetailResponse,
  SalonListResponse,
} from '@lumii/types';
import { Injectable } from '@nestjs/common';
import { S3Service } from '@s3/s3.service';
import { SalonsWithMedia } from '@tstypes/salon';

@Injectable()
export class SalonsMapper {
  constructor(private readonly s3Service: S3Service) {}

  async mapSalonDetails(salon: SalonsWithMedia): Promise<SalonDetailResponse> {
    return {
      ...salon,
      media: await Promise.all(
        salon.media.map(async (m) => ({
          id: m.id,
          type: m.type,
          sortOrder: m.sortOrder,
          url: await this.s3Service.getSignedUrl(m.key),
        })),
      ),
    };
  }

  async mapSalonListItem(salon: SalonsWithMedia): Promise<SalonListResponse> {
    const profilePicture = salon.media.find(
      (p) => p.type === MediaType.PROFILE,
    );

    return {
      id: salon.id,
      name: salon.name,
      city: salon.city,
      profileImageUrl: profilePicture
        ? await this.s3Service.getSignedUrl(profilePicture.key)
        : undefined,
    };
  }
}
