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
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function Pitch(props) {
  const [halftime, setHalftime] = useState('full');
  const [showNumbers, setShowNumbers] = useState(true);

  const handleHalftimeChange = (event, halftime) => {
    setHalftime(halftime);
  };

  useState(() => {
    console.log('Game selection changed', props.gameData);
  }, [halftime]);

  const scale = 6 * 0.875;
  return (
    <Grid container item spacing={0} style={{ marginTop: '2%' }}>
      <Grid item xs={12} style={{ paddingLeft: '2%' }}>
        <Typography variant="h6" gutterBottom component="div">
          View Data
        </Typography>
      </Grid>
      <Grid item xs={8} style={{ paddingLeft: '2%' }}>
        <ToggleButtonGroup
          color="primary"
          value={halftime}
          exclusive
          onChange={handleHalftimeChange}
          size="small"
        >
          <ToggleButton value="full">Full Game</ToggleButton>
          <ToggleButton value="first">First Half</ToggleButton>
          <ToggleButton value="second">Second Half</ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Grid item xs={4} style={{ paddingRight: '4%' }}>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={showNumbers}
                onChange={() => setShowNumbers(!showNumbers)}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
            label="Show Numbers"
            labelPlacement="start"
          />
        </FormGroup>
      </Grid>
      <Grid item xs={12}>
        <ResponsiveContainer>
          <ScatterChart
            width={120 * scale}
            height={80 * scale}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
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
            <ReferenceLine x={52.5} stroke="black" /> {/* Center Half */}
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
            <XAxis type="number" dataKey="x_norm" hide domain={[0, 105]} />
            <YAxis type="number" dataKey="y_norm" hide domain={[0, 68]} />
            <ZAxis range={[400, 400]} />
            <Tooltip />
            <Legend />
            <Scatter
              name="Target Team"
              data={props.gameData
                .filter((player) => player.Halftime === halftime)
                .filter((player) => player.target_group_id === 1)}
              fill="#1976d2"
              animation
              // animationDuration={playSpeed * 1.04}
              // animationEasing="linear"
              isAnimationActive={false}
            >
              {showNumbers ? (
                <LabelList
                  dataKey="mapped_id"
                  style={{ pointerEvents: 'none' }}
                  fill="#ffffff"
                />
              ) : (
                <></>
              )}
            </Scatter>
            <Scatter
              name="Opponent Team"
              data={props.gameData
                .filter((player) => player.Halftime === halftime)
                .filter((player) => player.target_group_id === 2)}
              fill="#dee3ed"
              // animationDuration={playSpeed * 1.04}
              // animationEasing="linear"
              isAnimationActive={false}
            >
              {showNumbers ? (
                <LabelList
                  dataKey="mapped_id"
                  style={{ pointerEvents: 'none' }}
                  fill="#1976d2"
                />
              ) : (
                <></>
              )}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  );
}
