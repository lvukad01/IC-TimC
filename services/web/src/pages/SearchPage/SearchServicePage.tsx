import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './SearchPage.module.css';
import { getServiceCategories, type ServiceCategory } from '../../api/serviceCategories';

const allCategory: ServiceCategory = {
  id: 'all',
  name: 'Sve',
  slug: 'all',
};

const SearchServicePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<ServiceCategory[]>([allCategory]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getServiceCategories();
        setCategories([allCategory, ...data]);
      } catch (error) {
        console.error('Failed to fetch service categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSelect = (category: ServiceCategory) => {
    navigate('/', {
      state: {
        ...location.state,
        category: category.slug,
        categoryName: category.name,
      },
    });
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className={styles.title}>Pretraga</h1>
      </div>

      <input
        className={styles.input}
        placeholder="Usluga, salon..."
        autoFocus
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className={styles.chips}>
        {isLoading && <p>Učitavanje...</p>}

        {!isLoading &&
          filteredCategories.map((category) => (
            <button
              key={category.id}
              className={styles.chip}
              onClick={() => handleSelect(category)}
            >
              {category.name}
            </button>
          ))}
      </div>
    </section>
  );
};

export default SearchServicePage;
