import {
  MediaType,
  SalonCategory,
  SalonDetailResponse,
  SalonListResponse,
} from '@lumii/types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SalonListResponseDto implements SalonListResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  street: string;

  @ApiPropertyOptional()
  profileImageKey?: string;

  @ApiProperty()
  avgRating: number;

  @ApiProperty({ enum: SalonCategory, isArray: true })
  categories: SalonCategory[];

  @ApiProperty()
  @ApiPropertyOptional()
  isFavorite?: boolean;
}

class SalonMediaDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: MediaType })
  type: MediaType;

  @ApiProperty()
  sortOrder: number;

  @ApiProperty()
  key: string;
}

export class SalonDetailResponseDto implements SalonDetailResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  street: string;

  @ApiProperty()
  zipcode: string;

  @ApiProperty()
  country: string;

  @ApiPropertyOptional()
  isFavorite?: boolean;

  @ApiProperty({ enum: SalonCategory, isArray: true })
  categories: SalonCategory[];

  @ApiProperty({ type: SalonMediaDto })
  media: SalonMediaDto[];
}
