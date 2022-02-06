import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Plotly from 'plotly.js-cartesian-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Grid, Typography } from '@mui/material';
import GridLoader from '../../../static/Loaders/grid.svg';

const Plot = createPlotlyComponent(Plotly);

export default function RP(props) {
  const matchesXXLarge = useMediaQuery('(min-width:1710px)');
  const matchesXLarge = useMediaQuery('(min-width:1610px)');
  const matchesLarge = useMediaQuery('(min-width:1510px)');
  const matchesMedium = useMediaQuery('(min-width:1410px)');
  const matchesSmall = useMediaQuery('(min-width:1310px)');
  const [timeSelection, setTimeSelection] = useState(['00:01', '00:01']);
  const { rpsLoading, rps, selectedRPLoading, selectedRP } = useSelector(
    (state) => state.RecurrenceAnalysis
  );

  // useEffect(() => {
  //   console.log('selectedRP', selectedRP);
  //   if (selectedRP.data) {
  //     timeSelection([selectedRP.data.length / 2, selectedRP.data.length / 2]);
  //   }
  // }, [selectedRP]);

  // useEffect(() => {
  //   if (selectedRP._id && !selectedRPLoading) {
  //     console.log('IN RP.JSX: SELECTED RP IS', selectedRP);
  //   }
  // }, [selectedRP._id]);

  const handleXySelection = (event) => {
    // console.log('handle', event.points[0].x.split(':'));
    let x =
      Number(event.points[0].x.split(':')[0] * 60) +
      Number(event.points[0].x.split(':')[1]);
    let y =
      Number(event.points[0].y.split(':')[0] * 60) +
      Number(event.points[0].y.split(':')[1]);
    setTimeSelection([event.points[0].x, event.points[0].y]);
    props.handleXYSelection(x, y);
  };

  let size = matchesXXLarge
    ? 430
    : matchesXLarge
    ? 400
    : matchesLarge
    ? 370
    : matchesMedium
    ? 340
    : matchesSmall
    ? 310
    : 280;

  const secondsConverter = (sec) => {
    let minutes = Math.floor(sec / 60); // get minutes
    let seconds = sec - minutes * 60;
    let m_result = minutes < 10 ? '0' + minutes : minutes;
    let s_result = seconds < 10 ? '0' + seconds : seconds;
    return String(m_result + ':' + s_result);
  };

  return (
    <Grid
      item
      xs={12}
      style={{
        alignContent: 'center',
        // minHeight: '400px',
        // maxHeight: '430px',
        height: `${size}px`,
      }}
    >
      {selectedRP.data && !selectedRPLoading ? (
        <>
          <div
            style={{
              position: 'absolute',
              zIndex: '1',
              fontSize: '12px',
              marginLeft: '48px',
            }}
          >
            Time X: {timeSelection[0]}
            {'   '} Time Y: {timeSelection[1]}
          </div>
          <Plot
            style={{ display: 'none' }}
            data={[
              {
                z: selectedRP.data ? selectedRP.data : [[]],
                x: selectedRP.data
                  ? selectedRP.data.map((item, index) =>
                      secondsConverter(index * selectedRP.downsample)
                    )
                  : [],
                y: selectedRP.data
                  ? selectedRP.data.map((item, index) =>
                      secondsConverter(index * selectedRP.downsample)
                    )
                  : [],
                type: 'heatmap',
                colorscale: [
                  [0, 'rgb(255, 255, 255)'],
                  [1, '#1f2041'],
                ],
                zsmooth: false,
                showscale: false,
                name: 'RP',
                mode: 'markers+lines+text',
              },
            ]}
            onClick={handleXySelection}
            layout={{
              width: size,
              height: size,
              mirror: true,

              margin: {
                l: 50,
                r: 24,
                b: 42,
                t: 32,
                pad: 5,
              },
              hovermode: 'closest',
              hoverinfo: 'x+y',
              xaxis: {
                linecolor: '#1f2041',
                linewidth: 1,
                mirror: true,
                tickfont: {
                  color: '#1f2041',
                },
                tickvals: selectedRP.downsample
                  ? [
                      0,
                      900 / selectedRP.downsample,
                      1800 / selectedRP.downsample,
                      2700 / selectedRP.downsample,
                      3600 / selectedRP.downsample,
                      4500 / selectedRP.downsample,
                      5400 / selectedRP.downsample,
                    ]
                  : [0],
                ticktext: selectedRP.downsample
                  ? [
                      '00:00',
                      '15:00',
                      '30:00',
                      '45:00',
                      '60:00',
                      '75:00',
                      '90:00',
                    ]
                  : ['00:00'],
              },
              yaxis: {
                linecolor: '#1f2041',
                linewidth: 1,
                mirror: true,
                autorange: 'reversed',
                tickfont: {
                  color: '#1f2041',
                },
                tickvals: selectedRP.downsample
                  ? [
                      0,
                      900 / selectedRP.downsample,
                      1800 / selectedRP.downsample,
                      2700 / selectedRP.downsample,
                      3600 / selectedRP.downsample,
                      4500 / selectedRP.downsample,
                      5400 / selectedRP.downsample,
                    ]
                  : [0],
                ticktext: selectedRP.downsample
                  ? [
                      '00:00',
                      '15:00',
                      '30:00',
                      '45:00',
                      '60:00',
                      '75:00',
                      '90:00',
                    ]
                  : ['00:00'],
              },
            }}
          />
        </>
      ) : (
        <Grid
          item
          xs={12}
          style={{
            alignItems: 'center',
            textAlign: 'center',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {selectedRPLoading ? (
            <img src={GridLoader} />
          ) : (
            <Typography className="title-5">
              Create or Select a Recurrence Plot to display.
            </Typography>
          )}
        </Grid>
      )}
    </Grid>
  );
}
