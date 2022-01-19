import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import CreateDialog from './createDialog';
import CreateProjectDialog from './CreateProjectDialog';
import { useDispatch, useSelector } from 'react-redux';
import * as Projects from '../../../actions/ProjectActions';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import * as Stats from '../../../actions/StatsActions';

const Navbar = () => (
  <Box sx={{ flexGrow: 1 }} style={{ marginBottom: '2%' }}>
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Recurrence Dashboard
          </Typography>
          <Button color="inherit">More Information</Button>
        </Toolbar>
      </Container>
    </AppBar>
  </Box>
);

const ProjectCard = (props) => {
  const navigate = useNavigate();
  // const { allStats } = useSelector((state) => state.Stats);
  const [gameStats, setGameStats] = useState();

  return (
    <Card sx={{ minWidth: 200 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {'Game ' + props.project.game_id}
        </Typography>
        <Typography
          variant="h5"
          component="div"
          fontWeight={500}
          style={{ color: '#4A5268' }}
        >
          {props.project.title}
        </Typography>
        <Typography color="text.secondary">
          {props.stats ? props.stats.Full_Time_Home_Team_Goals + '  ' : '-'}
          {props.stats ? props.stats.HomeTeam : '-'}
          {/* {props.project.game_result} */}
        </Typography>
        <Typography color="text.secondary">
          {props.stats ? props.stats.Full_Time_Away_Team_Goals + '  ' : '-'}
          {props.stats ? props.stats.AwayTeam : '-'}
          {/* {props.project.game_result} */}
        </Typography>
        {/* <Typography variant="body2">
          {'Some Info about the project'}
        </Typography> */}
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => navigate('/projects/' + props.project._id.$oid)}
        >
          Open
        </Button>
      </CardActions>
    </Card>
  );
};

const Header = () => {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const handleClickOpen = () => {
    setOpenCreateDialog(true);
  };

  const handleClose = () => {
    setOpenCreateDialog(false);
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        {/* <Item>xs=6 md=8</Item> */}
        <Typography variant="h3" gutterBottom component="div">
          Welcome!
        </Typography>
        <Typography variant="h6" gutterBottom component="div">
          Select one of your projects or create a new one.
        </Typography>
      </Grid>
      <Grid
        container
        item
        xs={12}
        md={4}
        alignItems={'center'}
        justifyContent={'flex-start'}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          New
        </Button>

        <CreateProjectDialog
          open={openCreateDialog}
          handleClose={handleClose}
        />
      </Grid>
    </Grid>
  );
};

const Loader = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  );
};

const SideNav = () => {
  return (
    <>
      <div>
        <Toolbar style={{ paddingTop: '24px' }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: '500' }}
          >
            Recboard
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          <ListItem button>
            <ListItemText primary={'Projects'} />
          </ListItem>
          <ListItem button>
            <ListItemText primary={'More Information'} />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button>
            <ListItemText primary={'Start Use Case Scenarios'} />
          </ListItem>
        </List>
      </div>
    </>
  );
};

export default function ProjectsMain() {
  const dispatch = useDispatch();
  const { loading, projects, user } = useSelector((state) => state.Projects);
  const { stats, allStats } = useSelector((state) => state.Stats);

  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const handleClickOpen = () => {
    setOpenCreateDialog(true);
  };

  const handleClose = () => {
    setOpenCreateDialog(false);
  };

  useEffect(() => {
    dispatch(Projects.GetProjects(user));
    dispatch(Stats.GetAllStats());
  }, []);

  return (
    <React.Fragment>
      {/* <CssBaseline /> */}
      {/* <Navbar /> */}
      <Grid container style={{ height: '100vh' }}>
        <Grid
          item
          xs={1.5}
          style={{ height: '100vh', background: '#005AE8', color: 'white' }}
        >
          <SideNav />
        </Grid>

        <Grid
          container
          item
          xs={10.5}
          spacing={0}
          alignItems="center"
          style={{
            padding: '24px',
            alignItems: 'flex-start',
            alignContent: 'flex-start',
          }}
        >
          {/* <Box sx={{ bgcolor: '#f8f8f8', height: '90vh' }}> */}
          <Grid
            container
            item
            xs={12}
            alignItems={'center'}
            // style={{ paddingBottom: '12px', paddingLeft: '6px' }}
          >
            <Grid container item xs={12}>
              <Grid item xs={10}>
                <Typography
                  variant="h5"
                  // gutterBottom
                  style={{ color: '#4A5268' }}
                  component="div"
                  fontWeight={500}
                >
                  Projects
                </Typography>
              </Grid>
              <Grid
                item
                xs={2}
                alignItems={'center'}
                justifyContent={'flex-end'}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={handleClickOpen}
                >
                  New
                </Button>
                <CreateProjectDialog
                  open={openCreateDialog}
                  handleClose={handleClose}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  // gutterBottom
                  component="div"
                  color="text.secondary"
                  // fontWeight={500}
                >
                  {projects.length + ' Projects'}
                  {/* Datum des Spiels */}
                </Typography>
              </Grid>
            </Grid>
            {/* <Grid item xs={4} style={{ textAlign: 'right' }}></Grid> */}
            <Grid item xs={12} style={{ paddingTop: '12px' }}>
              <Divider />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={3}
            item
            xs={12}
            style={{ paddingTop: '24px' }}
          >
            {projects ? (
              projects.map((item) => (
                <Grid item xs={3} key={item._id.$oid}>
                  <ProjectCard
                    project={item}
                    stats={allStats.find(
                      (stat) => stat.game_id === item.game_id
                    )}
                  />
                </Grid>
              ))
            ) : (
              <Loader />
            )}
          </Grid>
          {/* </Box> */}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
