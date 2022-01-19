import AddIcon from '@mui/icons-material/Add';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import CloseIcon from '@mui/icons-material/Close';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import SpeedIcon from '@mui/icons-material/Speed';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Slider from '@mui/material/Slider';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as TGroups from '../../../actions/TGroupActions';
import * as Tracking from '../../../actions/TrackingActions';
import CreateTGroupDialog from './createTGroupDialog';
import PitchLive from './pitch_all';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import StatsTable from '../../common/StatsTable';
import CreateEventDialog from './createEventsDialog';

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
      // background: 'white',
      overflowY: 'auto',
      // height: '76.4vh',
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
      <Grid item xs={12}>
        <Divider />
        <List style={{ padding: 0 }}>
          {!props.loading ? (
            <>
              {props.tGroups.map((item) => (
                <>
                  <ListItemButton
                    // selected={selectedIndex === 0}
                    onClick={(event) => handleListItemClick(event, item)}
                    style={{ padding: '12px 12px 12px 6px' }}
                  >
                    <Grid container>
                      <Grid item xs={6}>
                        {/* <ListItemText
                          style={{ fontSize: '14px' }}
                          primary={item.title}
                          secondary={
                            item.player_list_1.length +
                            item.player_list_2.length +
                            ' Players'
                          }
                        /> */}
                        <Typography
                          variant="body2"
                          component="div"
                          // color="text.secondary"
                          style={{
                            fontSize: '14px',
                            fontWeight: '500',
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
                            style={{
                              margin: '0 5px 5px 0',
                              background: '#1976d2',
                              color: 'white',
                              fontSize: '10px',
                            }}
                            size="small"
                            label={player}
                          />
                        ))}
                        {item.player_list_2.map((player) => (
                          <Chip
                            style={{
                              margin: '0 5px 5px 0',
                              background: '#4b6584',
                              fontSize: '10px',
                              color: 'white',
                            }}
                            size="small"
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
  const style = {
    playerContainer: { background: 'white' },
  };

  const handleSlide = (event, value) => {
    props.handleSlide(event, value);
  };

  return (
    <Grid container item xs={12} spacing={0}>
      <Grid item xs={12} style={{ padding: '0px 0px 12px 0px' }}>
        <Divider />
      </Grid>

      <Grid item xs={2} style={{ padding: '0px 0px 20px 30px' }}>
        <Button
          variant="contained"
          size="small"
          onClick={props.handlePlayPause}
          startIcon={
            props.play ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />
          }
        >
          {props.play ? 'Pause' : 'Play'}
        </Button>
      </Grid>
      <Grid item xs={8} style={{ padding: '0px 24px' }}>
        <Slider
          size="small"
          defaultValue={70}
          aria-label="Small"
          valueLabelDisplay="auto"
          max={props.maxSeconds}
          onChange={handleSlide}
          value={props.sliderValue}
          // onChangeCommitted={handleComittedDrag}
        />
      </Grid>

      <Grid item xs={2} style={{ padding: '0px 12px' }}>
        <Button
          variant="outlined"
          size="small"
          onClick={props.handleSpeed}
          startIcon={<SpeedIcon />}
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

  const handleSecondChange = () => {
    let newSecond = gameSecond + 1;
    setGameSecond(newSecond);
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

  return (
    <React.Fragment>
      {/* <CssBaseline /> */}
      {/* <Navbar />
      <Container maxWidth="xl">
        <Box sx={{ bgcolor: '#f8f8f8', height: '93vh' }}> */}
      {/* <Box sx={{ width: '100%', borderRadius: '5px' }}>
        <Grid
          container
          spacing={0}
          alignItems="center"
          style={{ padding: '24px' }}
        >
          <Grid
            item
            xs={7}
            style={{ textAlign: 'right', alignSelf: 'flex-end' }}
          >
            <Button
              size="small"
              variant="contained"
              onClick={() => setTGroup('all')}
              disabled={tGroup === 'all'}
            >
              Show All
            </Button>
          </Grid>
        </Grid>
      </Box> */}
      {/* <Backdrop
          sx={{
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={true}
          // onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop> */}
      <Grid
        container
        style={{ padding: '12px 0px 0px 0px ', alignItems: 'flex-start' }}
      >
        <Grid item xs={3} container style={{ padding: '0px 12px 0px 0px' }}>
          <Grid
            item
            xs={6}
            // md={2}
            style={{
              textAlign: 'left',
              alignSelf: 'flex-end',
              paddingBottom: '12px',
            }}
          >
            <Typography
              variant="h6"
              // gutterBottom
              component="div"
              color="text.secondary"
              // fontWeight={500}
            >
              Tactical Group
              {/* Datum des Spiels */}
            </Typography>
            <Typography
              variant="body2"
              // gutterBottom
              component="div"
              color="text.secondary"
              // fontWeight={500}
            >
              {tGroups.length == 1
                ? '1 Tactical Group'
                : tGroups.length + ' Tactical Groups'}
            </Typography>
          </Grid>
          <Grid
            item
            xs={6}
            // md={2}
            style={{
              textAlign: 'right',
              alignSelf: 'center',
              paddingBottom: '12px',
            }}
          >
            {/* <IconButton color="primary">
              <AddIcon onClick={() => setOpenNewDialog(true)} />
            </IconButton> */}
            <Button
              // variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setOpenNewDialog(true)}
              size="small"
              style={{ minWidth: '100px' }}
            >
              New
            </Button>
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

          <TGroupList
            handleGroupChange={handleGroupChange}
            tGroups={tGroups}
            loading={loading}
          />
        </Grid>

        <Grid
          container
          spacing={0}
          item
          xs={6}
          alignItems="baseline"
          style={{
            alignContent: 'start',
            padding: '0px 12px',
            alignItems: 'flex-start',
          }}
        >
          {project && gameData.length ? (
            <>
              <Grid
                container
                style={{
                  background: 'white',
                  borderRadius: '6px',
                }}
              >
                <Grid
                  item
                  xs={12}
                  container
                  style={{ padding: '12px 30px 12px 30px' }}
                >
                  <Grid item xs={4}>
                    <Typography
                      variant="h6"
                      // gutterBottom
                      component="div"
                      color="text.secondary"
                      // fontWeight={500}
                    >
                      Tactical Play
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    style={{ textAlign: 'center', alignSelf: 'center' }}
                  >
                    <Typography
                      variant="body2"
                      compnent="div"
                      color="text.secondary"
                    >
                      <AccessTimeIcon
                        style={{
                          color: 'darkgray',
                          fontSize: '18px',
                          verticalAlign: 'middle',
                          marginRight: '12px',
                        }}
                      />
                      {gameSecond}
                      {' s'}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} style={{ textAlign: 'right' }}>
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
                <Grid item xs={12} style={{ padding: '7px 0px' }}>
                  <Divider />
                </Grid>

                <PitchLive
                  gameData={gameData[gameSecond]}
                  handleDotClick={handleDotClick}
                />
                <Player
                  play={play}
                  speed={speed}
                  handlePlayPause={handlePlayPause}
                  handleSpeed={handleSpeed}
                  maxSeconds={trackingData.length - 1}
                  handleSlide={handleSlide}
                  sliderValue={sliderValue}
                />
              </Grid>
              <Grid container item xs={12} style={{ paddingTop: '18px' }}>
                <Grid item xs={6} style={{ marginBottom: '6px' }}>
                  Target Team
                </Grid>
                <Grid item xs={6} style={{ marginBottom: '6px' }}>
                  Opponent Team
                </Grid>
                <Grid item xs={6} style={{ minHeight: '25px' }}>
                  {playerList1.map((player) => (
                    <Chip
                      style={{
                        marginRight: '1%',
                        background: '#1976d2',
                        color: 'white',
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
                <Grid item xs={6} style={{ minHeight: '30px' }}>
                  {playerList2.map((player) => (
                    <Chip
                      style={{
                        marginRight: '1%',
                        background: '#4B6584',
                        color: 'white',
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
                <Grid
                  item
                  xs={6}
                  style={{ textAlign: 'left', color: 'darkgrey' }}
                >
                  {playerList1.length === 0 && playerList2.length === 0
                    ? 'Select some players by clicking on them'
                    : ''}
                </Grid>
                <Grid item xs={6} style={{ textAlign: 'right' }}>
                  <Button
                    variant="contained"
                    startIcon={<ArrowRightAltIcon />}
                    size="small"
                    disabled={
                      playerList1.length === 0 && playerList2.length === 0
                    }
                    onClick={() => setOpenToGroupDialog(true)}
                  >
                    To New Group
                  </Button>
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
          ) : (
            <Loader />
          )}
        </Grid>
        <Grid item xs={3} container style={{ padding: '0px 12px' }}>
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
          {/* NEWWWWW */}
          <Grid container item xs={12} style={{ padding: '24px 6px' }}>
            <Grid
              item
              xs={6}
              // md={2}
              style={{
                textAlign: 'left',
                alignSelf: 'flex-end',
                paddingBottom: '12px',
              }}
            >
              <Typography
                variant="h6"
                // gutterBottom
                component="div"
                color="text.secondary"
                // fontWeight={500}
              >
                Match Events
              </Typography>
            </Grid>
            <Grid
              item
              xs={6}
              // md={2}
              style={{
                textAlign: 'right',
                alignSelf: 'center',
                paddingBottom: '12px',
              }}
            >
              <IconButton color="primary">
                <AddIcon onClick={() => setOpenEventDialog(true)} />
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

            <TGroupList
              handleGroupChange={handleGroupChange}
              tGroups={tGroups}
              loading={loading}
            />
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
