import { useEffect, useState } from 'react';

import { BusinessSection } from '@components/Home/BusinessSection/BusinessSection';
import { Footer } from '@components/Home/Footer/Footer';
import { HeroSection } from '@components/Home/HeroSection/HeroSection';
import { SalonSection } from '@components/Home/SalonSection/SalonSection';
import { SearchBar } from '@components/Home/SearchBar/SearchBar';

import { getSignedFiles } from '@api/files';
import { mapSalonForCard } from '@helpers/salonMapper';
import type { SalonListResponse } from '@lumii/types';
import type { SalonCardData } from '@tstypes/SalonCard';
import { AppPaths } from 'common/routes/paths';
import { api } from '@api/index';

const getResults = (response: any) =>
  response?.data?.results ?? response?.results ?? response?.data?.data?.results ?? [];

const LIMIT = 6;

const HomePage = () => {
  const [recommended, setRecommended] = useState<SalonCardData[]>([]);
  const [popular, setPopular] = useState<SalonCardData[]>([]);
  const [newest, setNewest] = useState<SalonCardData[]>([]);

  useEffect(() => {
    const fetchHomeSalons = async () => {
      try {
        const [recommendedResponse, popularResponse, newestResponse] = await Promise.all([
          api.get(`/salons/recommended?page=1&limit=${LIMIT}`),
          api.get(`/salons/popular?page=1&limit=${LIMIT}`),
          api.get(`/salons/newest?page=1&limit=${LIMIT}`),
        ]);

        const recommendedResults = getResults(recommendedResponse);

        const popularResults = getResults(popularResponse);
        const newestResults = getResults(newestResponse);

        const allSalons = [...recommendedResults, ...popularResults, ...newestResults];

        const keys = [...new Set(allSalons.map((salon) => salon.profileImageKey).filter(Boolean))];

        const signedData = keys.length > 0 ? await getSignedFiles(keys) : { files: [] };

        const urlMap = new Map<string, string>(
          signedData.files.map((file: any) => [file.key, file.url]),
        );

        setRecommended(
          recommendedResults.map((s: SalonListResponse) => mapSalonForCard(s, urlMap)),
        );
        setPopular(popularResults.map((s: SalonListResponse) => mapSalonForCard(s, urlMap)));
        setNewest(newestResults.map((s: SalonListResponse) => mapSalonForCard(s, urlMap)));
      } catch (error) {
        console.error('Failed to fetch salons:', error);
      }
    };

    fetchHomeSalons();
  }, []);

  return (
    <>
      <HeroSection />
      <SearchBar />

      <SalonSection
        title="Preporuke"
        borderColor="#DC6AB8"
        salons={recommended}
        viewMorePath={AppPaths.VIEW_MORE_RECOMMENDED}
      />

      <SalonSection
        title="Popularno"
        borderColor="#9786CA"
        salons={popular}
        viewMorePath={AppPaths.VIEW_MORE_POPULAR}
      />

      <SalonSection
        title="Novo"
        borderColor="#029ED8"
        salons={newest}
        viewMorePath={AppPaths.VIEW_MORE_NEWEST}
      />

      <BusinessSection />
      <Footer />
    </>
  );
};

export default HomePage;
