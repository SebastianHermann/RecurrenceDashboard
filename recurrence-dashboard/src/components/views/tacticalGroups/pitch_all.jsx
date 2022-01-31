import React, { useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import {
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Scatter,
  ReferenceDot,
  ReferenceArea,
  ReferenceLine,
  LabelList,
  ZAxis,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Button, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import useMediaQuery from '@mui/material/useMediaQuery';
import AccessTime from '@mui/icons-material/AccessTime';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';

const secondsConverter = (sec) => {
  let minutes = Math.floor(sec / 60); // get minutes
  let seconds = sec - minutes * 60;
  let m_result = minutes < 10 ? '0' + minutes : minutes;
  let s_result = seconds < 10 ? '0' + seconds : seconds;
  return String(m_result + ':' + s_result);
};

export default function PitchLive(props) {
  const [showNumbers, setShowNumbers] = useState(true);
  const matches = useMediaQuery('(min-width:1200px)');

  const scale = matches ? 6.1 : 4.5;
  const width = `${100}%`;

  const dot = (color) => (
    <span
      style={{
        display: 'inline-block',
        marginLeft: '15px',
        marginRight: '5px',
        marginBottom: '0px',
        borderRadius: '50%',
        background: color,
        // borderStyle: 'solid',
        // borderWidth: '0.5px',
        // borderColor: 'black',
        height: '10px',
        width: '10px',
      }}
    ></span>
  );

  const labelBar = () => {
    let label = props.gameDataY ? (
      <>
        <span>{dot('#55A87B')}Target Team x</span>
        <span>{dot('#B4E0C8')}Target Team y</span>
        <span>{dot('#E01A4F')}Opponent Team x</span>
        <span>{dot('#FF7477')}Opponent Team y</span>
      </>
    ) : (
      <>
        <>
          <span>{dot('#55A87B')}Target Team</span>
          <span>{dot('#E01A4F')}Opponent Team</span>
        </>
      </>
    );
    return label;
  };

  return (
    <Grid
      container
      item
      xs={12}
      style={{ background: 'white', borderRadius: '8px' }}
    >
      <Grid container item xs={12} style={{ padding: '16px 16px 0px 16px' }}>
        <Grid
          item
          xs={12}
          className="title-5"
          style={{
            fontSize: '16px',
          }}
        >
          {labelBar()}
        </Grid>
        {/* <Grid item xs={3} style={{ textAlign: 'center', alignSelf: 'center' }}>
          <Typography  style={{ marginRight: '16px' }}>
            <AccessTime
              style={{
                fontSize: '16px',
                verticalAlign: 'text-top',
                marginRight: '8px',
              }}
            />
            {secondsConverter(props.gameSecond)}
          </Typography>
        </Grid> */}
      </Grid>
      {props.loading ? (
        <Grid item xs={12} style={{ padding: '16px 24px 0 24px' }}>
          <LinearProgress />
        </Grid>
      ) : (
        <></>
      )}
      <ResponsiveContainer
        width={width}
        aspect="1.54"
        minWidth="525px"
        minHeight="340px"
      >
        <ScatterChart
          width={120 * scale}
          height={80 * scale}
          margin={{
            right: 20,
            bottom: 0,
            left: 20,
          }}
        >
          {/* 
                The following Reference components are used to draw the football pitch
            */}
          <ReferenceDot
            x={12}
            y={34}
            r={8.7 * scale}
            stroke="#a7a8ab"
            fillOpacity={0}
          />{' '}
          {/* Left Penalty Arc */}
          <ReferenceDot
            x={52.5}
            y={34}
            r={12 * scale}
            stroke="#a7a8ab"
            fillOpacity={0}
          />{' '}
          {/* Center Circle */}
          <ReferenceDot
            x={93}
            y={34}
            r={8.7 * scale}
            stroke="#a7a8ab"
            fillOpacity={0}
          />{' '}
          {/* Right Penalty Arc */}
          <ReferenceArea
            x1={0}
            x2={18}
            y1={12}
            y2={68 - 12}
            fill="white"
            fillOpacity={1}
            stroke="#a7a8ab"
          />{' '}
          {/* Left Penalty Area */}
          <ReferenceArea
            x1={87}
            x2={105}
            y1={12}
            y2={68 - 12}
            fill="white"
            fillOpacity={1}
            stroke="#a7a8ab"
          />{' '}
          {/* Right Penalty Area */}
          <ReferenceArea
            x1={0}
            x2={6}
            y1={24}
            y2={68 - 24}
            fill="white"
            fillOpacity={1}
            stroke="#a7a8ab"
          />{' '}
          {/* Left 6-yard Box */}
          <ReferenceArea
            x1={99}
            x2={105}
            y1={24}
            y2={68 - 24}
            fill="white"
            fillOpacity={1}
            stroke="#a7a8ab"
          />{' '}
          {/* Right 6-yard box */}
          <ReferenceDot
            x={52.5}
            y={34}
            r={0.5 * scale}
            fill="#a7a8ab"
            stroke="#a7a8ab"
          />{' '}
          {/* Centre Spot */}
          <ReferenceDot
            x={12}
            y={34}
            r={0.5 * scale}
            fill="#a7a8ab"
            stroke="#a7a8ab"
          />{' '}
          {/* Left Penalty Spot */}
          <ReferenceDot
            x={93}
            y={34}
            r={0.5 * scale}
            fill="#a7a8ab"
            stroke="#a7a8ab"
          />{' '}
          {/* Right Penalty Spot */}
          {/* <CartesianGrid /> */}
          <ReferenceArea
            x1={52.48}
            x2={52.5}
            y1={0}
            y2={68}
            fill="white"
            fillOpacity={1}
            stroke="#a7a8ab"
          />{' '}
          {/* <ReferenceLine x={52.5} y1={0} y2={68} stroke="#a7a8ab" />{' '} */}
          {/* Center Half */}
          <ReferenceArea
            x1={0}
            x2={0.1}
            y1={30}
            y2={68 - 30}
            fill="#a7a8ab"
            fillOpacity={1}
            stroke="#a7a8ab"
          />{' '}
          {/* Left Goal line */}
          <ReferenceArea
            x1={104.9}
            x2={105}
            y1={30}
            y2={68 - 30}
            fill="#a7a8ab"
            fillOpacity={1}
            stroke="#a7a8ab"
          />{' '}
          {/* Right Goal line */}
          <ReferenceArea
            x1={0}
            x2={105}
            y1={0}
            y2={68}
            fillOpacity={0}
            stroke="#a7a8ab"
          />{' '}
          {/* Pitch Outline */}
          <XAxis type="number" dataKey="x_norm" hide domain={[-2, 108]} />
          <YAxis type="number" dataKey="y_norm" hide domain={[-5, 73]} />
          <ZAxis range={[350, 350]} />
          {/* <Tooltip /> */}
          {props.gameDataY ? (
            props.loading ? (
              <></>
            ) : (
              <>
                <Scatter
                  name="Ball"
                  data={props.gameDataY.ball_list}
                  fill="#fd9644"
                  isAnimationActive={false}
                  label="mapped_id"
                >
                  <LabelList
                    fontSize={11}
                    dataKey="mapped_id"
                    fill="white"
                    style={{ pointerEvents: 'none' }}
                  >
                    y
                  </LabelList>
                </Scatter>
                <Scatter
                  name="Target Team Y"
                  data={props.gameDataY.player_list_1}
                  fill="#B4E0C8"
                  isAnimationActive={false}
                  onClick={props.handleDotClick}
                  cursor="pointer"
                  //   content={renderGroup1Label}
                >
                  {showNumbers ? (
                    <LabelList
                      fontSize={11}
                      dataKey="mapped_id"
                      // fill="white"
                      style={{ pointerEvents: 'none' }}
                      cursor="pointer"
                    />
                  ) : (
                    <></>
                  )}
                </Scatter>
                <Scatter
                  name="Opponent Team Y"
                  data={props.gameDataY.player_list_2}
                  fill="#FF7477"
                  isAnimationActive={false}
                  onClick={props.handleDotClick}
                  cursor="pointer"
                >
                  {showNumbers ? (
                    <LabelList
                      fontSize={11}
                      dataKey="mapped_id"
                      style={{ pointerEvents: 'none' }}
                    />
                  ) : (
                    <></>
                  )}
                </Scatter>
              </>
            )
          ) : (
            <></>
          )}
          {props.loading ? (
            <></>
          ) : (
            <>
              <Scatter
                name="Ball X"
                data={props.gameData.ball_list}
                fill="#1976d2"
                isAnimationActive={false}
                label="mapped_id"
              >
                <LabelList
                  fontSize={11}
                  dataKey="mapped_id"
                  fill="white"
                  style={{ pointerEvents: 'none' }}
                >
                  x
                </LabelList>
              </Scatter>
              <Scatter
                name="Target Team"
                data={props.gameData.player_list_1}
                fill="#55a87b"
                isAnimationActive={false}
                onClick={props.handleDotClick}
                cursor="pointer"
                //   content={renderGroup1Label}
              >
                {showNumbers ? (
                  <LabelList
                    fontSize={11}
                    dataKey="mapped_id"
                    fill="white"
                    style={{ pointerEvents: 'none' }}
                  />
                ) : (
                  <></>
                )}
              </Scatter>
              <Scatter
                name="Opponent Team"
                data={props.gameData.player_list_2}
                fill="#e01a4f"
                isAnimationActive={false}
                onClick={props.handleDotClick}
                cursor="pointer"
              >
                {showNumbers ? (
                  <LabelList
                    fontSize={11}
                    dataKey="mapped_id"
                    style={{ pointerEvents: 'none' }}
                    fill="white"
                  />
                ) : (
                  <></>
                )}
              </Scatter>
            </>
          )}
        </ScatterChart>
      </ResponsiveContainer>
    </Grid>
  );
}
