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

const renderGroup1Label = (props) => {
  const { x, y, width, height, value } = props;
  const radius = 9;

  return (
    <g>
      <circle cx={x + width / 2} cy={y - radius} r={radius} fill="#1976d2" />
      <text
        x={x + width / 2}
        y={y - radius}
        fill="black"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={10}
      >
        {value}
      </text>
    </g>
  );
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
        <span>{dot('#1976D2')}Target Team x</span>
        <span>{dot('#45aaf2')}Target Team y</span>
        <span>{dot('#4b6584')}Opponent Team x</span>
        <span>{dot('#a5b1c2')}Opponent Team y</span>
      </>
    ) : (
      <>
        <>
          <span>{dot('#1976D2')}Target Team</span>
          <span>{dot('#4b6584')}Opponent Team</span>
        </>
      </>
    );
    return label;
  };

  return (
    <Grid container spacing={0}>
      <Grid item xs={12} style={{ background: 'white' }}>
        <div
          style={{
            position: 'absolute',
            padding: '4px 30px',
            display: 'flex',
            fontSize: '14px',
          }}
        >
          {labelBar()}
          {/* <span
            style={{
              display: 'inline-block',
              marginLeft: '5px',
              marginRight: '5px',
              marginBottom: '0px',
              borderRadius: '50%',
              borderStyle: 'solid',
              borderWidth: '0.5px',
              borderColor: 'black',
              height: '10px',
              width: '10px',
            }}
          ></span>
          <span>Labels</span>
          <span>Labels</span>
          <span>Labels</span>
          <span style={{ textAlign: 'right' }}>right</span> */}
        </div>
        <ResponsiveContainer
          width={width}
          //   height="62%"
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
            {/* <Legend
              layout="horizontal"
              verticalAlign="top"
              align="left"
              margin="12px"
              fontSize="12px !important"
              style={{ top: '12px' }}
            /> */}
            {/* 
                The following Reference components are used to draw the football pitch
            */}
            <ReferenceDot
              x={12}
              y={34}
              r={9 * scale}
              stroke="black"
              fillOpacity={0}
            />{' '}
            {/* Left Penalty Arc */}
            <ReferenceDot
              x={52.5}
              y={34}
              r={10 * scale}
              stroke="black"
              fillOpacity={0}
            />{' '}
            {/* Center Circle */}
            <ReferenceDot
              x={95}
              y={34}
              r={9 * scale}
              stroke="black"
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
              stroke="black"
            />{' '}
            {/* Left Penalty Area */}
            <ReferenceArea
              x1={89}
              x2={105}
              y1={12}
              y2={68 - 12}
              fill="white"
              fillOpacity={1}
              stroke="black"
            />{' '}
            {/* Right Penalty Area */}
            <ReferenceArea
              x1={0}
              x2={6}
              y1={24}
              y2={68 - 24}
              fill="white"
              fillOpacity={1}
              stroke="black"
            />{' '}
            {/* Left 6-yard Box */}
            <ReferenceArea
              x1={99}
              x2={105}
              y1={24}
              y2={68 - 24}
              fill="white"
              fillOpacity={1}
              stroke="black"
            />{' '}
            {/* Right 6-yard box */}
            <ReferenceDot
              x={52.5}
              y={34}
              r={0.5 * scale}
              fill="black"
              stroke="black"
            />{' '}
            {/* Centre Spot */}
            <ReferenceDot
              x={12}
              y={34}
              r={0.5 * scale}
              fill="black"
              stroke="black"
            />{' '}
            {/* Left Penalty Spot */}
            <ReferenceDot
              x={96}
              y={34}
              r={0.5 * scale}
              fill="black"
              stroke="black"
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
              stroke="black"
            />{' '}
            {/* <ReferenceLine x={52.5} y1={0} y2={68} stroke="black" />{' '} */}
            {/* Center Half */}
            <ReferenceArea
              x1={0}
              x2={0.1}
              y1={30}
              y2={68 - 30}
              fill="black"
              fillOpacity={1}
              stroke="black"
            />{' '}
            {/* Left Goal line */}
            <ReferenceArea
              x1={104.9}
              x2={105}
              y1={30}
              y2={68 - 30}
              fill="black"
              fillOpacity={1}
              stroke="black"
            />{' '}
            {/* Right Goal line */}
            <ReferenceArea
              x1={0}
              x2={105}
              y1={0}
              y2={68}
              fillOpacity={0}
              stroke="black"
            />{' '}
            {/* Pitch Outline */}
            <XAxis type="number" dataKey="x_norm" hide domain={[-2, 108]} />
            <YAxis type="number" dataKey="y_norm" hide domain={[-5, 73]} />
            <ZAxis range={[350, 350]} />
            <Tooltip />
            {props.gameDataY ? (
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
                  fill="#45aaf2"
                  isAnimationActive={false}
                  onClick={props.handleDotClick}
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
                  data={props.gameDataY.player_list_2}
                  fill="#a5b1c2"
                  isAnimationActive={false}
                  onClick={props.handleDotClick}
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
            ) : (
              <></>
            )}
            <Scatter
              name="Ball X"
              data={props.gameData.ball_list}
              fill="#eb3b5a"
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
              fill="#1976D2"
              isAnimationActive={false}
              onClick={props.handleDotClick}
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
              fill="#4b6584"
              isAnimationActive={false}
              onClick={props.handleDotClick}
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
          </ScatterChart>
        </ResponsiveContainer>
      </Grid>
      {/* <Grid
        item
        xs={3}
        style={{ background: 'white', padding: '12px 0px 0px 24px' }}
      >
        <Typography fontSize={12}>Target Team</Typography>
      </Grid>

      <Grid
        item
        xs={3}
        style={{
          background: 'white',
          padding: '12px 0px 0px 24px',
        }}
      >
        <Typography fontSize={12}>Opponent Team</Typography>
      </Grid>
      <Grid
        item
        xs={6}
        style={{ background: 'white', padding: '12px 0px 0px 24px' }}
      >
        <Typography fontSize={12}>Ball Team</Typography>
      </Grid> */}
    </Grid>
  );
}
