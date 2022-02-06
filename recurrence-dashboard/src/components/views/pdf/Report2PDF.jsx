import React, { useCallback, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Svg,
  Image,
} from '@react-pdf/renderer';
import { Grid } from '@mui/material';
import RP from '../tacticalGroups/RP';
import Plotly from 'plotly.js-cartesian-dist';
// import { useSelector } from 'react-redux';
import createPlotlyComponent from 'react-plotly.js/factory';

const Plot = createPlotlyComponent(Plotly);
// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

const MyDocument = (props) => {
  //   const { rpsLoading, rps, selectedRPLoading, selectedRP } = useSelector(
  //     (state) => state.RecurrenceAnalysis
  //   );

  // let plot = document.getElementById('chart-container').getElementsByClassName('modebar');
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Section #1</Text>
        </View>
        <View style={styles.section}>
          <Text>Section #2</Text>
        </View>
        <View>
          <Svg>
            <img src={props.imageSrc}></img>
          </Svg>
        </View>
      </Page>
    </Document>
  );
};

export default function Report2PDF() {
  const handleXYSelection = () => {
    console.log('handled');
  };
  const ref = useRef(null);

  const onButtonClick = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    toPng(ref.current)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'my-image-name.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });

    toPng(ref.current)
      .then(function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;
        document.body.appendChild(img);
      })
      .catch(function (err) {
        console.log(err);
      });
  }, [ref]);

  let size = '400px';
  let data = [
    {
      z: [[]],
      type: 'heatmap',
      colorscale: [
        [0, 'rgb(255, 255, 255)'],
        [1, '#1f2041'],
      ],
      zsmooth: false,
      showscale: false,
      name: 'RP',
    },
  ];

  let layout = {
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
  };

  // let test = document.getElementsByClassName('main-svg').item(1);
  // console.log('test', test);

  // toPng(ref.current)
  //   .then(function (dataUrl) {
  //     var img = new Image();
  //     img.src = dataUrl;
  //     // document.body.appendChild(img);
  //     // document.getElementById('pagePdf').appendChild(img);
  //     setImageSrc(img);
  //   })
  //   .catch(function (error) {
  //     console.error('oops, something went wrong!', error);
  //   });
  return (
    <Grid container>
      <Grid item xs={12}>
        <div ref={ref}>
          <Plot data={data} layout={layout}></Plot>
          <div style={{ fontWeight: '500' }}>Example Test</div>
        </div>
        <div id="pagePdf">Hello Hello</div>
        <button onClick={onButtonClick}>Click me</button>
      </Grid>
    </Grid>
  );
}
