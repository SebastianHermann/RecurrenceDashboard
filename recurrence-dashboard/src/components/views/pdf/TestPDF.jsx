import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import React, { useCallback, useRef, useState } from 'react';
import Plotly from 'plotly.js-cartesian-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import { svgAsPngUri } from 'save-svg-as-png';
import { toPng } from 'html-to-image';
import { Document, Page, PDFViewer } from '@react-pdf/renderer';
import Canvg from 'canvg';

const Plot = createPlotlyComponent(Plotly);

export default function TestPDF() {
  const printRef = useRef(null);
  const [image, setImage] = useState();

  const handleDownloadPdf = async () => {
    // const element = printRef.current;
    // const canvas = await html2canvas(element);
    // const data = canvas.toDataURL('image/png');
    // console.log('print ref', printRef);
    // const pdf = new jsPDF();
    // const imgProperties = pdf.getImageProperties(data);
    // const pdfWidth = pdf.internal.pageSize.getWidth();
    // const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    console.log(
      'canvas',
      document
        .querySelector('#capture')
        .getElementsByClassName('main-svg')
        .item(0)
    );

    let plotlySVG1 = document
      .querySelector('#capture')
      .getElementsByClassName('main-svg')
      .item(0).outerHTML;

    let plotlySVG2 = document
      .querySelector('#capture')
      .getElementsByClassName('main-svg')
      .item(1).outerHTML;

    let plotlySVG3 = document
      .querySelector('#capture')
      .getElementsByClassName('main-svg')
      .item(2).outerHTML;

    // if (plotlySVG) {
    //   plotlySVG = plotlySVG.replace(/\r?\n|\r/g, '').trim();
    // }

    let canvas1 = document.createElement('canvas');
    // Canvg.from(canvas1, plotlySVG1);
    let imgData1 = canvas1.toDataURL('image/png');

    let canvas2 = document.createElement('canvas');
    // Canvg.from(canvas2, plotlySVG2);
    let imgData2 = canvas2.toDataURL('image/png');

    let canvas3 = document.createElement('canvas');
    // Canvg.from(canvas3, plotlySVG3);
    let imgData3 = canvas3.toDataURL('image/png');

    const graph = document
      .querySelector('#capture')
      .getElementsByClassName('main-svg')
      .item(0);
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pdfCanvas = document.createElement('canvas');
    pdfCanvas.setAttribute('width', 450);
    pdfCanvas.setAttribute('height', 450);

    const dataURI = await svgAsPngUri(graph);

    pdf.addImage(dataURI, 'PNG', 0, 0);
    pdf.save('filename.pdf');

    // let doc = new jsPDF('p', 'pt', 'a4');
    // doc.text('Hello World', 10, 10);
    // doc.addImage(imgData1, 'PNG', 40, 40, 75, 75);
    // doc.addImage(imgData2, 'PNG', 40, 40, 75, 75);
    // doc.addImage(imgData3, 'PNG', 40, 40, 75, 75);
    // doc.save('test.pdf');

    console.log('img', dataURI);
    // const doc = new jsPDF();
    // doc.text('Hello World', 40, 40);
    // doc.addImage(data);
    // doc.save('a4.pdf');

    // pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    // pdf.save('print.pdf');
  };

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

  return (
    <div>
      <button type="button" onClick={handleDownloadPdf}>
        Download as PDF
      </button>

      <div>I will not be in the PDF.</div>
      <div ref={printRef} id="capture">
        <Plot id="test" data={data} layout={layout}></Plot>
        <p>I will be in the PDF.</p>
      </div>
    </div>
  );
}
