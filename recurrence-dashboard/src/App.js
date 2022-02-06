import { createTheme } from '@material-ui/core/styles';
import React from 'react';
import './App.css';
import Home from './components/views/home/home';

export const theme = createTheme({
  primary: {
    main: '#1F2041',
    support: '#A7A8AB',
    background: '#FBFDFF',
    white: '#FFFFFF',
  },
  palette: {
    primary: {
      main: '#1F2041',
      support: '#A7A8AB',
      background: '#FBFDFF',
      white: '#FFFFFF',
    },
    secondary: {
      main: '#FFC857',
      support: '#FBE1B5',
    },
    tertiary: {
      main: '#1976D2',
      support: '#E1EDF9',
    },
    target: {
      main: '#E01A4F',
      support: '#F9D1DC',
    },
    opponent: {
      main: '#55A87B',
      support: '#DDEEE4',
    },
  },
});

function App() {
  return <Home />;
}

export default App;
