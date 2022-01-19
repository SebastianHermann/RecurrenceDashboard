import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import Pitch from '../../common/Pitch';
import * as Projects from '../../../actions/ProjectActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import FormHelperText from '@mui/material/FormHelperText';
import Divider from '@mui/material/Divider';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Loader = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  );
};

const ProjectForm = (props) => {
  const game_ids = [...new Set(props.gameData.map((item) => item.game_id))];
  const styles = {
    formControl: { padding: '12px 0px' },
    box: { padding: '12px 0px' },
    button: { padding: '2% 0%' },
  };

  const handleChange = (event) => {
    props.handleChange(event.target);
  };

  const handleSave = (event) => {
    props.handleSave();
  };

  return (
    <>
      <Typography variant="h6" gutterBottom component="div" style={styles.box}>
        New Project
      </Typography>
      <FormControl fullWidth style={styles.formControl}>
        <TextField
          id="outlined-basic"
          label="Title"
          variant="outlined"
          value={props.new.title}
          name="title"
          onChange={handleChange}
        />
      </FormControl>
      <FormControl fullWidth style={styles.formControl}>
        <InputLabel
          id="demo-simple-select-standard-label"
          style={{ top: '18px', left: '-14px' }}
        >
          Game
        </InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          variant="standard"
          value={props.new.game_id}
          onChange={handleChange}
          label="Game"
          name="game_id"
        >
          {game_ids.map((e) => (
            <MenuItem key={e} value={e}>
              {e}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth style={styles.formControl}>
        <TextField
          id="outlined-basic"
          label="Result"
          variant="standard"
          value={props.new.game_result}
          name="game_result"
          onChange={handleChange}
        />
      </FormControl>
      <FormControl fullWidth style={styles.formControl}>
        <TextField
          id="outlined-basic"
          label="Description"
          variant="standard"
          value={props.new.description}
          name="description"
          onChange={handleChange}
        />
      </FormControl>
      <FormControl fullWidth style={styles.button}>
        <Button
          autoFocus
          color="primary"
          onClick={handleSave}
          disabled={!props.new.title || !props.new.game_result}
          variant="contained"
        >
          save
        </Button>
      </FormControl>
    </>
  );
};

export default function CreateProjectDialog(props) {
  const dispatch = useDispatch();
  const { teams, loading } = useSelector((state) => state.Teams);
  const { stats, allStats } = useSelector((state) => state.Stats);
  const { user } = useSelector((state) => state.Projects);

  const styles = {
    container: { padding: '0px 24px' },
  };
  const default_values = {
    title: '',
    user_name: user,
    game_result: '',
    game_id: '',
    description: '',
  };
  const [userInput, setUserInput] = useState({ ...default_values });
  const [filteredGameData, setFilteredGameData] = useState(1);
  const [gameSelection, setGameSelection] = useState();
  const [gameEvents, setGameEvents] = useState();

  useEffect(() => {
    let game_filter = teams.filter(
      (player) => player.game_id === gameSelection
    );
    setFilteredGameData(game_filter);
  }, [teams]);

  useEffect(() => {
    let game_filter = teams.filter(
      (player) => player.game_id === gameSelection
    );
    setFilteredGameData(game_filter);
  }, [gameSelection]);

  const handleChange = (event) => {
    setUserInput({ ...userInput, game_id: event.target.value });
    let gameEvents = allStats.find(
      (item) => item.game_id === event.target.value
    );
    setGameEvents(gameEvents);
  };

  const saveProject = () => {
    dispatch(Projects.CreateProject(userInput));
  };

  const handleSave = () => {
    saveProject();
    setUserInput(default_values);
    props.handleClose();
  };

  const handleClose = () => {
    setUserInput(default_values);
    setGameEvents();
    props.handleClose();
  };

  return (
    <div>
      <Dialog
        fullWidth
        open={props.open}
        onClose={handleClose}
        TransitionComponent={Transition}
        maxWidth="sm"
      >
        <div>
          <DialogTitle>New Project</DialogTitle>
          <DialogContent>
            <DialogContentText style={{ marginBottom: '24px' }}>
              Give your project a catchy title and choose a game you want to
              analyze.
            </DialogContentText>
            <Grid container>
              <Grid container spacing={3} item xs={12}>
                <Grid item xs={12}>
                  <TextField
                    autoFocus
                    variant="outlined"
                    margin="dense"
                    id="title"
                    label="Title"
                    value={userInput.title}
                    fullWidth
                    onChange={(event) =>
                      setUserInput({ ...userInput, title: event.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-helper-label">
                      Game
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      value={userInput.game_id}
                      label="Game"
                      onChange={handleChange}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {allStats ? (
                        allStats.map((item) => (
                          <MenuItem key={item.game_id} value={item.game_id}>
                            {item.game_id +
                              ': ' +
                              item.HomeTeam +
                              ' vs. ' +
                              item.AwayTeam}
                          </MenuItem>
                        ))
                      ) : (
                        <>
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                        </>
                      )}
                    </Select>
                    <FormHelperText>Select a game for details</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
              <Divider
                //   orientation="vertical"
                flexItem
              ></Divider>

              <Grid container item xs={12} style={{ padding: '24px' }}>
                {gameEvents ? (
                  <>
                    <Grid container item xs={12} alignItems={'center'}>
                      <Grid
                        item
                        xs={5}
                        style={{
                          fontWeight: '500',
                          fontSize: '18px',
                          color:
                            gameEvents.HomeTeam === 'Leverkusen'
                              ? '#1976d2'
                              : '#4A5268',
                        }}
                      >
                        {gameEvents.HomeTeam}
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        style={{ fontWeight: '500', textAlign: 'center' }}
                      >
                        <span>
                          {gameEvents.Full_Time_Home_Team_Goals +
                            ' : ' +
                            gameEvents.Full_Time_Away_Team_Goals}
                        </span>
                        <br />
                        <span style={{ color: 'darkgray', fontSize: '12px' }}>
                          {'(' +
                            gameEvents.Half_Time_Home_Team_Goals +
                            ' : ' +
                            gameEvents.Half_Time_Away_Team_Goals +
                            ')'}
                        </span>
                      </Grid>
                      <Grid
                        item
                        xs={5}
                        style={{
                          textAlign: 'right',
                          fontWeight: '500',
                          fontSize: '18px',
                          color:
                            gameEvents.AwayTeam === 'Leverkusen'
                              ? '#1976d2'
                              : '#4A5268',
                        }}
                      >
                        {gameEvents.AwayTeam}
                      </Grid>
                    </Grid>
                    <Grid item xs={12} style={{ padding: '6px 0px' }}>
                      <Divider />
                    </Grid>

                    <Grid
                      item
                      xs={2}
                      style={{
                        fontWeight: '500',
                        color:
                          gameEvents.HomeTeam === 'Leverkusen'
                            ? '#1976d2'
                            : '#4A5268',
                      }}
                    >
                      {gameEvents.Home_Team_Shots}
                    </Grid>
                    <Grid item xs={8} style={{ textAlign: 'center' }}>
                      Shots
                    </Grid>
                    <Grid
                      item
                      xs={2}
                      style={{
                        fontWeight: '500',
                        color:
                          gameEvents.AwayTeam === 'Leverkusen'
                            ? '#1976d2'
                            : '#4A5268',
                        textAlign: 'right',
                      }}
                    >
                      {gameEvents.Away_Team_Shots}
                    </Grid>
                    <Grid item xs={12} style={{ padding: '6px 0px' }}>
                      <Divider />
                    </Grid>

                    <Grid
                      item
                      xs={2}
                      style={{
                        fontWeight: '500',
                        color:
                          gameEvents.HomeTeam === 'Leverkusen'
                            ? '#1976d2'
                            : '#4A5268',
                      }}
                    >
                      {gameEvents.Home_Team_Shots_on_Target}
                    </Grid>
                    <Grid item xs={8} style={{ textAlign: 'center' }}>
                      Shots on Target
                    </Grid>
                    <Grid
                      item
                      xs={2}
                      style={{
                        fontWeight: '500',
                        color:
                          gameEvents.AwayTeam === 'Leverkusen'
                            ? '#1976d2'
                            : '#4A5268',
                        textAlign: 'right',
                      }}
                    >
                      {gameEvents.Away_Team_Shots_on_Target}
                    </Grid>
                    <Grid item xs={12} style={{ padding: '6px 0px' }}>
                      <Divider />
                    </Grid>

                    <Grid
                      item
                      xs={2}
                      style={{
                        fontWeight: '500',
                        color:
                          gameEvents.HomeTeam === 'Leverkusen'
                            ? '#1976d2'
                            : '#4A5268',
                      }}
                    >
                      {gameEvents.Home_Team_Corners}
                    </Grid>
                    <Grid item xs={8} style={{ textAlign: 'center' }}>
                      Corners
                    </Grid>
                    <Grid
                      item
                      xs={2}
                      style={{
                        fontWeight: '500',
                        color:
                          gameEvents.AwayTeam === 'Leverkusen'
                            ? '#1976d2'
                            : '#4A5268',
                        textAlign: 'right',
                      }}
                    >
                      {gameEvents.Away_Team_Corners}
                    </Grid>
                    <Grid item xs={12} style={{ padding: '6px 0px' }}>
                      <Divider />
                    </Grid>

                    <Grid
                      item
                      xs={2}
                      style={{
                        fontWeight: '500',
                        color:
                          gameEvents.HomeTeam === 'Leverkusen'
                            ? '#1976d2'
                            : '#4A5268',
                      }}
                    >
                      {gameEvents.Home_Team_Fouls_Committed}
                    </Grid>
                    <Grid item xs={8} style={{ textAlign: 'center' }}>
                      Fouls Committed
                    </Grid>
                    <Grid
                      item
                      xs={2}
                      style={{
                        fontWeight: '500',
                        color:
                          gameEvents.AwayTeam === 'Leverkusen'
                            ? '#1976d2'
                            : '#4A5268',
                        textAlign: 'right',
                      }}
                    >
                      {gameEvents.Away_Team_Fouls_Committed}
                    </Grid>
                  </>
                ) : (
                  <></>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              disabled={userInput.title === '' || userInput.game_id === ''}
              onClick={handleSave}
            >
              Save
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
}
