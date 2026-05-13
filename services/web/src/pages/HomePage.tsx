import { useEffect, useState } from 'react';

import { Footer } from '../components/Home/Footer/Footer';
import { SalonSection } from '../components/Home/SalonSection/SalonSection';
import { SearchBar } from '../components/Home/SearchBar/SearchBar';
import { HeroSection } from '../components/Home/HeroSection/HeroSection';
import { BusinessSection } from '@components/Home/BusinessSection/BusinessSection';

import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { api } from '../api';

type SalonCardData = {
  id: string;
  image: string;
  name: string;
  rating: number;
  type: string;
  address: string;
};

const mapSalonForCard = (salon: any): SalonCardData => ({
  id: salon.id,
  image: salon.profileImageKey ?? '',
  name: salon.name,
  rating: salon.avgRating ?? 0,
  type: '',
  address: `${salon.street}, ${salon.city}`,
});

const getResults = (response: any) => response?.data?.results ?? [];

const HomePage = () => {
  const [recommended, setRecommended] = useState<SalonCardData[]>([]);
  const [popular, setPopular] = useState<SalonCardData[]>([]);
  const [newest, setNewest] = useState<SalonCardData[]>([]);

  const loadMoreRef = useInfiniteScroll({
    fetchNextPage: () => {
      console.log('fetch next page');
    },
    hasNextPage: true,
    isFetchingNextPage: false,
  });

  useEffect(() => {
    const fetchHomeSalons = async () => {
      try {
        const [recommendedData, popularData, newestData] = await Promise.all([
          api.get('/salons'),
          api.get('/salons/popular'),
          api.get('/salons/newest'),
        ]);

        const recommendedResults = getResults(recommendedData);
        const popularResults = getResults(popularData);
        const newestResults = getResults(newestData);

        setRecommended(
          recommendedResults
            .map(mapSalonForCard)
            .sort((a: SalonCardData, b: SalonCardData) => b.rating - a.rating),
        );

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
