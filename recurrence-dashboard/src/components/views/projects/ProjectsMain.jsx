import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Projects from '../../../actions/ProjectActions';
import * as Stats from '../../../actions/StatsActions';
import CreateProjectDialog from './CreateProjectDialog';
import ProjectAnalytics from '../../../static/ProjectsAnalytics.svg';
import GridLoader from '../../../static/Loaders/grid.svg';

const ProjectCard = (props) => {
  const navigate = useNavigate();
  // const { allStats } = useSelector((state) => state.Stats);
  const [gameStats, setGameStats] = useState();

  return (
    <>
      <Grid container item xs={12} className="card-container">
        <Grid item xs={12} className="card-container-item">
          <Typography className="subtitle-2">
            {'Game ' + props.project.game_id}
          </Typography>
          <Typography className="title-4">{props.project.title}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider style={{ marginTop: '8px' }} />
        </Grid>
        <Grid container item xs={12} className="card-container-item">
          <Grid item xs={12} style={{ textAlign: 'left' }}>
            <Typography>
              {props.stats
                ? props.stats.HomeTeam +
                  '   ' +
                  props.stats.Full_Time_Home_Team_Goals +
                  '  :  ' +
                  props.stats.Full_Time_Away_Team_Goals +
                  '   ' +
                  props.stats.AwayTeam
                : '-'}
            </Typography>
          </Grid>
        </Grid>

        <Grid item xs={12} className="card-container-item">
          <Typography className="title-5">
            {props.project.t_groups_amount} Tactical Groups
          </Typography>
          <Typography className="title-5">
            {props.project.rp_amount} Recurrence Plots
          </Typography>
        </Grid>
        <Grid item xs={12} className="card-container-item">
          <Button
            size="small"
            onClick={() =>
              navigate(
                '/projects/' + props.project._id.$oid + '/tacticalgroups'
              )
            }
            style={{ marginBottom: '16px' }}
            className="tertiary-button"
          >
            Open
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

const Loader = () => {
  return (
    <Grid container style={{ height: '100vh', width: '100vw' }}>
      <Grid item xs={12} style={{ alignSelf: 'center', textAlign: 'center' }}>
        <img src={GridLoader} />
      </Grid>
    </Grid>
  );
};

export default function ProjectsMain() {
  const dispatch = useDispatch();
  const { loading, projects, user } = useSelector((state) => state.Projects);
  const { stats, allStats } = useSelector((state) => state.Stats);

  const [loadingProjects, setLoadingProjects] = useState(true);

  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const handleClickOpen = () => {
    setOpenCreateDialog(true);
  };

  const handleClose = () => {
    setOpenCreateDialog(false);
    // dispatch(Projects.GetProjects(user));
    // dispatch(Stats.GetAllStats());
  };

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setLoadingProjects(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [projects]);

  useEffect(() => {
    dispatch(Projects.GetProjects(user));
    dispatch(Stats.GetAllStats());
  }, []);

  return (
    <React.Fragment>
      {loadingProjects ? (
        <Loader />
      ) : (
        <Grid container style={{ height: '100vh' }}>
          <Grid
            container
            item
            xs={12}
            spacing={0}
            alignItems="center"
            style={{
              padding: '24px 240px',
              alignItems: 'flex-start',
              alignContent: 'flex-start',
            }}
          >
            <Grid container item xs={12} alignItems={'center'}>
              <Grid container item xs={12}>
                <Grid item xs={10}>
                  <Typography className="title-4">Welcome !</Typography>
                  <Typography className="title-2">
                    Projects{' '}
                    <span className="subtitle-2">
                      {projects.length + ' Projects'}
                    </span>
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={2}
                  alignSelf="end"
                  justifySelf={'flex-end'}
                  textAlign={'right'}
                  style={{ marginBottom: '16px' }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                    onClick={handleClickOpen}
                    className="secondary-button"
                  >
                    New Project
                  </Button>
                  <CreateProjectDialog
                    open={openCreateDialog}
                    handleClose={handleClose}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} style={{ paddingTop: '16px' }}>
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
              {!loadingProjects ? (
                projects.map((item) => (
                  <Grid item lg={4} xl={3} key={item._id.$oid}>
                    <ProjectCard
                      project={item}
                      stats={allStats.find(
                        (stat) => stat.game_id === item.game_id
                      )}
                    />
                  </Grid>
                ))
              ) : (
                <></>
              )}
            </Grid>
            <img
              src={ProjectAnalytics}
              style={{
                zIndex: '-1',
                position: 'absolute',
                objectFit: 'cover',
                width: '70%',
                right: 'auto',
                left: 'auto',
                bottom: '24px',
                opdacity: '50%',
              }}
              alt="football"
            />
          </Grid>
        </Grid>
      )}
    </React.Fragment>
  );
}
