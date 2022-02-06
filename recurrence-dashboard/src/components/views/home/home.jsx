import React from 'react';
import { Button, Grid, Link, Typography } from '@mui/material';
import SoccerPlayer from '../../../static/SoccerPlayer2.svg';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';

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

function Home() {
  const navigate = useNavigate();
  return (
    <Grid container style={{ height: '100vh' }}>
      <Grid
        container
        item
        xs={6}
        style={{ zIndex: 1, padding: '160px' }}
        alignContent="flex-start"
        spacing={3}
      >
        <Grid item xs={12}>
          <Typography className="title-2" style={{ maxWidth: '600px' }}>
            Create <span className="underlined">Recurrence Analyses</span> for
            football matches.
          </Typography>
          <Typography className="subtitle-2">
            (Without having to write a single line of code)
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Button
            className="secondary-button"
            size="large"
            onClick={() => navigate('/projects')}
          >
            Start Exploring
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          style={{
            position: 'absolute',
            bottom: '96px',
            maxWidth: '540px',
          }}
        >
          <Link
            href="https://www.frontiersin.org/articles/10.3389/fpsyg.2021.747058/full"
            underline="hover"
            target={'blank'}
            className="link"
            gutterBottom
          >
            {'Football Match Dynamics Explored by Recurrence Analysis'}
          </Link>
          <Typography className="subtitle-2">
            Lames, M., Hermann, S., Prüßner, R., & Meth, H. (2021). Football
            Match Dynamics Explored by Recurrence Analysis. Frontiers in
            Psychology, 4125.
          </Typography>
        </Grid>
      </Grid>
      <img
        src={SoccerPlayer}
        style={{
          zIndex: '0.5',
          position: 'absolute',
          objectFit: 'cover',
          height: '100%',
          right: '0',
        }}
        alt="football"
      />
    </Grid>
  );
}

export default Home;
