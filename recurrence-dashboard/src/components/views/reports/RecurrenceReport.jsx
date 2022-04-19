import { TextField } from '@material-ui/core';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import * as jsPDF from 'jspdf';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { svgAsPngUri } from 'save-svg-as-png';
import LoadRPDialog from '../recboard/loadRPDialog';
import RP_Report from './RP_Report';

export default function RecurrenceReport() {
  const dispatch = useDispatch();
  const printRef = useRef(null);

  let params = useParams();
  const [openChangeDialog, setOpenChangeDialog] = useState(false);

  const { projects, user } = useSelector((state) => state.Projects);
  const { tGroups, loading } = useSelector((state) => state.TGroups);
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

  // const handleGetRQA = () => {
  //   console.log('handle GetRQA', selectedRP);
  //   if (selectedRP._id) {
  //     dispatch(RQA.GetRQA(selectedRP));
  //   }
  // };

  // const secondsConverter = (sec) => {
  //   let minutes = Math.floor(sec / 60);
  //   let seconds = sec - minutes * 60;
  //   let m_result = minutes < 10 ? '0' + minutes : minutes;
  //   let s_result = seconds < 10 ? '0' + seconds : seconds;
  //   return String(m_result + ':' + s_result);
  // };

  // const [reportTitle, setReportTitle] = useState('');
  // const [reportComments, setReportComments] = useState('');
  // const [reportAuthor, setReportAuthor] = useState('');
  const [reportDate, setReportDate] = useState(moment().format('DD.MM.YYYY'));
  const [imgsrc, setImgsrc] = useState('');

  const handleDownloadPdf = async () => {
    textRef.current.focus();
    commentsRef.current.focus();

    const graph = document
      .querySelector('#capture')
      .getElementsByClassName('main-svg')
      .item(0);
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pdfCanvas = document.createElement('canvas');
    pdfCanvas.setAttribute('width', 450);
    pdfCanvas.setAttribute('height', 450);

    // const graph = document
    //   .querySelector('#capture')
    //   .getElementsByClassName('main-svg')
    //   .item(0);

    const dataURI = await svgAsPngUri(graph);
    setImgsrc(dataURI);

    pdf.setProperties({
      title: 'Recboard_' + textRef.current.value,
      subject: 'Report',
      author: 'Recboard',
      keywords: 'Recurrence Analysis, Dashboard, Performance Analysis',
      creator: 'Recboard',
    });

    //Header
    //Title
    pdf.setFont('helvetica');
    pdf.setTextColor(31, 32, 65);
    pdf.setFontSize(24);
    pdf.setFontType('bold');
    pdf.text(
      textRef.current.value ? textRef.current.value : 'Recboard Report',
      48,
      48
    );

    //Date
    pdf.setFontSize(9);
    pdf.setFontType('bold');
    pdf.text(reportDate, 500, 48);

    //Subtitle
    pdf.setFont('helvetica');
    pdf.setTextColor(167, 168, 171);
    pdf.setFontSize(16);
    pdf.setFontType('bold');
    // pdf.text(project ? project.title : '-', 48, 72);
    pdf.text(project._id !== '' ? project.title : '-', 48, 72);
    //Subtitle 2
    pdf.text(project ? 'Game ' + project.game_id : '-', 48, 96);

    //Tactical Group Section
    pdf.setFontSize(12);
    pdf.setTextColor(31, 32, 65);
    pdf.setFontType('bold');
    pdf.text('Tactical Group (x-axis):', 48, 136);

    let tacticalGroupNameX = selectedRP.target_tactical_group_id
      ? tGroups.find(
          (group) => group._id.$oid === selectedRP.target_tactical_group_id
        ).title
      : '-';

    pdf.text(tacticalGroupNameX, 220, 136);
    //Target Team
    pdf.setFontSize(12);
    pdf.setFontType('normal');

    let targetTeamX = selectedRP.target_group_1.length
      ? target_group_1.join(', ')
      : '-';
    let opponentTeamX = selectedRP.target_group_2.length
      ? target_group_2.join(', ')
      : '-';
    pdf.text('Target Team:', 48, 152);
    pdf.text(targetTeamX, 220, 152);
    pdf.text('Opponent Team', 48, 168);
    pdf.text(opponentTeamX, 220, 168);

    //Tactical Group Section

    pdf.setFontType('bold');
    pdf.text('Tactical Group (y-axis):', 48, 216);

    let tacticalGroupNameY = selectedRP.cross_tactical_group_id
      ? tGroups.find(
          (group) => group._id.$oid === selectedRP.cross_tactical_group_id
        ).title
      : selectedRP.target_tactical_group_id
      ? tacticalGroupNameX
      : '-';

    pdf.text(tacticalGroupNameY, 220, 216);
    //Target Team
    pdf.setFontSize(12);
    pdf.setFontType('normal');

    let targetTeamY =
      selectedRP.cross_group_1.length || selectedRP.cross_group_2.length
        ? cross_group_1.length
          ? cross_group_1.join(', ')
          : '-'
        : selectedRP.target_group_1.length
        ? targetTeamX
        : // '-'
          '-';
    let opponentTeamY =
      selectedRP.cross_group_1.length || selectedRP.cross_group_2.length
        ? cross_group_2.length
          ? cross_group_2.join(', ')
          : '-'
        : selectedRP.target_group_2.length
        ? opponentTeamX
        : // '-'
          '-';

    pdf.text('Target Team:', 48, 232);
    pdf.text(targetTeamY, 220, 232);
    pdf.text('Opponent Team', 48, 248);
    pdf.text(opponentTeamY, 220, 248);

    //Recurrence Plot

    pdf.addImage(dataURI, 'PNG', 220, 288);
    pdf.setFontType('bold');

    let title_rp = selectedRP.rp_title ? selectedRP.rp_title : 'RP';
    pdf.text(title_rp, 220, 294);

    //RQAS
    pdf.setFontType('bold');
    pdf.text('RQA-Parameters*', 48, 294);

    pdf.setFontType('normal');
    pdf.setFontSize(12);

    let rr = selectedRP.rr ? selectedRP.rr.toFixed(4) : '-';
    let det = selectedRP.det ? selectedRP.det.toFixed(4) : '-';
    let lam = selectedRP.lam ? selectedRP.lam.toFixed(4) : '-';
    let tt = selectedRP.tt ? selectedRP.tt.toFixed(4) : '-';
    let l = selectedRP.l ? selectedRP.l.toFixed(4) : '-';
    let entr = selectedRP.entr
      ? Math.abs(selectedRP.entr.toFixed(4)).toString()
      : '-';
    let entrV = selectedRP.entrV
      ? Math.abs(selectedRP.entrV.toFixed(4)).toString()
      : '-';
    let frp1 = selectedRP.frp1 ? selectedRP.frp1.toFixed(4) : '-';
    let frp2 = selectedRP.frp2 ? selectedRP.frp2.toFixed(4) : '-';
    let frp3 = selectedRP.frp3 ? selectedRP.frp3.toFixed(4) : '-';

    pdf.text('RR:', 48, 316);
    pdf.text(rr, 130, 316);
    pdf.text('DET:', 48, 336);
    pdf.text(det, 130, 336);

    pdf.text('LAM:', 48, 356);
    pdf.text(lam, 130, 356);
    pdf.text('TT:', 48, 376);
    pdf.text(tt, 130, 376);

    pdf.text('L:', 48, 396);
    pdf.text(l, 130, 396);
    pdf.text('ENTR:', 48, 416);
    pdf.text(entr, 130, 416);

    pdf.text('ENTR-V:', 48, 436);
    pdf.text(entrV, 130, 436);

    pdf.text('FRP-1: ', 48, 456);
    pdf.text(frp1, 130, 456);
    pdf.text('FRP-2: ', 48, 476);
    pdf.text(frp2, 130, 476);
    pdf.text('FRP-3: ', 48, 496);
    pdf.text(frp3, 130, 496);

    pdf.setFontType('bold');
    pdf.text('RP-Meta-Information', 48, 544);

    pdf.setFontType('normal');
    pdf.setFontSize(12);

    let rp_type = selectedRP.rp_type ? selectedRP.rp_type : '-';
    pdf.text('Type:', 48, 564);
    pdf.text(rp_type, 130, 564);

    let threshold = selectedRP.threshold ? selectedRP.threshold + 'm' : '-';
    pdf.text('Threshold:', 48, 584);
    pdf.text(threshold, 130, 584);

    let calc_logic = selectedRP.calc_logic ? selectedRP.calc_logic : '-';
    pdf.text('Calc. Method:', 48, 604);
    pdf.text(calc_logic, 130, 604);

    let mirror_cord = selectedRP.mirror_cord
      ? selectedRP.mirror_cord.toString()
      : '-';
    pdf.text('Mirror Coord.:', 48, 624);
    pdf.text(mirror_cord, 130, 624);

    pdf.setFontType('bold');
    pdf.text('Comments', 48, 684);

    pdf.setFontType('italic');
    pdf.text(
      48,
      704,
      commentsRef.current.value ? commentsRef.current.value : '-',
      { maxWidth: 450 }
    );

    // pdf.addPage();
    pdf.setFontType('normal');
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 0; i < pageCount; i++) {
      pdf.setPage(i);
      pdf.text(
        550,
        820,
        pdf.internal.getCurrentPageInfo().pageNumber + '/' + pageCount
      );
    }
    pdf.setFontType('italic');
    pdf.setFontSize(10);
    pdf.text('This file was created automatically by Recboard.', 48, 804);
    pdf.text('More information on ', 48, 820);
    pdf.setTextColor(25, 118, 210);
    pdf.textWithLink(
      'Football Match Dynamics Explored by Recurrence Analysis',
      142,
      820,
      {
        url: 'https://www.frontiersin.org/articles/10.3389/fpsyg.2021.747058/full',
      }
    );

    window.open(pdf.output('bloburl'), '_blank');
    textRef.current.value = '';
  };

  const [enableReport, setEnableReport] = useState(false);

  const createImage = async () => {
    const graph = document
      .querySelector('#capture')
      .getElementsByClassName('main-svg')
      .item(0);
    console.log('graph is ', graph);
    const dataURI = await svgAsPngUri(graph);
    setImgsrc(dataURI);
  };

  useEffect(() => {
    if (projects.length && selectedRP._id && !selectedRPLoading) {
      setEnableReport(true);
    } else {
      setEnableReport(false);
    }
  }, [projects, selectedRP, selectedRPLoading]);

  const defaultState = { reportTitle: '', reportComments: '' };
  const [state, setState] = useState({ ...defaultState });

  const textRef = useRef();
  const handleReportTitle = (event) => {
    textRef.current.focus();
  };

  const commentsRef = useRef();
  const handleReportComments = (event) => {
    commentsRef.current.focus();
  };

  const [activeImageCreator, setActiveImageCreator] = useState(false);

  // useEffect(() => {
  //   console.log('use Effect');
  //   createImage();
  //   // let intervalId;
  //   // if (activeImageCreator == true && !imgsrc && selectedRP._id) {
  //   //   console.log('loading trigger started');
  //   //   intervalId = setInterval(() => {
  //   //     if (selectedRP._id && !imgsrc) {
  //   //       console.log('tick');
  //   //       createImage();
  //   //     } else {
  //   //       setActiveImageCreator(false);
  //   //       clearInterval(intervalId);
  //   //     }
  //   //   }, 1000);
  //   // }

  //   // if (activeImageCreator == false) {
  //   //   console.log('loading trigger stopped');
  //   //   clearInterval(intervalId);
  //   // }
  // }, [activeImageCreator]);

  useEffect(() => {
    let intervalId;
    if (activeImageCreator === true) {
      console.log('loading trigger started');

      if (activeImageCreator) {
        intervalId = setTimeout(() => {
          console.log('tick', imgsrc);
          createImage();
          setActiveImageCreator(false);
        }, 1000);
      } else {
        setActiveImageCreator(false);
        clearInterval(intervalId);
        console.log('close image creator');
      }
    } else {
      clearInterval(intervalId);
    }
  }, [activeImageCreator]);

  useEffect(() => {
    if (selectedRP._id) {
      console.log('activate image creator');
      setActiveImageCreator(true);
    }
  }, [selectedRP]);

  useEffect(() => {
    console.log('image source on mount', imgsrc);
  }, [imgsrc]);

  const handleSetImage = (dataUri) => {
    setImgsrc(dataUri);
  };

  let project_title = project ? project.title : '-';
  //Subtitle 2
  let project_game = project ? 'Game ' + project.game_id : '-';

  let tacticalGroupNameX = selectedRP.target_tactical_group_id
    ? tGroups.find(
        (group) => group._id.$oid === selectedRP.target_tactical_group_id
      ).title
    : '-';

  let tacticalGroupNameY = selectedRP.cross_tactical_group_id
    ? tGroups.find(
        (group) => group._id.$oid === selectedRP.cross_tactical_group_id
      ).title
    : selectedRP.target_tactical_group_id
    ? tacticalGroupNameX
    : '-';

  let targetTeamX = selectedRP.target_group_1.length
    ? target_group_1.join(', ')
    : '-';
  let opponentTeamX = selectedRP.target_group_2.length
    ? target_group_2.join(', ')
    : '-';

  let targetTeamY = selectedRP.cross_tactical_group_id
    ? cross_group_1.length
      ? cross_group_1.join(', ')
      : '-'
    : selectedRP.target_group_1.length
    ? targetTeamX
    : '-';
  let opponentTeamY = selectedRP.cross_tactical_group_id
    ? cross_group_2.length
      ? cross_group_2.join(', ')
      : '-'
    : selectedRP.target_group_2.length
    ? opponentTeamX
    : '-';

  let rr = selectedRP.rr ? selectedRP.rr.toFixed(4) : '-';
  let det = selectedRP.det ? selectedRP.det.toFixed(4) : '-';
  let lam = selectedRP.lam ? selectedRP.lam.toFixed(4) : '-';
  let tt = selectedRP.tt ? selectedRP.tt.toFixed(4) : '-';
  let l = selectedRP.l ? selectedRP.l.toFixed(4) : '-';
  let entr = selectedRP.entr ? Math.abs(selectedRP.entr.toFixed(4)) : '-';
  let entrV = selectedRP.entrV ? Math.abs(selectedRP.entrV.toFixed(4)) : '-';
  let frp1 = selectedRP.frp1 ? selectedRP.frp1.toFixed(4) : '-';
  let frp2 = selectedRP.frp2 ? selectedRP.frp2.toFixed(4) : '-';
  let frp3 = selectedRP.frp3 ? selectedRP.frp3.toFixed(4) : '-';

  let rp_type = selectedRP.rp_type ? selectedRP.rp_type : '-';
  let threshold = selectedRP.threshold ? selectedRP.threshold : '-';
  let calc_logic = selectedRP.calc_logic ? selectedRP.calc_logic : '-';
  let mirror_cord = selectedRP.mirror_cord
    ? selectedRP.mirror_cord.toString()
    : '-';

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
              label="Report Title"
              variant="outlined"
              fullWidth
              inputRef={textRef}
              onChange={handleReportTitle}
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
              inputRef={commentsRef}
              onChange={handleReportComments}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} style={{ padding: '24px 0px' }}>
          <Divider flexitem />
        </Grid>
        <Grid container item xs={12} style={{ padding: '0 24px' }}>
          <Grid item xs={12} style={{ padding: '0px' }}>
            <Button
              variant="contained"
              startIcon={<PictureAsPdfIcon />}
              onClick={handleDownloadPdf}
              className="add-button-small"
              disabled={!enableReport}
              style={{ opacity: enableReport ? '100%' : '30%' }}
            >
              <span>Create Report</span>
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid container item xs={7}>
        <Grid
          item
          xs={12}
          style={{
            margin: '48px',
            background: 'white',
            border: 'solid 1px #0000001f',
            maxWidth: '600px',
            padding: '48px',
          }}
        >
          <Grid container item id="capture">
            <Grid container item xs={8} style={{ display: 'none' }}>
              <RP_Report handleSetImage={handleSetImage} />
            </Grid>
            <Grid container item xs={10}>
              <Typography className="pdf-title-1">Report</Typography>
            </Grid>
            <Grid container item xs={2}>
              <Typography
                className="pdf-title-4
                "
                style={{ alignSelf: 'center' }}
              >
                {reportDate}
              </Typography>
            </Grid>
            <Grid container item xs={12}>
              <Typography className="pdf-subtitle-1">
                {project_title}
              </Typography>
            </Grid>
            <Grid container item xs={12} style={{ marginBottom: '24px' }}>
              <Typography className="pdf-subtitle-1">{project_game}</Typography>
            </Grid>
            <Grid container item xs={12} style={{ marginBottom: '24px' }}>
              <Grid item xs={4}>
                <Typography className="pdf-title-4">
                  Tactical Group (x-axis):
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography className="pdf-title-4">
                  {tacticalGroupNameX}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography className="pdf-text-1">Target Team</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography className="pdf-text-1">{targetTeamX}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography className="pdf-text-1">Opponent Team</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography className="pdf-text-1">{opponentTeamX}</Typography>
              </Grid>
            </Grid>

            <Grid container item xs={12} style={{ marginBottom: '24px' }}>
              <Grid item xs={4}>
                <Typography className="pdf-title-4">
                  Tactical Group (y-axis):
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography className="pdf-title-4">
                  {tacticalGroupNameY}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography className="pdf-text-1">Target Team</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography className="pdf-text-1">{targetTeamY}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography className="pdf-text-1">Opponent Team</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography className="pdf-text-1">{opponentTeamY}</Typography>
              </Grid>
            </Grid>

            <Grid container item xs={4} spacing={0} className="pdf-container">
              <Grid item xs={12}>
                <Typography className="pdf-title-4">RQA-Parameters</Typography>
              </Grid>
              <Grid item xs={6} className="pdf-container">
                <Typography className="pdf-text-1">RR:</Typography>
              </Grid>
              <Grid item xs={6} className="pdf-container">
                <Typography className="pdf-text-1">{rr}</Typography>
              </Grid>
              <Grid item xs={6} className="pdf-container">
                <Typography className="pdf-text-1">DET:</Typography>
              </Grid>
              <Grid item xs={6} className="pdf-container">
                <Typography className="pdf-text-1">{det}</Typography>
              </Grid>
              <Grid item xs={6} className="pdf-container">
                <Typography className="pdf-text-1">LAM:</Typography>
              </Grid>
              <Grid item xs={6} className="pdf-container">
                <Typography className="pdf-text-1">{lam}</Typography>
              </Grid>
              <Grid item xs={6} className="pdf-container">
                <Typography className="pdf-text-1">TT:</Typography>
              </Grid>
              <Grid item xs={6} className="pdf-container">
                <Typography className="pdf-text-1">{tt}</Typography>
              </Grid>
              <Grid item xs={6} className="pdf-container">
                <Typography className="pdf-text-1">L:</Typography>
              </Grid>
              <Grid item xs={6} className="pdf-container">
                <Typography className="pdf-text-1">{l}</Typography>
              </Grid>
              <Grid item xs={6} className="pdf-container">
                <Typography className="pdf-text-1">ENTR:</Typography>
              </Grid>
              <Grid item xs={6} className="pdf-container">
                <Typography className="pdf-text-1">{entr}</Typography>
              </Grid>
              <Grid item xs={6} className="pdf-container">
                <Typography className="pdf-text-1">ENTR-V:</Typography>
              </Grid>
              <Grid item xs={6} className="pdf-container">
                <Typography className="pdf-text-1">{entrV}</Typography>
              </Grid>
              <Grid item xs={6} className="pdf-container">
                <Typography className="pdf-text-1">FRP-1:</Typography>
              </Grid>
              <Grid item xs={6} className="pdf-container">
                <Typography className="pdf-text-1">{frp1}</Typography>
              </Grid>
              <Grid item xs={6} className="pdf-container">
                <Typography className="pdf-text-1">FRP-2:</Typography>
              </Grid>
              <Grid item xs={6} className="pdf-container">
                <Typography className="pdf-text-1">{frp2}</Typography>
              </Grid>
              <Grid item xs={6} className="pdf-container">
                <Typography className="pdf-text-1">FRP-3:</Typography>
              </Grid>
              <Grid
                item
                xs={6}
                className="pdf-container"
                style={{ marginBottom: '24px' }}
              >
                <Typography className="pdf-text-1">{frp3}</Typography>
              </Grid>

              <Grid item xs={12} className="pdf-container">
                <Typography className="pdf-title-4">
                  RP-Meta-Information
                </Typography>
              </Grid>
              <Grid item xs={6} className="pdf-container">
                <Typography className="pdf-text-1">Type:</Typography>
              </Grid>
              <Grid item xs={6} className="pdf-container">
                <Typography className="pdf-text-1">{rp_type}</Typography>
              </Grid>
              <Grid item xs={6} className="pdf-container">
                <Typography className="pdf-text-1">Threshold:</Typography>
              </Grid>
              <Grid item xs={6} className="pdf-container">
                <Typography className="pdf-text-1">{threshold}</Typography>
              </Grid>
              <Grid item xs={6} className="pdf-container">
                <Typography className="pdf-text-1">Calc. Method:</Typography>
              </Grid>
              <Grid item xs={6} className="pdf-container">
                <Typography className="pdf-text-1">{calc_logic}</Typography>
              </Grid>
              <Grid item xs={6} className="pdf-container">
                <Typography className="pdf-text-1">Mirror. Coord.</Typography>
              </Grid>
              <Grid item xs={6} className="pdf-container">
                <Typography className="pdf-text-1">{mirror_cord}</Typography>
              </Grid>
            </Grid>

            <Grid
              container
              item
              xs={8}
              className="pdf-container"
              style={{ alignContent: 'flex-start' }}
            >
              <Grid item xs={12} className="pdf-container">
                <Typography className="pdf-title-4">
                  RP-Meta-Information
                </Typography>
              </Grid>
              <Grid item xs={12} className="pdf-container">
                {selectedRP._id ? (
                  <img
                    src={imgsrc}
                    style={{
                      width: '340px',
                      height: '340px',
                    }}
                  ></img>
                ) : (
                  <Grid item style={{ margin: '24px 0px' }}>
                    <em>Select a RP</em>
                  </Grid>
                )}
              </Grid>
            </Grid>

            {/* <Report /> */}
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
