import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from './SearchPage.module.css';

const categories = ['Sve', 'Kosa', 'Nokti', 'Make up', 'Brijanje'];

const SearchServicePage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSelect = (category: string) => {
    navigate('/', { state: { category } });
  };

  return (
    <section className={styles.page}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        ←
      </button>
      <h1 className={styles.title}>Pretraga</h1>
      <input
        className={styles.input}
        placeholder="Usluga, salon..."
        autoFocus
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className={styles.chips}>
        {categories
          .filter((c) => c.toLowerCase().includes(search.toLowerCase()) || search === '')
          .map((category) => (
            <button key={category} className={styles.chip} onClick={() => handleSelect(category)}>
              {category}
            </button>
          ))}
      </div>
    </section>
  );
};

export default SearchServicePage;
