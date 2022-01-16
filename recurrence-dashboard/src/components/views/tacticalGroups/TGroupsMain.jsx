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
import PitchLive from './pitch_all';
import * as Tracking from '../../../actions/TrackingActions';
import * as TGroups from '../../../actions/TGroupActions';
import Slider from '@mui/material/Slider';
import CreateTGroupDialog from './createTGroupDialog';
import Divider from '@mui/material/Divider';
import SpeedIcon from '@mui/icons-material/Speed';

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

const TGroupList = (props) => {
  const style = {
    list_element: {
      background: 'white',
      overflowY: 'auto',
      height: '76.4vh',
    },
  };

  // const sample = [
  //   {
  //     game_id: 1,
  //     title: 'One',
  //     player_list_1: [4, 5],
  //     player_list_2: [3, 5],
  //   },
  // ];

  const handleListItemClick = (event, item) => {
    props.handleGroupChange(item.player_list_1, item.player_list_2, item.title);
  };

  return (
    <Grid container item xs={5} style={style.list_element}>
      <Grid item xs={12}>
        <List>
          {!props.loading ? (
            <>
              {props.tGroups.map((item) => (
                <>
                  <ListItemButton
                    // selected={selectedIndex === 0}
                    onClick={(event) => handleListItemClick(event, item)}
                  >
                    <Grid container>
                      <Grid item xs={4}>
                        <ListItemText
                          primary={item.title}
                          secondary={
                            item.player_list_1.length +
                            item.player_list_2.length +
                            ' Players'
                          }
                        />
                      </Grid>
                      <Grid container item xs={8} justifyContent="flex-end">
                        {item.player_list_1.map((player) => (
                          <Chip
                            style={{
                              margin: '0 5px 5px 0',
                              background: '#1976d2',
                              color: 'white',
                            }}
                            size="small"
                            label={player}
                          />
                        ))}
                        {item.player_list_2.map((player) => (
                          <Chip
                            style={{ marginLeft: '1%', backround: '#ef476f' }}
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
    <Grid container item xs={12} spacing={0} style={style.playerContainer}>
      {/* <Grid item xs={12} style={{ padding: '0px 0px 12px 0px' }}>
        <Divider />
      </Grid> */}

      <Grid item xs={2} style={{ padding: '0px 0px 24px 45px' }}>
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

export default function TGroupsMain() {
  const dispatch = useDispatch();

  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [openToGroupDialog, setOpenToGroupDialog] = useState(false);

  const [game, setGame] = useState(1);
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

  useEffect(() => {
    let payload = { game_id: game, project_id: '1' };
    dispatch(Tracking.GetTrackingData(payload));
    dispatch(TGroups.GetTGroups(payload));
  }, []);

  useEffect(() => {
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
    if (sliderValue === trackingData.length) {
      setPlay(false);
    }
  }, [sliderValue]);

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
              <Grid item xs={12} md={3}>
                <Typography variant="h4" gutterBottom component="div">
                  Tactical Groups
                </Typography>
                {loading ? 'Loading' : tGroups.length + ' Tactical Groups'}
              </Grid>
              <Grid
                item
                xs={12}
                md={2}
                style={{ textAlign: 'right', alignSelf: 'flex-end' }}
              >
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenNewDialog(true)}
                >
                  New
                </Button>
                {openNewDialog ? (
                  <CreateTGroupDialog
                    open={true}
                    handleClose={handleCloseNewDialog}
                    game={game}
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
              {/* <Grid item xs={5} style={{ paddingLeft: '24px' }}>
                <Typography variant="h6" gutterBottom component="div">
                  {tGroup.toUpperCase()}
                </Typography>
              </Grid> */}
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
          </Box>
          <Grid container>
            <TGroupList
              handleGroupChange={handleGroupChange}
              tGroups={tGroups}
              loading={loading}
            />

            <Grid
              container
              spacing={0}
              item
              xs={7}
              alignItems="baseline"
              style={{ padding: '0px 24px', alignContent: 'start' }}
            >
              {/* <Grid item xs={12}>
                <Button onClick={handleSecondChange}>{gameSecond}</Button>
              </Grid> */}

              {gameData.length ? (
                <>
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
                            setPlayerList1(
                              playerList1.filter((p) => p !== player)
                            )
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
                          style={{ marginRight: '1%', backround: '#ef476f' }}
                          size="small"
                          label={player}
                          onClick={() =>
                            setPlayerList2(
                              playerList2.filter((p) => p !== player)
                            )
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
                          game={game}
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
          </Grid>
        </Box>
      </Container>
    </React.Fragment>
  );
}
