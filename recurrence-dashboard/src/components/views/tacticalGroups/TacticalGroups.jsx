import AddIcon from '@mui/icons-material/Add';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import CloseIcon from '@mui/icons-material/Close';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import SpeedIcon from '@mui/icons-material/Speed';
import { ListItem, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Slider from '@mui/material/Slider';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import CreateTGroupDialog from './createTGroupDialog';
import PitchLive from './pitch_all';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import StatsTable from '../../common/StatsTable';
import CreateEventDialog from './createEventsDialog';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import EventList from '../../common/EventList';
import AccessTime from '@mui/icons-material/AccessTime';
import EventTimeLine from '../../common/EventTimeLine';

const Loader = () => {
  return (
    <Grid item xs={12}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    </Grid>
  );
};

const TGroupList = (props) => {
  const style = {
    list_element: {
      overflowY: 'auto',
      height: '83vh',
    },
  };

  const [selectedGroup, setSelectedGroup] = useState('');

  const handleListItemClick = (event, item) => {
    // console.log('selected tg ', item._id.$oid);
    setSelectedGroup(item._id.$oid);
    props.handleGroupChange(item.player_list_1, item.player_list_2, item.title);
  };

  return (
    <Grid container item xs={12} style={style.list_element}>
      <Grid item xs={12} style={{ padding: '0 24px' }}>
        <List style={{ padding: 0 }}>
          {!props.loading ? (
            <>
              {props.tGroups.map((item) => (
                <>
                  <ListItemButton
                    onClick={(event) => handleListItemClick(event, item)}
                    key={item._id.$oid}
                    style={{ padding: '0' }}
                  >
                    <Grid container style={{ padding: '12px 0' }}>
                      <Grid item xs={6}>
                        <Typography
                          className="title-5"
                          style={{
                            color:
                              item._id.$oid === selectedGroup
                                ? '#1976d2'
                                : 'black',
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          component="div"
                          color="text.secondary"
                          style={{ fontSize: '13px' }}
                        >
                          {item.player_list_1.length +
                            item.player_list_2.length +
                            ' Players'}
                        </Typography>
                      </Grid>
                      <Grid container item xs={6} justifyContent="flex-end">
                        {item.player_list_1.map((player) => (
                          <Chip
                            className="target-chip-primary"
                            style={{
                              margin: '0 8px 8px 0',

                              fontSize: '14px',
                              minWidth: '32px',
                            }}
                            key={player}
                            size="small"
                            label={player}
                          />
                        ))}
                        {item.player_list_2.map((player) => (
                          <Chip
                            className="opponent-chip-primary"
                            style={{
                              margin: '0 8px 8px 0',

                              fontSize: '14px',
                              minWidth: '32px',
                            }}
                            size="small"
                            key={player}
                            label={player}
                          />
                        ))}
                      </Grid>
                    </Grid>
                  </ListItemButton>
                  <Divider />
                </>
              ))}
            </>
          ) : (
            <Loader />
          )}
        </List>
      </Grid>
    </Grid>
  );
};

const Player = (props) => {
  const handleSlide = (event, value) => {
    props.handleSlide(event, value);
  };

  const secondsConverter = (sec) => {
    let minutes = Math.floor(sec / 60); // get minutes
    let seconds = sec - minutes * 60;
    let m_result = minutes < 10 ? '0' + minutes : minutes;
    let s_result = seconds < 10 ? '0' + seconds : seconds;
    return String(m_result + ':' + s_result);
  };

  return (
    <Grid container item xs={12} spacing={0}>
      <Grid item xs={12} style={{ padding: '0px 32px' }}>
        <Slider
          size="small"
          defaultValue={1}
          aria-label="Small"
          valueLabelDisplay="auto"
          max={props.maxSeconds ? props.maxSeconds : 5400}
          onChange={handleSlide}
          value={props.sliderValue}
          // onChangeCommitted={handleComittedDrag}
          disabled={props.maxSeconds ? false : true}
        />
      </Grid>

      <Grid item style={{ textAlign: 'left', alignSelf: 'center' }}>
        <Typography
          style={{
            padding: '0px 16px 16px 16px',
            color: '#1976d2',
            fonSize: '16px',
          }}
        >
          <IconButton onClick={props.handlePlayPause} color="primary">
            {props.play ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
          </IconButton>
          <div
            style={{
              verticalAlign: 'middle',
              display: 'inline-flex',
              fontWeight: '500',
            }}
          >
            <span>{secondsConverter(props.gameSecond)}</span>
          </div>
        </Typography>
      </Grid>

      <Grid item style={{ padding: '0px 12px', alignSelf: 'baseline' }}>
        <Button
          size="small"
          onClick={props.handleSpeed}
          startIcon={<SpeedIcon />}
          style={{ padding: '8px' }}
        >
          {props.speed === 500 ? '2x' : props.speed === 1000 ? '1x' : '0.5x'}{' '}
        </Button>
      </Grid>
    </Grid>
  );
};

export default function TacticalGroups() {
  const dispatch = useDispatch();

  let params = useParams();

  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [openToGroupDialog, setOpenToGroupDialog] = useState(false);
  const [openEventDialog, setOpenEventDialog] = useState(false);

  const { projects } = useSelector((state) => state.Projects);
  const [project, setProject] = useState();

  const [gameSecond, setGameSecond] = useState(1);
  const [gameData, setGameData] = useState([]);
  const [tGroup, setTGroup] = useState('all');
  const [filtered_1, setFiltered1] = useState([]);
  const [filtered_2, setFiltered2] = useState([]);

  // Tracking-Video-Player settings
  const [play, setPlay] = useState(false);
  const [sliderValue, setSliderValue] = useState(1);
  const [speed, setSpeed] = useState(500);

  const [playerList1, setPlayerList1] = useState([]);
  const [playerList2, setPlayerList2] = useState([]);

  const { trackingData } = useSelector((state) => state.Tracking);
  const { tGroups, loading } = useSelector((state) => state.TGroups);
  const { stats } = useSelector((state) => state.Stats);

  useEffect(() => {
    let project = projects.find(
      (project) => project._id.$oid === params.project_id
    );
    setProject(project);
  }, []);

  useEffect(() => {
    if (sliderValue === trackingData.length) {
      setPlay(false);
    }
    setGameSecond(sliderValue);
  }, [sliderValue]);

  useEffect(() => {
    if (play === true) {
      setSliderValue(gameSecond);
    }

    if (gameSecond === trackingData.length) {
      setPlay(false);
      setGameSecond(1);
    }
  }, [gameSecond]);

  useEffect(() => {
    if (play && gameSecond + 1 !== trackingData.length) {
      setTimeout(() => setGameSecond(gameSecond + 1), speed);
    }
  }, [play, gameSecond]);

  useEffect(() => {
    if (trackingData.length) {
      setGameData(trackingData);
    }
  }, [trackingData]);

  useEffect(() => {
    if (tGroup !== 'all') {
      let filterTrackingData = trackingData.map((item) => ({
        ...item,
        player_list_1: item.player_list_1.filter((player) =>
          filtered_1.includes(player.mapped_id)
        ),
        player_list_2: item.player_list_2.filter((player) =>
          filtered_2.includes(player.mapped_id)
        ),
      }));

      setGameData(filterTrackingData);
    } else {
      setGameData(trackingData);
    }
  }, [tGroup]);

  // Tracking-Video-Player event-handlers
  const handlePlayPause = () => {
    if (play) {
      setPlay(false);
    } else {
      setPlay(true);
    }
  };

  const handleSpeed = () => {
    if (speed === 500) {
      setSpeed(2000);
    } else if (speed === 1000) {
      setSpeed(500);
    } else if (speed === 2000) {
      setSpeed(1000);
    }
  };

  const handleSlide = (event, value) => {
    setPlay(false);
    setSliderValue(value);
  };

  const handleGroupChange = (filtered_1, filtered_2, tGroupName) => {
    setFiltered1(filtered_1);
    setFiltered2(filtered_2);
    setTGroup(tGroupName);
  };

  const handleDotClick = (event) => {
    // console.log(event.payload);
    let player = event.payload;
    if (player.target_group_id === 1) {
      // if in playerList1, remove from playerList
      if (playerList1.includes(player.mapped_id)) {
        setPlayerList1(playerList1.filter((item) => item !== player.mapped_id));
      } else {
        setPlayerList1([...playerList1, player.mapped_id]);
      }
    } else {
      if (playerList2.includes(player.mapped_id)) {
        setPlayerList2(playerList2.filter((item) => item !== player.mapped_id));
      } else {
        setPlayerList2([...playerList2, player.mapped_id]);
      }
    }
  };

  const handleCloseNewDialog = () => {
    setOpenNewDialog(false);
  };

  const handleCloseToGroupDialog = () => {
    setOpenToGroupDialog(false);
  };

  const handleEventSecond = (sec) => {
    setPlay(false);
    setGameSecond(sec);
  };

  return (
    <React.Fragment>
      <Grid
        container
        item
        xs={3}
        style={{
          height: '100vh',
          background: 'white',
          border: 'solid 1px #eee',
        }}
        alignContent="start"
      >
        <Grid container item xs={12} style={{ padding: '24px 24px 0 24px' }}>
          <Grid item xs={8}>
            <Typography className="subtitle-2">Project Title</Typography>
            <Typography className="title-3" gutterBottom>
              Tactical Groups
            </Typography>
          </Grid>
          <Grid
            item
            xs={4}
            alignSelf="end"
            justifySelf={'flex-end'}
            textAlign={'right'}
            style={{ marginBottom: '16px' }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenNewDialog(true)}
              className="add-button-small"
            >
              <span>New</span>
            </Button>
            {/* <IconButton
              color="primary"
              onClick={() => setOpenNewDialog(true)}
              size="large"
              
              // style={{ paddingBottom: '24px' }}
            >
              <AddIcon />
              New
            </IconButton> */}
            {openNewDialog ? (
              <CreateTGroupDialog
                open={true}
                handleClose={handleCloseNewDialog}
                game={project.game_id}
                playerList1={[]}
                playerList2={[]}
                allPlayers1={gameData[gameSecond].player_list_1.map(
                  (item) => item.mapped_id
                )}
                allPlayers2={gameData[gameSecond].player_list_2.map(
                  (item) => item.mapped_id
                )}
              />
            ) : (
              <></>
            )}
          </Grid>
        </Grid>

        {/* <Grid item xs={12}>
          <Divider />
        </Grid> */}
        <Grid container item xs={12}>
          <Grid item xs={12}>
            <TGroupList
              handleGroupChange={handleGroupChange}
              tGroups={tGroups}
              loading={loading}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid
        container
        item
        xs={5}
        alignItems="baseline"
        style={{
          alignContent: 'start',
          padding: '24px',
          alignItems: 'flex-start',
        }}
      >
        <Grid container item xs={12} style={{ marginBottom: '24px' }}>
          <Grid item xs={8}>
            <Typography className="subtitle-2">Game 02</Typography>
            <Typography className="title-4" style={{ fontWeight: 'bold' }}>
              Match Player
            </Typography>
          </Grid>

          <Grid
            item
            xs={4}
            style={{ textAlign: 'right', alignSelf: 'flex-end' }}
          >
            <Button
              size="small"
              startIcon={<RestartAltIcon />}
              onClick={() => setTGroup('all')}
              disabled={tGroup === 'all'}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
        <>
          <Grid
            container
            style={{
              background: 'white',
              borderRadius: '8px',
              border: 'solid 1px #eee',
            }}
          >
            <PitchLive
              gameData={gameData[gameSecond]}
              handleDotClick={handleDotClick}
              gameSecond={gameSecond}
              loading={project && gameData.length ? false : true}
            />
            {/* {project && gameData.length ? (
              <> */}
            <Player
              play={play}
              speed={speed}
              handlePlayPause={handlePlayPause}
              handleSpeed={handleSpeed}
              maxSeconds={trackingData.length - 1}
              handleSlide={handleSlide}
              sliderValue={sliderValue}
              gameSecond={gameSecond}
            />
            {/* </>
            ) : (
              <Loader />
            )} */}
          </Grid>
          <Grid container item xs={12} style={{ paddingTop: '18px' }}>
            <Grid item xs={6} style={{ marginBottom: '6px' }}>
              <Typography className="title-5">Target Team</Typography>
            </Grid>
            <Grid item xs={6} style={{ marginBottom: '6px' }}>
              <Typography className="title-5">Opponent Team</Typography>
            </Grid>
            <Grid item xs={6} style={{ minHeight: '25px' }}>
              {playerList1.map((player) => (
                <Chip
                  style={{
                    marginRight: '8px',
                    background: '#55a87b',
                    color: 'white',
                    minWidth: '32px',
                  }}
                  size="small"
                  label={player}
                  onClick={() =>
                    setPlayerList1(playerList1.filter((p) => p !== player))
                  }
                />
              ))}
              {playerList1.length ? (
                <IconButton
                  aria-label="delete"
                  size="small"
                  disabled={playerList1.length === 0}
                  onClick={() => {
                    setPlayerList1([]);
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              ) : (
                <></>
              )}
            </Grid>
            <Grid item xs={6} style={{ minHeight: '25px' }}>
              {playerList2.map((player) => (
                <Chip
                  style={{
                    marginRight: '8px',
                    background: '#e01a4f',
                    color: 'white',
                    minWidth: '32px',
                  }}
                  size="small"
                  label={player}
                  onClick={() =>
                    setPlayerList2(playerList2.filter((p) => p !== player))
                  }
                />
              ))}
              {playerList2.length ? (
                <IconButton
                  aria-label="delete"
                  size="small"
                  disabled={playerList2.length === 0}
                  onClick={() => {
                    setPlayerList2([]);
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              ) : (
                <></>
              )}
            </Grid>
            <Grid item xs={12} style={{ margin: '12px 0px' }}>
              <Divider />
            </Grid>
            <Grid item xs={6} style={{ textAlign: 'left', color: 'darkgrey' }}>
              {playerList1.length === 0 && playerList2.length === 0
                ? 'Select some players by clicking on them'
                : ''}
            </Grid>
            <Grid item xs={6} style={{ textAlign: 'right' }}>
              <Button
                variant="contained"
                startIcon={<ArrowRightAltIcon />}
                size="small"
                className="add-button-small"
                style={{
                  opacity:
                    playerList1.length === 0 && playerList2.length === 0
                      ? '20%'
                      : '100%',
                }}
                disabled={playerList1.length === 0 && playerList2.length === 0}
                onClick={() => setOpenToGroupDialog(true)}
              >
                To New Group
              </Button>
              {/* <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenNewDialog(true)}
              className="add-button-small"
            >
              <span>New</span>
            </Button> */}
              {openToGroupDialog ? (
                <CreateTGroupDialog
                  open={true}
                  handleClose={handleCloseToGroupDialog}
                  game={project.game_id}
                  playerList1={playerList1}
                  playerList2={playerList2}
                  allPlayers1={gameData[gameSecond].player_list_1.map(
                    (item) => item.mapped_id
                  )}
                  allPlayers2={gameData[gameSecond].player_list_2.map(
                    (item) => item.mapped_id
                  )}
                />
              ) : (
                <></>
              )}
            </Grid>
          </Grid>
        </>
      </Grid>
      <Grid item xs={3} container style={{ padding: '24px 24px 24px 0px' }}>
        <Grid item xs={12} style={{ marginBottom: '18px' }}>
          <Typography className="subtitle-2">Game 02</Typography>
          <Typography className="title-4" style={{ fontWeight: 'bold' }}>
            Match Overview
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          // md={2}
        >
          <div
            style={{
              textAlign: 'left',
              alignSelf: 'flex-end',

              background: 'white',
              borderRadius: '6px',
            }}
          >
            <StatsTable stats={stats} />
          </div>
        </Grid>

        <Grid
          container
          item
          xs={12}
          style={{
            height: '61vh',
            alignContent: 'flex-start',
            overflowY: 'auto',
            paddingTop: '16px',
          }}
        >
          <Grid
            item
            xs={4}
            // md={2}
            style={{
              textAlign: 'left',
              alignSelf: 'flex-end',
              paddingBottom: '24px',
            }}
          >
            <Typography
              variant="h6"
              // gutterBottom
              component="div"
              className="title-5"
              style={{ paddingBottom: '4px' }}
            >
              Match Events
            </Typography>
          </Grid>
          <Grid
            item
            xs={8}
            // md={2}
            style={{
              textAlign: 'left',
              alignSelf: 'center',
              paddingBottom: '24px',
            }}
          >
            <IconButton
              color="primary"
              onClick={() => setOpenEventDialog(true)}
              // style={{ paddingBottom: '24px' }}
            >
              <AddIcon />
            </IconButton>
            {openEventDialog ? (
              <CreateEventDialog
                open={true}
                handleClose={() => setOpenEventDialog(false)}
                game={project.game_id}
                gameSecond={gameSecond}
              />
            ) : (
              <></>
            )}
          </Grid>

          {/* <<TGroupList
              handleGroupChange={handleGroupChange}
              tGroups={tGroups}
              loading={loading}
            />> */}
          {/* <EventList handleEventSecond={handleEventSecond} /> */}
          <EventTimeLine handleEventSecond={handleEventSecond} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
