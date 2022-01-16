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
import { useDispatch, useSelector } from 'react-redux';
import * as Projects from '../../../actions/ProjectActions';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';

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
  return (
    <Card sx={{ minWidth: 200 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {'Game ' + props.project.game_id}
        </Typography>
        <Typography variant="h5" component="div">
          {props.project.title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {props.project.game_result}
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
        <CreateDialog open={openCreateDialog} handleClose={handleClose} />
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

export default function ProjectsMain() {
  const dispatch = useDispatch();
  const { loading, projects } = useSelector((state) => state.Projects);

  useEffect(() => {
    dispatch(Projects.GetProjects());
  }, []);

  useEffect(() => {
    console.log('Projects:', projects);
  }, [projects]);

  return (
    <React.Fragment>
      {/* <CssBaseline /> */}
      <Navbar />
      <Container maxWidth="xl">
        <Box sx={{ bgcolor: '#f8f8f8', height: '90vh' }}>
          <Box sx={{ width: '100%', background: 'white' }}>
            <Header />
          </Box>
          <Grid container spacing={2} style={{ padding: '2%' }}>
            {projects ? (
              projects.map((item) => (
                <Grid item xs={4} md={3} key={item._id.$oid}>
                  <ProjectCard project={item} />
                </Grid>
              ))
            ) : (
              <Loader />
            )}
          </Grid>
        </Box>
      </Container>
    </React.Fragment>
  );
}
