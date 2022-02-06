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
import { useDispatch } from 'react-redux';
import * as TGroups from '../../../actions/TGroupActions';
import { useParams } from 'react-router-dom';
import * as Events from '../../../actions/EventActions';

export default function CreateEventDialog(props) {
  const dispatch = useDispatch();
  let params = useParams();

  let defaultEvent = {
    title: '',
    second: props.gameSecond,
    description: '',
    involvedTeams: 'both',
  };

  const [game, setGame] = useState(props.game);
  const [matchEvent, setMatchEvent] = useState(defaultEvent);

  const handleClose = () => {
    props.handleClose();
  };

  const handleSave = (event) => {
    let request = {
      project_id: params.project_id,
      title: matchEvent.title,
      game_id: game,
      second: matchEvent.second,
      description: matchEvent.description,
      involvedTeams: matchEvent.involvedTeams,
    };

    dispatch(Events.CreateEvent(request));
    props.handleClose();
  };

  const secondsConverter = (sec) => {
    let minutes = Math.floor(sec / 60); // get minutes
    let seconds = sec - minutes * 60;
    let m_result = minutes < 10 ? '0' + minutes : minutes;
    let s_result = seconds < 10 ? '0' + seconds : seconds;
    return String(m_result + ':' + s_result);
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'New Match Event'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <DialogContentText id="alert-dialog-description">
                Create game events to record special game events or mark
                distinctive situations.
              </DialogContentText>
            </Grid>

            <Grid item xs={12}>
              <TextField
                id="standard-basic"
                label="Title"
                variant="outlined"
                value={matchEvent.title}
                onChange={(event) =>
                  setMatchEvent({ ...matchEvent, title: event.target.value })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="standard-basic"
                label="Second"
                variant="outlined"
                type={'number'}
                value={matchEvent.second}
                helperText={'Time: ' + secondsConverter(matchEvent.second)}
                onChange={(event) =>
                  setMatchEvent({ ...matchEvent, second: event.target.value })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="filled-multiline-flexible"
                label="Description"
                multiline
                maxRows={4}
                minRows={2}
                value={matchEvent.description}
                onChange={(event) =>
                  setMatchEvent({
                    ...matchEvent,
                    description: event.target.value,
                  })
                }
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
