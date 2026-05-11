import { TextField, type TextFieldProps } from '@mui/material';

const FormInput = (props: TextFieldProps) => {
  return (
    <TextField
      {...props}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          fontSize: '22px',

          '& fieldset': {
            borderWidth: '2px',
            borderColor: 'var(--bg-color-brown)',
          },
          '& .MuiInput-underline:before': {
            borderBottomColor: 'red',
          },
          '&:hover fieldset': {
            borderColor: 'var(--color-peach)',
            transition: 'border-color 0.2s ease',
          },

          '&.Mui-focused fieldset': {
            borderColor: 'var(--color-peach)',
            borderWidth: 4,
          },
        },

        '& label.MuiInputLabel-root': {
          color: 'rgba(0,0,0,0.7)',
          fontSize: '22px',
        },

        '& .MuiInputBase-input': {
          color: 'black',
        },
        '& .MuiFormHelperText-root': {
          color: 'red',
          fontWeight: 'bold',
          fontSize: '16px',
        },
        '& label.Mui-focused': {
          color: 'black',
        },
        '& label.MuiInputLabel-shrink': {
          color: 'black',
        },
      }}
    />
  );
};

export default FormInput;
