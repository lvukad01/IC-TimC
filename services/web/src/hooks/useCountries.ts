import { useMemo } from 'react';
import countryList from 'react-select-country-list';

const useCountries = () => {
  return useMemo(() => countryList().getData(), []);
};

export default useCountries;
