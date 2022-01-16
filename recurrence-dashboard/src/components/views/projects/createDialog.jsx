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
          variant="standard"
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
          {/* <Select
          variant="outlined"
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={props.new.game_id}
          label="Game"
          onChange={handleChange}
          name="game_id"
        > */}
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

export default function CreateDialog(props) {
  const dispatch = useDispatch();
  const { teams, loading } = useSelector((state) => state.Teams);

  const styles = {
    container: { padding: '0px 24px' },
  };
  const default_values = {
    title: '',
    user_name: 'test',
    game_result: '',
    game_id: 1,
    description: '',
  };
  const [userInput, setUserInput] = useState({ ...default_values });
  const [filteredGameData, setFilteredGameData] = useState([]);
  const [gameSelection, setGameSelection] = useState(1);

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

  const handleChange = (target_event) => {
    setUserInput({ ...userInput, [target_event.name]: target_event.value });
    if (
      target_event.name === 'game_id' &&
      target_event.value !== gameSelection
    ) {
      setGameSelection(target_event.value);
    }
  };

  const saveProject = () => {
    console.log('projects');
    dispatch(Projects.CreateProject(userInput));
  };

  const handleSave = () => {
    saveProject();
    setUserInput(default_values);
    props.handleClose();
  };

  const handleClose = () => {
    setUserInput(default_values);
    props.handleClose();
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={props.open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Container maxWidth="lg">
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Create new Project
              </Typography>
            </Toolbar>
          </Container>
        </AppBar>
        <Container maxWidth="lg">
          <Grid container spacing={2} style={styles.container}>
            <Grid item xs={8} md={5}>
              {!loading ? (
                <ProjectForm
                  handleChange={handleChange}
                  handleSave={handleSave}
                  new={userInput}
                  gameData={teams}
                />
              ) : (
                <Loader />
              )}
            </Grid>
            <Grid item xs={8} md={7}>
              {filteredGameData ? (
                <Pitch gameData={filteredGameData} />
              ) : (
                <Loader />
              )}
            </Grid>
          </Grid>
        </Container>
      </Dialog>
    </div>
  );
}
