// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#42E6B5',
    },
    background: {
      default: '#12121a',
      paper: '#2B2C3C',
      input: '#2c2c3a',
      inputDisabled: '#424254',
    },
    text: {
      primary: '#ffffff',
      secondary: '#aaa',
      disabled: '#7B7A8E',
      sub: '#B7B7C9',
    },
    border: {
      main: '#3c3d4e'
    },
    custom: {
      menuBg: '#2b2c3c',
    }
  },
  shape: {
    borderRadius: 10,
  },
});

export default theme;
