import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Plotly from 'plotly.js-cartesian-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import useMediaQuery from '@mui/material/useMediaQuery';

const Plot = createPlotlyComponent(Plotly);

export default function RP(props) {
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

  let size = matchesMedium ? 430 : matchesSmall ? 400 : 300;

  return (
    <>
      {selectedRP.data ? (
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
            // style={{ width: '400px' }}
            config={{ responsive: true }}
            data={[
              // {
              //   z: selectedRP.data,
              //   type: 'heatmap',
              //   colorscale: [
              //     [0, 'rgb(255, 255, 255)'],
              //     [1, 'rgb(0, 0, 0)'],
              //   ],
              //   showscale: false,
              //   zsmooth: false,
              //   yaxis: 'y2',
              //   xaxis: 'x2',
              //   hovermode: false,
              // },
              {
                z: selectedRP.data,
                type: 'heatmap',
                colorscale: [
                  [0, 'rgb(255, 255, 255)'],
                  [1, 'rgb(0, 0, 0)'],
                ],
                // colorbar: {
                //   tick0: 0,
                //   dtick: 0,
                // },
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
                l: 40,
                r: 24,
                b: 40,
                t: 30,
                pad: 5,
              },
              xaxis: {
                linecolor: 'black',
                linewidth: 1,
                mirror: true,
              },
              yaxis: {
                linecolor: 'black',
                linewidth: 1,
                mirror: true,
                autorange: 'reversed',
              },

              // automargin: true,
              // yaxis2: {
              //   // title: 'Events',
              //   overlaying: 'y',
              //   side: 'right',
              //   tickvals: [0, 100, 105, 107, 200, 210, 240, 245, 250],
              //   ticktext: [
              //     'Start',
              //     '⚽',
              //     '🥅',
              //     '✋',
              //     '🟥',
              //     '🟨',
              //     '🦵',
              //     '📺',
              //     '🚩',
              //   ],
              //   tickfont: {
              //     size: '14',
              //   },
              // },
              // xaxis2: {
              //   // title: 'Events',
              //   overlaying: 'x',
              //   side: 'top',
              //   tickvals: [0, 100, 105, 107, 200, 210, 240, 245, 250],
              //   ticktext: [
              //     'Start',
              //     '⚽',
              //     '🥅',
              //     '✋',
              //     '🟥',
              //     '🟨',
              //     '🦵',
              //     '📺',
              //     '🚩',
              //   ],
              //   tickfont: {
              //     size: '14',
              //   },
              //   tickangle: '0',
              // },
            }}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
}
