import useCountries from '@hooks/useCountries';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';

const CountrySelect = () => {
  const countries = useCountries();
  const { control } = useFormContext();

  return (
    <Controller
      name="country"
      control={control}
      render={({ field }) => (
        <Select
          {...field}
          options={countries}
          onChange={(val) => field.onChange(val?.value)}
          value={countries.find((c) => c.value === field.value)}
          placeholder="Select country"
        />
      )}
    />
  );
};

export default CountrySelect;
