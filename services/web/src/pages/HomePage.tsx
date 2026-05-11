import { Footer } from '../components/Footer/Footer';
import { Header } from '../components/Header/Header';
import { SalonSection } from '../components/SalonSection/SalonSection';
import { SearchBar } from '../components/SearchBar/SearchBar';

const HomePage = () => {
  return (
    <>
      <Header />
      <SearchBar />

      <SalonSection></SalonSection>

      <Footer />
    </>
  );
};

export default HomePage;
