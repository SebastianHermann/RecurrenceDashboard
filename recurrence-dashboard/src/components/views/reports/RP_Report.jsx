import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Plotly from 'plotly.js-cartesian-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Grid, Typography } from '@mui/material';
import GridLoader from '../../../static/Loaders/grid.svg';
import { svgAsPngUri } from 'save-svg-as-png';

const Plot = createPlotlyComponent(Plotly);

export default function RP_Report(props) {
  const matchesXXLarge = useMediaQuery('(min-width:1710px)');
  const matchesXLarge = useMediaQuery('(min-width:1610px)');
  const matchesLarge = useMediaQuery('(min-width:1510px)');
  const matchesMedium = useMediaQuery('(min-width:1410px)');
  const matchesSmall = useMediaQuery('(min-width:1310px)');
  const { selectedRPLoading, selectedRP } = useSelector(
    (state) => state.RecurrenceAnalysis
  );

  const secondsConverter = (sec) => {
    let minutes = Math.floor(sec / 60); // get minutes
    let seconds = sec - minutes * 60;
    let m_result = minutes < 10 ? '0' + minutes : minutes;
    let s_result = seconds < 10 ? '0' + seconds : seconds;
    return String(m_result + ':' + s_result);
  };

  const [data, setData] = useState(() => {
    const initialState = selectedRP._id ? selectedRP.data : [];
    return initialState;
  });

  const [x, setX] = useState(() => {
    const initialState = selectedRP._id
      ? selectedRP.data.map((item, index) =>
          secondsConverter(index * selectedRP.downsample)
        )
      : [];
    return initialState;
  });

  const [y, setY] = useState(() => {
    const initialState = selectedRP._id
      ? selectedRP.data.map((item, index) =>
          secondsConverter(index * selectedRP.downsample)
        )
      : [];
    return initialState;
  });

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

  // useEffect(() => {
  //   if (selectedRP._id) {
  //     props.createImage();
  //   }
  // });

  const handleSetImage = async () => {
    const graph = document
      .querySelector('#capture')
      .getElementsByClassName('main-svg')
      .item(0);
    console.log('graph is ', graph);
    const dataURI = await svgAsPngUri(graph);

    props.handleSetImage(dataURI);
  };

  return (
    <React.Fragment>
      <Grid
        item
        xs={12}
        style={{
          alignContent: 'left',
          // minHeight: '400px',
          // maxHeight: '430px',
          //   height: `${size}px`,
        }}
      >
        {selectedRP.data && !selectedRPLoading ? (
          <>
            <Plot
              data={[
                {
                  z: selectedRP._id ? selectedRP.data : [[]],
                  x: selectedRP._id
                    ? selectedRP.data.map((item, index) =>
                        secondsConverter(index * selectedRP.downsample)
                      )
                    : [],
                  y: selectedRP._id
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
                  hoverInfo: 'skip',
                },
              ]}
              layout={{
                hoverInfo: 'skip',
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
                hovermode: 'none',

                xaxis: {
                  hoverInfo: 'skip',
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
                  hoverInfo: 'skip',
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
            {handleSetImage}
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
    </React.Fragment>
  );
}
