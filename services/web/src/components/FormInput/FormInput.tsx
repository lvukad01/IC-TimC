import { TextField, type TextFieldProps } from '@mui/material';

const FormInput = (props: TextFieldProps) => {
  return (
    <TextField
      {...props}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 'var(--main-border-radius)',
          height: 40,
          display: 'flex',
          alignItems: 'center',

          '& fieldset': {
            borderWidth: '2px',
            borderColor: '#A59DBD',
          },
          '& .MuiInput-underline:before': {
            borderBottomColor: 'red',
          },
          '&:hover fieldset': {
            borderColor: 'var(--color-purple)',
            transition: 'border-color 0.2s ease',
          },

          '&.Mui-focused fieldset': {
            borderColor: 'var(--color-purple)',
            borderWidth: 3,
          },
        },

        '& label.MuiInputLabel-root': {
          fontSize: '18px',
          color: 'rgba(0,0,0,0.7)',
        },

        '& .MuiInputBase-input': {
          color: 'black',
        },

        '& .MuiFormHelperText-root': {
          color: 'red',
          fontWeight: 'bold',
          fontSize: '14px',
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
