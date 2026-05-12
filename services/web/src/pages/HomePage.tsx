import { Footer } from '../components/Footer/Footer';
import { Header } from '../components/Header/Header';
import { SalonSection } from '../components/SalonSection/SalonSection';
import { SearchBar } from '../components/SearchBar/SearchBar';
import { HeroSection } from '../components/HeroSection/HeroSection';

const HomePage = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <SearchBar />

      <SalonSection></SalonSection>

      <Footer />
    </>
  );
};

export default HomePage;
