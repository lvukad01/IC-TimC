import { Footer } from '../components/Home/Footer/Footer';
import { Header } from '../components/Home/Header/Header';
import { SalonSection } from '../components/Home/SalonSection/SalonSection';
import { SearchBar } from '../components/Home/SearchBar/SearchBar';
import { HeroSection } from '../components/Home/HeroSection/HeroSection';
import salonImg from '../assets/media/frizer 1.png';
import useInfiniteScroll from '@hooks/useInfiniteScroll';

export const salons = [
  {
    id: '1',
    image: salonImg,
    name: 'Glow Studio',
    rating: 4.9,
    type: 'Hair & Makeup',
    address: 'Zagreb',
  },
  {
    id: '2',
    image: salonImg,
    name: 'Beauty Lab',
    rating: 4.8,
    type: 'Nails',
    address: 'Split',
  },
  {
    id: '3',
    image: salonImg,
    name: 'Luxe Hair',
    rating: 5.0,
    type: 'Hair',
    address: 'Rijeka',
  },
];
const HomePage = () => {
  const loadMoreRef = useInfiniteScroll({
    fetchNextPage: () => {
      console.log('fetch next page');
    },
    hasNextPage: true,
    isFetchingNextPage: false,
  });
  return (
    <>
      <Header />
      <HeroSection />
      <SearchBar />

      <SalonSection
        title="Preporuke"
        borderColor="#DC6AB8"
        salons={salons}
        loadMoreRef={loadMoreRef}
      />
      <SalonSection
        title="Popularno"
        borderColor="#9786CA"
        salons={salons}
        loadMoreRef={loadMoreRef}
      />
      <SalonSection title="Novo" borderColor="#029ED8" salons={salons} loadMoreRef={loadMoreRef} />
      <Footer />
    </>
  );
};

export default HomePage;
