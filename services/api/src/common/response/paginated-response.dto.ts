import { ApiProperty } from '@nestjs/swagger';

export class PaginationMeta {
  @ApiProperty({ description: 'Total items in all pages' })
  total: number;

  @ApiProperty({ description: 'Limit value' })
  limit: number;

  @ApiProperty({ description: 'Number of current page' })
  page: number;

  @ApiProperty({ description: 'Number of last page' })
  lastPage: number;

  @ApiProperty({ description: 'Number of prev page.Null if does not exist' })
  prev: number | null;

  @ApiProperty({ description: 'Number of next page.Null if does not exist' })
  next: number | null;
}

export class PaginatedResponse<T> {
  results: T[];

  @ApiProperty({ type: PaginationMeta })
  meta: PaginationMeta;
}

export function SwaggerPaginatedApiResponse<T>(
  classRef: new () => T,
  name: string,
): typeof PaginatedResponse {
  class ExtendPaginatedApiResponse<T> extends PaginatedResponse<T> {
    @ApiProperty({ type: [classRef] })
    declare public results: T[];
  }

  Object.defineProperty(ExtendPaginatedApiResponse, 'name', {
    value: name,
  });

  return ExtendPaginatedApiResponse;
}
