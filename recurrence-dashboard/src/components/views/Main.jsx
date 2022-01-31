import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import * as Events from '../../actions/EventActions';
import * as RPS from '../../actions/RPActions';
import * as Stats from '../../actions/StatsActions';
import * as TGroups from '../../actions/TGroupActions';
import * as Tracking from '../../actions/TrackingActions';

const SideNav = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let params = useParams();

  const [selectedTab, setSelectedTab] = useState('tacticalgroups');

  const handleNavElementClick = (event, value) => {
    setSelectedTab(value);

    navigate('/projects/' + params.project_id + '/' + value);
  };

  const handleProjectsNavClick = () => {
    dispatch({ type: 'TRACKING_CLEAR' });
    navigate('/projects');
  };

  return (
    <>
      <Toolbar style={{ paddingTop: '24px' }}></Toolbar>
      <Grid container>
        <Grid item xs={12}>
          <Typography
            className="sidenav-container-item"
            onClick={handleProjectsNavClick}
          >
            Projects
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography
            className={
              selectedTab === 'tacticalgroups'
                ? 'sidenav-container-item-active'
                : 'sidenav-container-item'
            }
            onClick={(event) => handleNavElementClick(event, 'tacticalgroups')}
          >
            Tactical Groups
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography
            className={
              selectedTab === 'recurrenceanalysis'
                ? 'sidenav-container-item-active'
                : 'sidenav-container-item'
            }
            onClick={(event) =>
              handleNavElementClick(event, 'recurrenceanalysis')
            }
          >
            Recurrence Analysis
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography
            className={
              selectedTab === 'recurrencecomparison'
                ? 'sidenav-container-item-active'
                : 'sidenav-container-item'
            }
            onClick={(event) =>
              handleNavElementClick(event, 'recurrencecomparison')
            }
          >
            Recurrence Comparison
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default function Main(props) {
  const dispatch = useDispatch();

  let params = useParams();

  const { projects } = useSelector((state) => state.Projects);
  const [project, setProject] = useState();

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
      dispatch(Stats.GetStats(project.game_id));
      dispatch(Events.GetEvents(project._id.$oid));
    }
  }, [project]);

  return (
    <>
      <Grid container style={{ height: '100vh' }}>
        <Grid item xs={1} style={{ height: '100vh' }}>
          <SideNav />
        </Grid>
        <Outlet />
      </Grid>
    </>
  );
}
