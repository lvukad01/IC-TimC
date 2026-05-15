import type { SalonListResponse } from '@lumii/types';
import type { SalonCardData } from '@tstypes/SalonCard';

export const mapSalonForCard = (
  salon: SalonListResponse,
  urlMap: Map<string, string>,
): SalonCardData => {
  return {
    id: salon.id,
    profileImage: salon.profileImageKey ? (urlMap.get(salon.profileImageKey) ?? '') : '',
    name: salon.name,
    rating: salon.avgRating ?? 0,
    categories: salon.categories,
    address: `${salon.street}, ${salon.city}`,
  };
};
