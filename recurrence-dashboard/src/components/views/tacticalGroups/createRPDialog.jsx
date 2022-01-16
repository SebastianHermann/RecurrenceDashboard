import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import { Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Checkbox from '@mui/material/Checkbox';
import { useDispatch, useSelector } from 'react-redux';
import * as RP from '../../../actions/RPActions';
// import Draggable from 'react-draggable';

// function PaperComponent(props) {
//   return (
//     <Draggable
//       handle="#draggable-dialog-title"
//       cancel={'[class*="MuiDialogContent-root"]'}
//     >
//       <Paper {...props} />
//     </Draggable>
//   );
// }

export default function CreateRPDialog(props) {
  const dispatch = useDispatch();

  const [project, setProject] = useState(props.project);
  const { tGroups } = useSelector((state) => state.TGroups);

  const defaultRP = {
    game_id: project.game_id,
    project_id: project._id.$oid,
    rp_title: '',
    rp_type: 'threshold',
    target_tactical_group_id: '',
    target_group_1: [],
    target_group_2_id: '',
    target_group_2: [],
    cross_tactical_group_id: '',
    cross_group_1: [],
    cross_group_2_id: '',
    cross_group_2: [],
    threshold: 9,
    calc_logic: 'avg',
    downsample: 12,
    mirror_cord: true,
  };
  const [rp, setRP] = useState(defaultRP);
  const [advancedToggle, setAdvancedToggle] = useState(false);

  useEffect(() => {});

  const handleTitle = (event, value) => {
    setRP({ ...rp, rp_title: event.target.value });
  };

  const handleRpTypeSelection = (event, value) => {
    setRP({ ...rp, rp_type: value });
  };

  const handleTGroupSelection = (event, value) => {
    let tGroup = tGroups.find(
      (tGroup) => tGroup._id.$oid === event.target.value
    );
    let newRp = {
      ...rp,
      target_tactical_group_id: event.target.value,
      target_group_1: tGroup.player_list_1,
      target_group_2: tGroup.player_list_2,
    };
    setRP(newRp);
    // get id and Players of group 1 and group 2
    // update
  };

  const handleCrossTGroupSelection = (event, value) => {
    let tGroup = tGroups.find(
      (tGroup) => tGroup._id.$oid === event.target.value
    );
    let newRp = {
      ...rp,
      cross_tactical_group_id: event.target.value,
      cross_group_1: tGroup.player_list_1,
      cross_group_2: tGroup.player_list_2,
    };
    setRP(newRp);
  };

  const handleToggleAdvanced = (event, value) => {
    setAdvancedToggle(!advancedToggle);
  };

  const handleThresholdSelection = (event) => {
    setRP({ ...rp, threshold: parseInt(event.target.value) });
  };

  const handleCRateSelection = (event) => {
    setRP({ ...rp, downsample: parseInt(event.target.value) });
  };

  const handleMirrorCoordSelection = (event, value) => {
    setRP({ ...rp, mirror_cord: value });
  };

  const handleCalcLogicSelection = (event, value) => {
    setRP({ ...rp, calc_logic: value });
  };

  const handleSave = () => {
    console.log('rp to save', rp);
    dispatch(RP.CreateRP(rp));
    // dispatch(RP.GetRPSInfo(project));
    props.handleClose();
  };

  return (
    <div>
      <Dialog
        open={true}
        // onClose={handleClose}
        // PaperComponent={PaperComponent}
      >
        <DialogTitle>Create Recurrence Plot</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <DialogContentText>
                Create a recurrence plot based on your created tactical groups.
              </DialogContentText>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="standard-basic"
                label="Title"
                variant="outlined"
                fullWidth
                onChange={handleTitle}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Recurrence Plot Type</FormLabel>
                <RadioGroup
                  aria-label="RP Type"
                  defaultValue="threshold"
                  name="radio-buttons-group"
                  onChange={handleRpTypeSelection}
                >
                  <FormControlLabel
                    value="threshold"
                    control={<Radio />}
                    label="Threshold Recurrence Plot"
                  />
                  <FormControlLabel
                    value="cross_threshold"
                    control={<Radio />}
                    label="Cross Recurrence Plot"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl style={{ width: '100%' }}>
                <InputLabel id="demo-simple-select-helper-label">
                  Tactical Group
                </InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  label="Tactical Group"
                  value={rp.target_tactical_group_id}
                  onChange={handleTGroupSelection}
                  style={{ width: '100%' }}
                >
                  {tGroups.map((tGroup) => (
                    <MenuItem key={tGroup._id.$oid} value={tGroup._id.$oid}>
                      {tGroup.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {rp.rp_type === 'threshold' ? (
              <></>
            ) : (
              <Grid item xs={12}>
                <FormControl style={{ width: '100%' }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Cross Tactical Group
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    label="Cross Tactical Group"
                    value={rp.cross_tactical_group_id}
                    onChange={handleCrossTGroupSelection}
                    style={{ width: '100%' }}
                  >
                    {tGroups.map((tGroup) => (
                      <MenuItem key={tGroup._id.$oid} value={tGroup._id.$oid}>
                        {tGroup.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12}>
              <Accordion
                expanded={advancedToggle}
                onChange={handleToggleAdvanced}
                style={{ boxShadow: 'None' }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography sx={{ color: 'text.secondary' }}>
                    Advanced Settings
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container item xs={12} spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        id="outlined-number"
                        label="Threshold"
                        type="number"
                        variant="standard"
                        value={rp.threshold}
                        onChange={handleThresholdSelection}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Compression Rate"
                        type="number"
                        variant="standard"
                        value={rp.downsample}
                        onChange={handleCRateSelection}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">
                          Calculation Logic
                        </FormLabel>
                        <RadioGroup
                          aria-label="Calculation Logic"
                          defaultValue="avg"
                          name="radio-buttons-group"
                          onChange={handleCalcLogicSelection}
                        >
                          <FormControlLabel
                            value="avg"
                            control={<Radio />}
                            label="Average"
                          />
                          <FormControlLabel
                            value="player"
                            control={<Radio />}
                            label="Player by Player"
                            disabled
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlLabel
                        label="Mirror Coordinates"
                        control={
                          <Checkbox
                            checked={rp.mirror_cord}
                            onChange={handleMirrorCoordSelection}
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
                        }
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={props.handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
