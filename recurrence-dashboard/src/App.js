import React from 'react';
import logo from './logo.svg';
import './App.css';
import ProjectsMain from './components/views/projects/ProjectsMain';
import Main from './components/views/Main';
import TGroupsMain from './components/views/tacticalGroups/TGroupsMain';
import Home from './components/views/home/home';
import { Grid } from '@mui/material';
import football from './static/football.jpg';

function App() {
  return (
    <Grid container style={{ height: '100vh' }}>
      <Grid item xs={12} style={{ zIndex: 1 }}>
        <Home />
      </Grid>
      <img
        src={football}
        style={{
          zIndex: '0.5',
          position: 'absolute',
          objectFit: 'cover',
          height: '100%',
          width: '100%',
          opacity: '70%',
        }}
        alt="football"
      />
    </Grid>
  );
}

export default App;
