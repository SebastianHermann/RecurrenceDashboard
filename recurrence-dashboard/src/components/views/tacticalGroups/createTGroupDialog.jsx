import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import { useDispatch } from 'react-redux';
import * as TGroups from '../../../actions/TGroupActions';
import { useParams } from 'react-router-dom';

export default function CreateTGroupDialog(props) {
  const dispatch = useDispatch();
  let params = useParams();

  const [game, setGame] = useState(props.game);
  const [allPlayers1, setAllPlayers1] = useState([]);
  const [allPlayers2, setAllPlayers2] = useState([]);
  const [playerList1, setPlayerList1] = useState();
  const [playerList2, setPlayerList2] = useState([]);
  const [title, setTitle] = useState('');

  const handleClose = () => {
    props.handleClose();
  };

  useEffect(() => {
    setAllPlayers1(props.allPlayers1);
    setAllPlayers2(props.allPlayers2);
    setPlayerList1(props.playerList1);
    setPlayerList2(props.playerList2);
  }, []);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleSave = (event) => {
    let request = {
      project_id: params.project_id,
      title: title,
      game_id: game,
      player_list_1: playerList1,
      player_list_2: playerList2,
    };
    dispatch(TGroups.CreateTGroup(request));
    props.handleClose();
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'New Tactical Group'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Create a Tactical Group by selecting some players.
          </DialogContentText>
          <Grid container spacing={0}>
            <Grid item xs={12} style={{ padding: '12px 0px' }}>
              <TextField
                id="standard-basic"
                label="Title"
                variant="outlined"
                value={title}
                onChange={handleTitleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6} style={{ padding: '12px 12px 12px 0px' }}>
              <Autocomplete
                multiple
                id="player_list_1"
                options={allPlayers1}
                getOptionLabel={(player) => player.toString()}
                defaultValue={playerList1}
                onChange={(event, value) => setPlayerList1(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Target Team"
                  />
                )}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => (
                    <Chip
                      style={{ background: '#55A87B', color: 'white' }}
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                // ChipProps={{ color: 'yellow' }}
              />
            </Grid>
            <Grid item xs={6} style={{ padding: '12px 0 12px 12px' }}>
              <Autocomplete
                multiple
                variant="outlined"
                id="player_list_2"
                options={allPlayers2}
                getOptionLabel={(player) => player.toString()}
                defaultValue={playerList2}
                onChange={(event, value) => setPlayerList2(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Opponent Team"
                    variant="outlined"
                  />
                )}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => (
                    <Chip
                      style={{ background: '#E01A4F', color: 'white' }}
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} autoFocus disabled={!title.length}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
