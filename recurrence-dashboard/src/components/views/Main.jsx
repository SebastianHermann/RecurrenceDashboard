import React, { useState, useEffect, useRef } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import ListItemButton from '@mui/material/ListItemButton';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import Chip from '@mui/material/Chip';
import Slider from '@mui/material/Slider';
import Divider from '@mui/material/Divider';
import SpeedIcon from '@mui/icons-material/Speed';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { BrowserRouter, Routes, Route, Switch } from 'react-router-dom';
import TacticalGroups from './tacticalGroups/TacticalGroups';
import * as TGroups from '../../actions/TGroupActions';
import * as Tracking from '../../actions/TrackingActions';
import * as RPS from '../../actions/RPActions';
import { useParams } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import RecurrenceAnalysis from './tacticalGroups/RecurrenceAnalysis';

const Navbar = () => (
  <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static" style={{ minheight: '48px', boxShadow: 'None' }}>
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

const Loader = () => {
  return (
    <Grid item xs={12}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    </Grid>
  );
};

export default function Main(props) {
  const dispatch = useDispatch();

  // get tactical groups by project id
  // useEffect(() => {
  //   // dispatch(Tracking.GetTrackingData(payload));
  //   dispatch(TGroups.GetTGroups(params));
  // }, []);

  // useEffect(()=>{

  // })
  let params = useParams();

  const { projects } = useSelector((state) => state.Projects);
  const [project, setProject] = useState();

  const { tGroups } = useSelector((state) => state.TGroups);
  const { trackingData } = useSelector((state) => state.Tracking);
  const { rpsLoading, rps, selectedRPLoading, selectedRP } = useSelector(
    (state) => state.RecurrenceAnalysis
  );

  useEffect(() => {
    let project = projects.find(
      (project) => project._id.$oid === params.project_id
    );
    setProject(project);
  }, []);

  useEffect(() => {
    if (project) {
      let payload = { game_id: project.game_id, project_id: project._id.$oid };
      dispatch(Tracking.GetTrackingData(payload));
      dispatch(TGroups.GetTGroups(payload));
      dispatch(RPS.GetRPSInfo(payload));
    }
  }, [project]);

  // useEffect(() => {
  //   console.log(rps.length, !selectedRP.length);
  //   if (rps.length && !selectedRP.length) {
  //     dispatch(RPS.GetRP(rps[0]));
  //     console.log('Trigger Creation of excisting RP');
  //   }
  // }, [rps]);

  useEffect(() => {
    console.log('Selected is:', selectedRP);
  }, [selectedRP]);

  const [alignment, setAlignment] = React.useState('tacticalgroups');

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="xl">
        <Box sx={{ bgcolor: '#f8f8f8', height: '93vh' }}>
          <Box sx={{ width: '100%', borderRadius: '5px' }}>
            <Grid
              container
              spacing={0}
              alignItems="center"
              style={{ padding: '24px' }}
            >
              {project && (
                <>
                  <Grid item xs={6}>
                    <Typography
                      variant="h5"
                      // gutterBottom
                      component="div"
                      fontWeight={500}
                    >
                      {project.title}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    style={{ alignSelf: 'flex-end', paddingLeft: '24px' }}
                  >
                    <Typography
                      variant="h6"
                      // gutterBottom
                      component="div"
                      fontWeight={500}
                    >
                      {'Game' + project.game_id}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} style={{ textAlign: 'right' }}>
                    <ToggleButtonGroup
                      color="primary"
                      value={alignment}
                      exclusive
                      onChange={handleChange}
                      size="small"
                    >
                      <ToggleButton value="tacticalgroups">
                        Tactical Groups
                      </ToggleButton>
                      <ToggleButton value="recurrenceanalysis">
                        Recurrence Analysis
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Grid>
                </>
              )}
            </Grid>
            <Grid container item xs={12}>
              {alignment === 'tacticalgroups' ? (
                <TacticalGroups />
              ) : (
                <RecurrenceAnalysis project={project} />
              )}
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}
