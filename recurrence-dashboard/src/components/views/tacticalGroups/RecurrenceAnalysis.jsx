import AddIcon from '@mui/icons-material/Add';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import React, { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import RP from './RP';
import CreateRPDialog from './createRPDialog';
import { useDispatch, useSelector } from 'react-redux';
import * as RPS from '../../../actions/RPActions';
import { useParams } from 'react-router-dom';
import { Chip, Typography } from '@mui/material';
import PitchLive from './pitch_all';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import SpeedIcon from '@mui/icons-material/Speed';
import IconButton from '@mui/material/IconButton';
import Slider from '@mui/material/Slider';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import _ from 'lodash';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FormHelperText from '@mui/material/FormHelperText';
import CloseIcon from '@mui/icons-material/Close';
import StatsTable from '../../common/StatsTable';
import CreateEventDialog from './createEventsDialog';
import EventList from '../../common/EventList';
import RQATable from '../../common/RQATable';
import UploadIcon from '@mui/icons-material/Upload';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

const Player = (props) => {
  const style = {
    playerContainer: { background: 'white' },
  };

  const [sliderValue, setSliderValue] = useState(props.sliderValue);
  const handleSlideCommit = (event, value) => {
    props.handleSlide(event, sliderValue);
  };

  const handleSlide = (event, value) => {
    setSliderValue(value);
  };

  useEffect(() => {
    setSliderValue(props.sliderValue);
  }, [props.sliderValue]);

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
          onChangeCommitted={handleSlideCommit}
          onChange={handleSlide}
          value={sliderValue}
          step={20}
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
          {props.speed === 400 ? '2x' : props.speed === 800 ? '1x' : '0.5x'}{' '}
        </Button>
      </Grid>
    </Grid>
  );
};

const RpCard = (props) => {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const { tGroups } = useSelector((state) => state.TGroups);

  // const [rp, setRpSelection] =  useState()

  const handleClick = () => {
    setOpen(!open);
  };

  const handleSelection = (event) => {
    // console.log('selected', props.rp);
    dispatch(RPS.GetRP(props.rp));
    // props.handleLoadSelection(rp);
  };

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemText
          primary={props.rp.rp_title}
          // secondary={props.rp.rp_type}
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Divider />
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Grid
          container
          item
          xs={12}
          style={{ padding: '12px 24px', background: '#f8f8f8' }}
          spacing={1}
        >
          <Grid item xs={12}>
            <div style={{ fontSize: 12 }}>Tactical Group</div>
            <div style={{ fontSize: 14 }}>
              {
                tGroups.find(
                  (group) =>
                    group._id.$oid === props.rp.target_tactical_group_id
                ).title
              }
            </div>
          </Grid>
          {props.rp.cross_tactical_group_id ? (
            <Grid item xs={12}>
              <div style={{ fontSize: 12 }}>Cross Tactical Group</div>
              <div style={{ fontSize: 14 }}>
                {
                  tGroups.find(
                    (group) =>
                      group._id.$oid === props.rp.cross_tactical_group_id
                  ).title
                }
              </div>
            </Grid>
          ) : (
            <></>
          )}
          <Grid item xs={6}>
            <div style={{ fontSize: 12 }}>Threshold</div>
            <div style={{ fontSize: 14 }}>{props.rp.threshold}m</div>
          </Grid>
          <Grid item xs={6}>
            <div style={{ fontSize: 12 }}>Compression</div>
            <div style={{ fontSize: 14 }}>{props.rp.downsample}hz</div>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              size="small"
              // fullwidth
              onClick={handleSelection}
            >
              Load
            </Button>
          </Grid>
        </Grid>
        <Divider />
      </Collapse>
    </>
  );
};

