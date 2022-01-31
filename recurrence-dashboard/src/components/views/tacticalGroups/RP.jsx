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
  const [timeSelection, setTimeSelection] = useState([1, 1]);
  const { rpsLoading, rps, selectedRPLoading, selectedRP } = useSelector(
    (state) => state.RecurrenceAnalysis
  );

  // useEffect(() => {
  //   console.log('selectedRP', selectedRP);
  //   if (selectedRP.data) {
  //     timeSelection([selectedRP.data.length / 2, selectedRP.data.length / 2]);
  //   }
  // }, [selectedRP]);

  const handleXySelection = (event) => {
    let x = event.points[0].x * selectedRP.downsample;
    let y = event.points[0].y * selectedRP.downsample;
    setTimeSelection([x, y]);
    props.handleXYSelection(event);
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
            Time X: {timeSelection[0] + 's'}
            {'   '} Time Y: {timeSelection[1] + 's'}
          </div>
          <Plot
            style={{ display: 'none' }}
            data={[
              {
                z: selectedRP.data ? selectedRP.data : [[]],
                type: 'heatmap',
                colorscale: [
                  [0, 'rgb(255, 255, 255)'],
                  [1, '#1f2041'],
                ],
                zsmooth: false,
                showscale: false,
                name: 'RP',
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
              xaxis: {
                linecolor: '#1f2041',
                linewidth: 1,
                mirror: true,
                tickfont: {
                  color: '#1f2041',
                },
              },
              yaxis: {
                linecolor: '#1f2041',
                linewidth: 1,
                mirror: true,
                autorange: 'reversed',
                tickfont: {
                  color: '#1f2041',
                },
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
