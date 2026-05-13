import { useEffect, useState } from 'react';

import { Footer } from '@components/Home/Footer/Footer';
import { SalonSection } from '@components/Home/SalonSection/SalonSection';
import { SearchBar } from '@components/Home/SearchBar/SearchBar';
import { HeroSection } from '@components/Home/HeroSection/HeroSection';
import { BusinessSection } from '@components/Home/BusinessSection/BusinessSection';

import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { api } from '../api';
import { getSignedFiles } from '@api/files';

type SalonCardData = {
  id: string;
  image: string;
  name: string;
  rating: number;
  type: string;
  address: string;
};

const getResults = (response: any) =>
  response?.data?.results ?? response?.results ?? response?.data?.data?.results ?? [];

const signSalonImages = async (salons: any[]) => {
  const keys = salons.map((salon) => salon.profileImageKey).filter(Boolean);

  const signedData = keys.length > 0 ? await getSignedFiles(keys) : { files: [] };

  const urlMap = new Map<string, string>(signedData.files.map((file: any) => [file.key, file.url]));

  return salons.map((salon) => ({
    id: salon.id,
    image: salon.profileImageKey ? (urlMap.get(salon.profileImageKey) ?? '') : '',
    name: salon.name,
    rating: salon.avgRating ?? 0,
    type: salon.type ?? '',
    address: `${salon.street}, ${salon.city}`,
    bookingsCount: salon.bookingsCount ?? 0,
    createdAt: salon.createdAt,
  }));
};

const HomePage = () => {
  const [recommended, setRecommended] = useState<SalonCardData[]>([]);
  const [popular, setPopular] = useState<SalonCardData[]>([]);
  const [newest, setNewest] = useState<SalonCardData[]>([]);

  const loadMoreRef = useInfiniteScroll({
    fetchNextPage: () => {},
    hasNextPage: false,
    isFetchingNextPage: false,
  });

  useEffect(() => {
    const fetchHomeSalons = async () => {
      try {
        const [recommendedResponse, popularResponse, newestResponse] = await Promise.all([
          api.get('/salons/recommended'),
          api.get('/salons/popular'),
          api.get('/salons/newest'),
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

        const mapSalonForCard = (salon: any): SalonCardData => ({
          id: salon.id,
          image: salon.profileImageKey ? (urlMap.get(salon.profileImageKey) ?? '') : '',
          name: salon.name,
          rating: salon.avgRating ?? 0,
          type: salon.type ?? '',
          address: `${salon.street}, ${salon.city}`,
        });

        setRecommended(recommendedResults.map(mapSalonForCard));
        setPopular(popularResults.map(mapSalonForCard));
        setNewest(newestResults.map(mapSalonForCard));
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
        loadMoreRef={loadMoreRef}
      />

      <SalonSection
        title="Popularno"
        borderColor="#9786CA"
        salons={popular}
        loadMoreRef={loadMoreRef}
      />

      <SalonSection title="Novo" borderColor="#029ED8" salons={newest} loadMoreRef={loadMoreRef} />

      <BusinessSection />
      <Footer />
    </>
  );
};

export default HomePage;