export default function RecurrenceAnalysis(props) {
  const dispatch = useDispatch();
  const params = useParams();

  const { tGroups } = useSelector((state) => state.TGroups);
  const { stats } = useSelector((state) => state.Stats);
  const { rpsLoading, rps, selectedRPLoading, selectedRP } = useSelector(
    (state) => state.RecurrenceAnalysis
  );
  const { trackingData } = useSelector((state) => state.Tracking);

  const [rpSelection, setRpSelection] = React.useState(
    selectedRP.data ? selectedRP._id.$oid : rps.length ? rps[0]._id.$oid : ''
  );
  const [openDialog, setOpenDialog] = React.useState(false);
  const [xyRP, setXyRP] = useState([1, 1]);
  const [play, setPlay] = useState(false);
  const [sliderValue, setSliderValue] = useState([1, 1]);
  const [speed, setSpeed] = useState(400);
  const [filterPlayers, setFilterPlayers] = useState('all');
  const [gameDataX, setGameDataX] = useState();
  const [gameDataY, setGameDataY] = useState();

  useEffect(() => {
    if (trackingData.length) {
      setGameDataX(trackingData);
      setGameDataY(trackingData);
    }
  }, [trackingData]);

  const handleFilterPlayers = (event) => {
    if (event.target.value === 'all') {
      setGameDataX(trackingData);
      setGameDataY(trackingData);
    } else {
      // game data x is target group
      // game data y is target group, if no cross recurrence matrix is selected
      let filterTrackingDataX = trackingData.map((item) => ({
        ...item,
        player_list_1: item.player_list_1.filter((player) =>
          selectedRP.target_group_1.includes(player.mapped_id)
        ),
        player_list_2: item.player_list_2.filter((player) =>
          selectedRP.target_group_2.includes(player.mapped_id)
        ),
      }));
      setGameDataX(filterTrackingDataX);

      if (selectedRP.rp_type === 'cross_threshold') {
        let filterTrackingDataY = trackingData.map((item) => ({
          ...item,
          player_list_1: item.player_list_1.filter((player) =>
            selectedRP.cross_group_1.includes(player.mapped_id)
          ),
          player_list_2: item.player_list_2.filter((player) =>
            selectedRP.cross_group_2.includes(player.mapped_id)
          ),
        }));

        setGameDataY(filterTrackingDataY);
      } else {
        setGameDataY(filterTrackingDataX);
      }
    }
  };

  useEffect(() => {
    dispatch(RPS.GetRPSInfo({ project_id: props.project._id.$oid }));
  }, [selectedRP]);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleSaveRP = () => {
    setOpenDialog(false);
  };

  const handleRpSelection = (event) => {
    setRpSelection(event.target.value);
  };

  const handleDotClick = (event, value) => {
    console.log('Selected Player', event);
  };

  const handleLoadSelection = (event, rp) => {
    // dispatch(RPS.GetRP({ _id: { $oid: rpSelection } }));
  };

  // Click on RP --> Show respective play

  const handleXYSelection = (event) => {
    let x = event.points[0].x * selectedRP.downsample;
    let y = event.points[0].y * selectedRP.downsample;
    setPlay(false);
    setXyRP([x, y]);
    setSliderValue([x, y]);
  };

  // Player settings

  const handlePlayPause = () => {
    if (play) {
      setPlay(false);
    } else {
      setPlay(true);
    }
  };

  const handleSlide = (event, value) => {
    setPlay(false);
    setSliderValue(value);
  };

  const handleSpeed = () => {
    if (speed === 400) {
      setSpeed(1600);
    } else if (speed === 800) {
      setSpeed(400);
    } else if (speed === 1600) {
      setSpeed(800);
    }
  };

  useEffect(() => {
    if (
      sliderValue[0] === trackingData.length &&
      sliderValue[1] === trackingData.length
    ) {
      setPlay(false);
    }

    setXyRP(sliderValue);
  }, [sliderValue]);

  useEffect(() => {
    if (play === true) {
      setSliderValue(xyRP);
    }

    if (xyRP[0] === trackingData.length || xyRP[1] === trackingData.length) {
      setPlay(false);
    }
  }, [xyRP]);

  useEffect(() => {
    if (
      play &&
      xyRP[0] + 1 <= trackingData.length &&
      xyRP[1] + 1 <= trackingData.length
    ) {
      setTimeout(() => setXyRP([xyRP[0] + 1, xyRP[1] + 1]), speed);
    } else if (
      play &&
      xyRP[0] + 1 <= trackingData.length &&
      !xyRP[1] + 1 <= trackingData.length
    ) {
      setTimeout(() => setXyRP([xyRP[0] + 1, xyRP[1]]), speed);
    } else if (
      play &&
      !xyRP[0] + 1 <= trackingData.length &&
      xyRP[1] + 1 <= trackingData.length
    ) {
      setTimeout(() => setXyRP([xyRP[0], xyRP[1] + 1]), speed);
    } else {
      setPlay(false);
    }
  }, [play, xyRP]);

  const defaultRP = {
    rp_title: '',
    _id: {
      $oid: '',
    },
  };

  const [prepareRP, setPrepareRP] = useState(defaultRP);
  const [changeRP, setChangeRP] = useState(false);
  const [openEventDialog, setOpenEventDialog] = useState(false);

  const handlePrepareRP = (event, value) => {
    let selectedRP = rps.find((item) => item._id.$oid === event.target.value);
    setPrepareRP(selectedRP);
  };

  const loadPreparedRP = (event, value) => {
    dispatch(RPS.GetRP(prepareRP));
  };

  const handleEventSecond = (sec) => {
    setPlay(false);
    setXyRP([sec, sec]);
  };

  const secondsConverter = (sec) => {
    let minutes = Math.floor(sec / 60); // get minutes
    let seconds = sec - minutes * 60;
    let m_result = minutes < 10 ? '0' + minutes : minutes;
    let s_result = seconds < 10 ? '0' + seconds : seconds;
    return String(m_result + ':' + s_result);
  };

  return (
    <React.Fragment>
      <Grid container style={{ background: '#f8f8f8' }} alignItems={'start'}>
        <Grid container item xs={4} style={{ padding: '0 12px 0 0' }}>
          <Grid container item xs={12} style={{ minHeight: '70px' }}>
            {!changeRP ? (
              <>
                <Grid item xs={9} style={{ alignSelf: 'center' }}>
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      // gutterBottom
                      component="div"
                      color="text.secondary"
                      // fontWeight={500}
                    >
                      {selectedRP.rp_title
                        ? selectedRP.rp_title
                        : 'Choose RP to display'}
                    </Typography>
                    <Typography
                      variant="body2"
                      // gutterBottom
                      component="div"
                      color="text.secondary"
                      // fontWeight={500}
                    >
                      <Button
                        size="small"
                        color="inherit"
                        onClick={() => setChangeRP(!changeRP)}
                        endIcon={<CompareArrowsIcon />}
                        disabled={rps.length ? false : true}
                        style={{ padding: '0 6px 6px 0' }}
                      >
                        Change
                      </Button>
                    </Typography>
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={3}
                  // md={2}
                  style={{
                    textAlign: 'right',
                    alignSelf: 'center',
                    paddingBottom: '12px',
                  }}
                >
                  <Button
                    // variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleClickOpen}
                    size="small"
                    style={{ minWidth: '100px' }}
                  >
                    New
                  </Button>
                  {openDialog ? (
                    <CreateRPDialog
                      project={props.project}
                      handleClose={handleClose}
                      handleSave={handleSaveRP}
                    />
                  ) : (
                    <></>
                  )}
                </Grid>
              </>
            ) : (
              <>
                <Grid
                  item
                  xs={1}
                  style={{
                    alignSelf: 'center',
                    textAlign: 'left',
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => setChangeRP(!changeRP)}
                  >
                    <CloseIcon />
                  </IconButton>
                </Grid>
                <Grid
                  item
                  xs={8}
                  style={{ alignSelf: 'center', paddingLeft: '12px' }}
                >
                  <FormControl style={{ width: '100%' }}>
                    <InputLabel id="demo-simple-select-helper-label">
                      RP
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      value={prepareRP._id.$oid}
                      label="RP"
                      onChange={handlePrepareRP}
                      size="small"
                    >
                      <MenuItem value="" disabled>
                        <em>None</em>
                      </MenuItem>
                      {rps.length ? (
                        rps.map((item) => (
                          <MenuItem key={item._id.$oid} value={item._id.$oid}>
                            {item.rp_title}
                          </MenuItem>
                        ))
                      ) : (
                        <></>
                      )}
                    </Select>
                    {!prepareRP && (
                      <FormHelperText>
                        Select and load a RP to display
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid
                  item
                  xs={3}
                  style={{
                    alignSelf: 'center',
                    textAlign: 'left',
                    paddingLeft: '12px',
                  }}
                >
                  <Button
                    size="medium"
                    startIcon={<PublishedWithChangesIcon />}
                    disabled={!prepareRP.rp_title}
                    onClick={loadPreparedRP}
                  >
                    Load
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
          {/* until here -> ############## NEW ####################### */}
          <Grid container item xs={12}>
            <Grid item xs={12}>
              <div
                style={{
                  background: 'white',
                  textAlign: 'left',
                  padding: '12px 0 0 12px',
                }}
              >
                <Typography variant="subtitle1" component="div">
                  Recurrence Plot
                </Typography>
              </div>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            style={{
              textAlign: 'center',
              background: 'white',
              padding: '12px 12px 0 12px',
              minHeight: '460px',
              // marginBottom: '24px',
            }}
          >
            <RP handleXYSelection={handleXYSelection} />
          </Grid>

          {!_.isEmpty(selectedRP.rqa) ? (
            <>
              <Grid
                container
                item={12}
                style={{
                  background: 'white',
                  textAlign: 'left',
                  // marginBottom: '24px',
                  padding: '0 12px',
                }}
              >
                <Grid item xs={6}>
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    {'Threshold: ' + selectedRP.threshold + 'm'}{' '}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    {' Compression Rate: ' + selectedRP.downsample + 'hz'}{' '}
                  </Typography>
                </Grid>
              </Grid>

              <Grid
                container
                item={12}
                style={{
                  background: 'white',
                  textAlign: 'left',
                  // marginBottom: '24px',
                  padding: '0 12px 12px 12px',
                }}
              >
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary">
                    Tactical Group
                  </Typography>
                  <Typography sx={{ fontSize: 16 }}>
                    {/* {'Threshold: ' + selectedRP.threshold + 'm'}{' '} */}
                    {tGroups.find(
                      (item) =>
                        item._id.$oid === selectedRP.target_tactical_group_id
                    ) ? (
                      <>
                        {
                          tGroups.find(
                            (item) =>
                              item._id.$oid ===
                              selectedRP.target_tactical_group_id
                          ).title
                        }
                      </>
                    ) : (
                      <>-</>
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary">
                    Cross Tactical Group
                  </Typography>
                  <Typography sx={{ fontSize: 16 }}>
                    {tGroups.find(
                      (item) =>
                        item._id.$oid === selectedRP.cross_tactical_group_id
                    ) ? (
                      <>
                        {
                          tGroups.find(
                            (item) =>
                              item._id.$oid ===
                              selectedRP.cross_tactical_group_id
                          ).title
                        }
                      </>
                    ) : (
                      <>-</>
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </>
          ) : (
            <></>
          )}

          {/* <Grid
            container
            item={12}
            style={{
              background: 'white',
              textAlign: 'left',
              marginBottom: '24px',
              padding: '0px 12px',
            }}
          >
            <Grid item xs={6}>
              {selectedRP.target_group_1 ? (
                <>
                  <Typography style={{ color: 'black', fontSize: '14px' }}>
                    {
                      tGroups.find(
                        (group) =>
                          group._id.$oid === selectedRP.target_tactical_group_id
                      ).title
                    }
                  </Typography>
                  <Typography
                    component="div"
                    style={{
                      color: '#1976d2',
                      fontWeight: '600',
                      fontSize: '14px',
                    }}
                  >
                    {selectedRP.target_group_1.join(', ')}
                  </Typography>
                </>
              ) : (
                <></>
              )}
            </Grid>
            <Grid item xs={6}>
              {selectedRP.target_group_2 ? (
                <>
                  <Typography
                    style={{ color: 'white', fontSize: '14px', width: '100%' }}
                  >
                    {'_'}
                  </Typography>
                  <Typography
                    style={{
                      color: '#4B6587',
                      fontWeight: '600',
                      fontSize: '14px',
                    }}
                  >
                    {selectedRP.target_group_2.join(', ')}
                  </Typography>
                </>
              ) : (
                <></>
              )}
            </Grid>
            <Grid item xs={6}>
              {selectedRP.cross_group_1 !== '' ? (
                <>
                  <Typography style={{ color: 'black', fontSize: '14px' }}>
                    Cross Tactical Group:{' '}
                    {
                      tGroups.find(
                        (group) =>
                          group._id.$oid === selectedRP.cross_tactical_group_id
                      ).title
                    }
                  </Typography>
                  <Typography
                    component="div"
                    style={{
                      color: '#1976d2',
                      fontWeight: '600',
                      fontSize: '14px',
                    }}
                  >
                    {selectedRP.cross_group_1.join(', ')}
                  </Typography>
                </>
              ) : (
                <></>
              )}
            </Grid>
            <Grid item xs={6}>
              {selectedRP.cross_group_2 ? (
                <>
                  <Typography
                    style={{ color: 'white', fontSize: '14px', width: '100%' }}
                  >
                    {'_'}
                  </Typography>
                  <Typography
                    style={{
                      color: '#4B6587',
                      fontWeight: '600',
                      fontSize: '14px',
                    }}
                  >
                    {selectedRP.cross_group_2.join(', ')}
                  </Typography>
                </>
              ) : (
                <></>
              )}
            </Grid>
          </Grid> */}
          <Grid item xs={12}>
            <Divider />
          </Grid>

          {!_.isEmpty(selectedRP.rqa) ? (
            <>
              <Grid
                item
                container
                xs={12}
                style={{ background: 'white', padding: '12px 12px 0 12px' }}
              >
                <Grid container item xs={12} style={{ paddingBottom: '12px' }}>
                  <Grid item xs={12}>
                    <div
                      style={{
                        background: 'white',
                        textAlign: 'left',
                      }}
                    >
                      <Typography variant="subtitle1" component="div">
                        Recurrence Quantification
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <div
                    style={{
                      background: 'white',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ fontSize: 14, width: '100%' }}>RR</div>
                    <div
                      style={{ fontSize: 18, width: '100%', fontWeight: '500' }}
                    >
                      {selectedRP.rqa.rr.toFixed(4)}
                    </div>
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div
                    style={{
                      background: 'white',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ fontSize: 14, width: '100%' }}>DET</div>
                    <div
                      style={{ fontSize: 18, width: '100%', fontWeight: '500' }}
                    >
                      {selectedRP.rqa.det.toFixed(4)}
                    </div>
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div
                    style={{
                      background: 'white',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ fontSize: 14, width: '100%' }}>LAM</div>
                    <div
                      style={{ fontSize: 18, width: '100%', fontWeight: '500' }}
                    >
                      {selectedRP.rqa.lam.toFixed(4)}
                    </div>
                  </div>
                </Grid>

                <Grid
                  container
                  item
                  xs={12}
                  style={{ paddingBottom: '12px' }}
                ></Grid>
                <Grid container item xs={12} style={{ paddingBottom: '12px' }}>
                  <Grid item xs={3}>
                    <div
                      style={{
                        background: 'white',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ fontSize: 14, width: '100%' }}>LL</div>
                      <div
                        style={{
                          fontSize: 18,
                          width: '100%',
                          fontWeight: '500',
                        }}
                      >
                        {selectedRP.rqa.ll.toFixed(4)}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={3}>
                    <div
                      style={{
                        background: 'white',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ fontSize: 14, width: '100%' }}>TT</div>
                      <div
                        style={{
                          fontSize: 18,
                          width: '100%',
                          fontWeight: '500',
                        }}
                      >
                        {selectedRP.rqa.tt.toFixed(4)}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={3}>
                    <div
                      style={{
                        background: 'white',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ fontSize: 14, width: '100%' }}>ENTR</div>
                      <div
                        style={{
                          fontSize: 18,
                          width: '100%',
                          fontWeight: '500',
                        }}
                      >
                        {selectedRP.rqa.entr.toFixed(4)}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={3}>
                    <div
                      style={{
                        background: 'white',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ fontSize: 14, width: '100%' }}>ENTR-V</div>
                      <div
                        style={{
                          fontSize: 18,
                          width: '100%',
                          fontWeight: '500',
                        }}
                      >
                        {selectedRP.rqa['entr-v'].toFixed(4)}
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </>
          ) : (
            <></>
          )}
          {/* <Grid container item xs={12} style={{ alignContent: 'start' }}>
            <Grid item={12}>
              <List
                dense={true}
                sx={{
                  width: '100%',
                  bgcolor: 'background.paper',
                  // height: '82vh',
                  overflowY: 'overlay',
                }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    Recurrence Plots
                    <IconButton color="primary">
                      <AddIcon onClick={handleClickOpen} />
                    </IconButton>
                    {openDialog ? (
                      <CreateRPDialog
                        project={props.project}
                        handleClose={handleClose}
                        handleSave={handleSaveRP}
                      />
                    ) : (
                      <></>
                    )}
                  </ListSubheader>
                }
              >
                {rps.map((item) => (
                  <RpCard rp={item} handleLoadSelection={handleLoadSelection} />
                ))}
              </List>
            </Grid>
          </Grid> */}
        </Grid>

        {/* Start of Player */}
        {/* Header */}
        <Grid container item xs={5} style={{ padding: '0 12px' }}>
          <Grid
            item
            xs={12}
            container
            style={{ padding: '0 12px 12px 0', minHeight: '70px' }}
          >
            <Grid item xs={6}>
              <Typography
                variant="h6"
                // gutterBottom
                component="div"
                color="text.secondary"
                // fontWeight={500}
              >
                Tactical Play
              </Typography>

              <Typography
                variant="body2"
                // gutterBottom
                component="div"
                color="text.secondary"
                // fontWeight={500}
              >
                <span style={{ marginRight: '12px' }}>
                  <AccessTimeIcon
                    style={{
                      color: 'darkgray',
                      fontSize: '18px',
                      verticalAlign: 'middle',
                      marginRight: '6px',
                    }}
                  />
                  {'x:  ' + secondsConverter(xyRP[0])}
                </span>
                <span style={{ marginLeft: '12px' }}>
                  <AccessTimeIcon
                    style={{
                      color: 'darkgray',
                      fontSize: '18px',
                      verticalAlign: 'middle',
                      marginRight: '6px',
                    }}
                  />
                  {'y:  ' + secondsConverter(xyRP[1])}
                </span>
              </Typography>
            </Grid>
            {/* <Grid
              item
              xs={4}
              style={{ textAlign: 'center', alignSelf: 'center' }}
            >
              <Typography variant="body2" compnent="div" color="text.secondary">
                <AccessTimeIcon
                  style={{
                    color: 'darkgray',
                    fontSize: '18px',
                    verticalAlign: 'middle',
                    marginRight: '12px',
                  }}
                />
                {'x:  ' + secondsConverter(xyRP[0])}
              </Typography>
              <Typography variant="body2" compnent="div" color="text.secondary">
                <AccessTimeIcon
                  style={{
                    color: 'darkgray',
                    fontSize: '18px',
                    verticalAlign: 'middle',
                    marginRight: '12px',
                  }}
                />
                {'y:  ' + secondsConverter(xyRP[1])}
              </Typography>
            </Grid> */}
            <Grid item xs={6} style={{ textAlign: 'right' }}>
              <ToggleButtonSizes handleFilterPlayers={handleFilterPlayers} />
            </Grid>
          </Grid>
          {/* <Grid
            item
            xs={12}
            style={{ padding: '7px 0px', background: 'white' }}
          >
            <Divider />
          </Grid> */}

          {/* <Grid
            item
            xs={3}
            style={{
              background: 'white',
              textAlign: 'left',
              padding: '12px 24px',
              // marginBottom: '24px',
            }}
          >
            <AccessTimeIcon
              style={{
                color: 'darkgray',

                verticalAlign: 'top',
              }}
            />
            <span>
              {'   '}
              {'x: ' + xyRP[0] + 's'}
            </span>
          </Grid>
          <Grid
            item
            xs={3}
            style={{
              background: 'white',
              textAlign: 'left',
              padding: '12px 24px',
              // marginBottom: '24px',
            }}
          >
            <AccessTimeIcon
              style={{ color: 'darkgray', verticalAlign: 'top' }}
            />
            <span>
              {'   '}
              {'y: ' + xyRP[1] + 's'}
            </span>
          </Grid>

          <Grid
            item
            xs={6}
            style={{
              background: 'white',
              textAlign: 'right',

              padding: '12px',
              paddingRight: '36px',
            }}
          >
            <ToggleButtonSizes handleFilterPlayers={handleFilterPlayers} />
          </Grid> */}
          {/* END Header */}
          {gameDataX && gameDataY ? (
            <PitchLive
              gameData={gameDataX[xyRP[0]]}
              handleDotClick={handleDotClick}
              gameDataY={gameDataY[xyRP[1]]}
            />
          ) : (
            <></>
          )}

          <Player
            play={play}
            speed={speed}
            handlePlayPause={handlePlayPause}
            handleSpeed={handleSpeed}
            maxSeconds={trackingData.length - 1}
            handleSlide={handleSlide}
            sliderValue={sliderValue}
          />
          <Grid container item xs={12}>
            <RQATable project={props.project} />
          </Grid>
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

          <Grid
            container
            item
            xs={12}
            style={{
              padding: '24px 6px',
              height: '63vh',
              alignContent: 'flex-start',
              overflowY: 'auto',
            }}
          >
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
              <IconButton
                color="primary"
                onClick={() => setOpenEventDialog(true)}
              >
                <AddIcon />
              </IconButton>
              {openEventDialog ? (
                <CreateEventDialog
                  open={true}
                  handleClose={() => setOpenEventDialog(false)}
                  game={props.project.game_id}
                  gameSecond={xyRP[0]}
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
            <EventList handleEventSecond={handleEventSecond} />
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

const ToggleButtonSizes = (props) => {
  const [filterPlayers, setFilterPlayers] = React.useState('all');

  const { selectedRP } = useSelector((state) => state.RecurrenceAnalysis);

  const handleChange = (event, newFilterPlayers) => {
    // console.log('event and new filter', event, newFilterPlayers);
    if (filterPlayers !== event.target.value) {
      setFilterPlayers(newFilterPlayers);
      props.handleFilterPlayers(event);
    }
  };

  useEffect(() => {
    if (selectedRP.data) {
      setFilterPlayers('rp');
      props.handleFilterPlayers({ target: 'all' });
    }
  }, [selectedRP]);

  const children = [
    <ToggleButton value="all" key="all">
      All Players
    </ToggleButton>,
    <ToggleButton value="rp" key="rp">
      RP Only
    </ToggleButton>,
  ];

  const control = {
    value: filterPlayers,
    onChange: handleChange,
    exclusive: true,
  };

  return (
    <>
      <ToggleButtonGroup size="small" {...control} style={{ height: '30px' }}>
        {children}
      </ToggleButtonGroup>
    </>
  );
};
