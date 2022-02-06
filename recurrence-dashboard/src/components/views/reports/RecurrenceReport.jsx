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
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as TGroups from '../../../actions/TGroupActions';
import * as TRACKING from '../../../actions/TrackingActions';
import CreateTGroupDialog from '../tacticalGroups/createTGroupDialog';
import PitchLive from '../tacticalGroups/pitch_all';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import StatsTable from '../../common/StatsTable';
import CreateEventDialog from '../tacticalGroups/createEventsDialog';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import EventList from '../../common/EventList';
import AccessTime from '@mui/icons-material/AccessTime';
import EventTimeLine from '../../common/EventTimeLine';
import * as PROJECTS from '../../../actions/ProjectActions';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import LoadRPDialog from '../recboard/loadRPDialog';
import _, { filter } from 'lodash';
import RP from '../tacticalGroups/RP';
import GroupIcon from '@mui/icons-material/Group';
import Avatar from '@mui/material/Avatar';
import DotLoader from '../../../static/Loaders/three-dots.svg';
import PuffLoader from '../../../static/Loaders/puff.svg';
import * as RQA from '../../../actions/RQAActions';
import CreateRPDialog from '../tacticalGroups/createRPDialog';
import { toPng } from 'html-to-image';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import moment from 'moment';
import { TextField } from '@material-ui/core';
import { jsPDF } from 'jspdf';
import { svgAsPngUri } from 'save-svg-as-png';
import html2canvas from 'html2canvas';

