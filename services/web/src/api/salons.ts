import { mapSalonForCard } from '@helpers/salonMapper';
import { type PaginatedResponse, type SalonListResponse } from '@lumii/types';
import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';
import type { SalonCardData } from '@tstypes/SalonCard';
import { getSignedFiles } from './files';
import { api } from './index';
import { QueryKeys } from './queryKeys';

export const getSalons = async () => {
  return api.get('/salons');
};

export const getNearbySalons = async () => {
  return api.get('/salons/nearby');
};

export const getMoreSalons = async (endpoint: string, page: number, limit: number) => {
  return api.get<PaginatedResponse<SalonListResponse>>(endpoint, {
    params: { page, limit },
  });
};

export const useMoreSalonsInfinite = (endpoint: string, limit: number) => {
  return useInfiniteQuery<
    PaginatedResponse<SalonCardData>,
    Error,
    InfiniteData<PaginatedResponse<SalonCardData>>,
    any,
    number
  >({
    queryKey: [QueryKeys.SALONS_INFINITE, endpoint],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getMoreSalons(endpoint, pageParam, limit);
      const results = response.results;

      const keys = [...new Set(results.map((salon: any) => salon.profileImageKey).filter(Boolean))];
      const signedData = keys.length > 0 ? await getSignedFiles(keys) : { files: [] };

      const urlMap = new Map<string, string>(
        signedData.files.map((file: any) => [file.key, file.url]),
      );

      return {
        ...response,
        results: results.map((s: SalonListResponse) => mapSalonForCard(s, urlMap)),
      };
    },
    getNextPageParam: (lastPage: PaginatedResponse<SalonCardData>) =>
      lastPage.meta.next ?? undefined,
    staleTime: 5 * 60 * 1000,
    initialPageParam: 1,
  });
};
