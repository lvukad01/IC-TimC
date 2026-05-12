import useCountries from '@hooks/useCountries';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';

interface CountrySelectProps {
  name: string;
}
const CountrySelect = ({ name }: CountrySelectProps) => {
  const countries = useCountries();
  const { control } = useFormContext();

  return (
    <div style={{ marginTop: 16.5 }}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            styles={{
              control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ? 'var(--color-purple)' : 'var(--input-border-color)',
                borderRadius: 'var(--main-border-radius)',
                borderWidth: '2px',
                padding: '0px 16.5px',

                '&:hover': {
                  borderColor: 'var(--color-purple)',
                },
              }),

              option: (base, state) => {
                let backgroundColor = 'white';

                if (state.isSelected) {
                  backgroundColor = 'var(--color-purple)';
                } else if (state.isFocused) {
                  backgroundColor = '#f3f0ff';
                }

                return {
                  ...base,
                  backgroundColor,
                };
              },
            }}
            {...field}
            options={countries}
            onChange={(val) => field.onChange(val?.value)}
            value={countries.find((c) => c.value === field.value)}
            placeholder="Select country"
          />
        )}
      />
    </div>
  );
};

export default CountrySelect;
