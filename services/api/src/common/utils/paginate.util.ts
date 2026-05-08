import { PaginatedResponse } from '@response/paginated-response.dto';

interface PaginateOptions {
  model: any;
  page?: number;
  limit?: number;
  where?: any;
  orderBy?: any;
  include?: any;
}

export async function paginate<T>({
  model,
  page = 1,
  limit = 4,
  where,
  orderBy,
  include,
}: PaginateOptions): Promise<PaginatedResponse<T>> {
  const skip = (page - 1) * limit;

  const [results, total] = await Promise.all([
    model.findMany({ skip, take: limit, where, orderBy, include }),
    model.count({ where }),
  ]);

  const lastPage = Math.ceil(total / limit);

  return {
    results,
    meta: {
      total,
      page,
      limit,
      prev: page > 1 ? page - 1 : null,
      next: page < lastPage ? page + 1 : null,
      lastPage,
    },
  };
}