export default function RecurrenceReport() {
  const dispatch = useDispatch();
  const printRef = useRef(null);

  let params = useParams();
  const [openChangeDialog, setOpenChangeDialog] = useState(false);

  const { projects, user } = useSelector((state) => state.Projects);
  const [project, setProject] = useState();

  const { loadingTrackingData, trackingData } = useSelector(
    (state) => state.Tracking
  );

  const [filterRP, setFilterRP] = useState(false);
  const selectedRP = useSelector((state) => state.RQA);
  const {
    rqa_id,
    target_group_1,
    target_group_2,
    selectedRPLoading,
    cross_group_1,
    cross_group_2,
    rrLoading,
    detLoading,
    lamLoading,
    lLoading,
    ttLoading,
    entrLoading,
    entrVLoading,
    frp1Loading,
    frp2Loading,
    frp3Loading,
    rr,
    det,
    lam,
    l,
    tt,
    entr,
    entrV,
    frp1,
    frp2,
    frp3,
  } = selectedRP;

  useEffect(() => {
    console.log('projects', project);
  }, [project]);

  useEffect(() => {
    if (projects.length) {
      let project = projects.find(
        (project) => project._id.$oid === params.project_id
      );
      setProject(project);
    }
  }, [projects]);

  const handleGetRQA = () => {
    console.log('handle GetRQA', selectedRP);
    if (selectedRP._id) {
      dispatch(RQA.GetRQA(selectedRP));
    }
  };

  const secondsConverter = (sec) => {
    let minutes = Math.floor(sec / 60);
    let seconds = sec - minutes * 60;
    let m_result = minutes < 10 ? '0' + minutes : minutes;
    let s_result = seconds < 10 ? '0' + seconds : seconds;
    return String(m_result + ':' + s_result);
  };

  useEffect(() => {
    console.log('selectedRP', selectedRP);
  });

  const [reportTitle, setReportTitle] = useState('');
  const [reportComments, setReportComments] = useState('');
  const [reportAuthor, setReportAuthor] = useState('');
  const [reportDate, setReportDate] = useState(moment().format('DD-MM-YYYY'));

  useEffect(() => {}, []);

  const handleDownloadPdf = async () => {
    console.log('ref', printRef);
    const graph = document
      .querySelector('#capture')
      .getElementsByClassName('main-svg')
      .item(0);
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pdfCanvas = document.createElement('canvas');
    pdfCanvas.setAttribute('width', 450);
    pdfCanvas.setAttribute('height', 450);

    // window.html2canvas = html2canvas;
    // let content = document.querySelector('#capture');

    const input = document.getElementById('capture');
    console.log('input', input);
    pdf.html(document.body, {
      callback: function (pdf) {
        pdf.save('test.pdf');
      },
    });

    // const dataURI = await svgAsPngUri(graph);

    // pdf.addImage(dataURI, 'PNG', 0, 0);
    // var source = window.document.getElementsByTagName('body')[0];
    // pdf.fromHTML(source, 15, 15, {
    //   width: 180,
    // });
    // pdf.text('Hello World', 40, 40, 70, 70);
    // pdf.save('filename.pdf');
    // pdf.output('dataurlnewwindow');

    // let doc = new jsPDF('p', 'pt', 'a4');
    // doc.text('Hello World', 10, 10);
    // doc.addImage(imgData1, 'PNG', 40, 40, 75, 75);
    // doc.addImage(imgData2, 'PNG', 40, 40, 75, 75);
    // doc.addImage(imgData3, 'PNG', 40, 40, 75, 75);
    // doc.save('test.pdf');

    // console.log('img', dataURI);

    // const doc = new jsPDF();
    // doc.text('Hello World', 40, 40);
    // doc.addImage(data);
    // doc.save('a4.pdf');

    // pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    // pdf.save('print.pdf');
  };

  // const printPdf = () => {
  //   var doc = new jsPDF();

  //   doc.fromHTML(document.getElementById('capture'), 20, 20, {
  //     width: 1000,
  //   });

  //   doc.save('Test.pdf');
  // };

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
          <Grid item xs={12}>
            <Typography className="subtitle-2">
              {project ? project.title : '...'}
            </Typography>
            <Typography className="title-3" gutterBottom>
              Recurrence Report
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider flexitem />
        </Grid>
        <Grid container item xs={12} style={{ padding: '16px 24px 0 24px' }}>
          <Grid item xs={9}>
            {selectedRPLoading ? (
              <em>Loading...</em>
            ) : (
              <Typography className="subtitle-2">
                {!_.isEmpty(selectedRP._id) ? (
                  selectedRP.rp_title
                ) : (
                  <em>Select a Recurrence Plot for your report</em>
                )}
              </Typography>
            )}
          </Grid>
          <Grid item xs={3} style={{ textAlign: 'right' }}>
            <Button
              size="small"
              endIcon={<CompareArrowsIcon />}
              onClick={() => setOpenChangeDialog(true)}
            >
              Select RP
            </Button>
            {openChangeDialog ? (
              <LoadRPDialog
                open={true}
                handleClose={() => setOpenChangeDialog(false)}
              />
            ) : (
              <></>
            )}
          </Grid>
        </Grid>

        <Grid container item xs={12} style={{ padding: '16px 24px 0 24px' }}>
          <Grid item xs={12} style={{ padding: '8px 0px' }}>
            <Typography className="title-5">Report Title</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              size="small"
              id="report-title"
              label="Report Title"
              variant="outlined"
              fullWidth
              value={reportTitle}
              onChange={(event, value) => setReportTitle(value)}
            />
          </Grid>
        </Grid>
        <Grid container item xs={12} style={{ padding: '16px 24px 0 24px' }}>
          <Grid item xs={12} style={{ padding: '8px 0px' }}>
            <Typography className="title-5">Report Comments</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="report comments"
              label="Report Comments"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              value={reportComments}
              onChange={(event, value) => setReportComments(value)}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} style={{ padding: '24px 0px' }}>
          <Divider flexitem />
        </Grid>
        <Grid container item xs={12} style={{ padding: '16px 24px 0 24px' }}>
          <Grid item xs={12} style={{ padding: '8px 0px' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleDownloadPdf}
              className="add-button-small"
            >
              <span>Download</span>
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        container
        item
        xs={9}
        alignItems="baseline"
        style={{
          alignContent: 'start',
          padding: '24px',
          alignItems: 'flex-start',
        }}
      >
        <div ref={printRef}>
          <div id="capture">id="capture"</div>
          <Grid container>
            <Grid item>a</Grid>
            <Grid item>this</Grid>
            <Grid item>is</Grid>
            <Grid item>a</Grid>
            <Grid item xs={12}>
              test
            </Grid>
          </Grid>
        </div>
      </Grid>
    </React.Fragment>
  );
}
