import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

export default function StatsTable(props) {
  return (
    <>
      <Grid
        container
        item
        xs={12}
        style={{
          padding: '24px',
          border: '1px solid rgb(238, 238, 238)',
          borderRadius: '8px',
        }}
      >
        {props.stats ? (
          <>
            <Grid container item xs={12} alignItems={'center'}>
              <Grid
                item
                xs={5}
                style={{
                  fontSize: '20px',
                  fontWeight: '500',
                  color:
                    props.stats.HomeTeam === 'Leverkusen'
                      ? '#55a87b'
                      : '#4A5268',
                }}
              >
                {props.stats.HomeTeam}
              </Grid>
              <Grid
                item
                xs={2}
                style={{ fontWeight: '500', textAlign: 'center' }}
                className="title-5"
              >
                <span>
                  {props.stats.Full_Time_Home_Team_Goals +
                    ' : ' +
                    props.stats.Full_Time_Away_Team_Goals}
                </span>
                <br />
                <span style={{ color: 'darkgray', fontSize: '12px' }}>
                  {'(' +
                    props.stats.Half_Time_Home_Team_Goals +
                    ' : ' +
                    props.stats.Half_Time_Away_Team_Goals +
                    ')'}
                </span>
              </Grid>
              <Grid
                item
                xs={5}
                style={{
                  fontSize: '20px',
                  fontWeight: '500',
                  textAlign: 'right',
                  color:
                    props.stats.AwayTeam === 'Leverkusen'
                      ? '#55a87b'
                      : '#e01a4f',
                }}
              >
                {props.stats.AwayTeam}
              </Grid>
            </Grid>
            <Grid item xs={12} style={{ padding: '6px 0px' }}>
              <Divider />
            </Grid>

            <Grid
              item
              xs={2}
              style={{
                fontWeight: '500',
                color:
                  props.stats.HomeTeam === 'Leverkusen' ? '#55a87b' : '#e01a4f',
              }}
            >
              {props.stats.Home_Team_Shots}
            </Grid>
            <Grid
              item
              xs={8}
              style={{ textAlign: 'center' }}
              className="title-5"
            >
              Shots
            </Grid>
            <Grid
              item
              xs={2}
              style={{
                fontWeight: '500',
                color:
                  props.stats.AwayTeam === 'Leverkusen' ? '#55a87b' : '#e01a4f',
                textAlign: 'right',
              }}
            >
              {props.stats.Away_Team_Shots}
            </Grid>
            <Grid item xs={12} style={{ padding: '6px 0px' }}>
              <Divider />
            </Grid>

            <Grid
              item
              xs={2}
              style={{
                fontWeight: '500',
                color:
                  props.stats.HomeTeam === 'Leverkusen' ? '#55a87b' : '#e01a4f',
              }}
            >
              {props.stats.Home_Team_Shots_on_Target}
            </Grid>
            <Grid
              item
              xs={8}
              style={{ textAlign: 'center' }}
              className="title-5"
            >
              Shots on Target
            </Grid>
            <Grid
              item
              xs={2}
              style={{
                fontWeight: '500',
                color:
                  props.stats.AwayTeam === 'Leverkusen' ? '#55a87b' : '#e01a4f',
                textAlign: 'right',
              }}
            >
              {props.stats.Away_Team_Shots_on_Target}
            </Grid>
            <Grid item xs={12} style={{ padding: '6px 0px' }}>
              <Divider />
            </Grid>

            <Grid
              item
              xs={2}
              style={{
                fontWeight: '500',
                color:
                  props.stats.HomeTeam === 'Leverkusen' ? '#55a87b' : '#e01a4f',
              }}
            >
              {props.stats.Home_Team_Corners}
            </Grid>
            <Grid
              item
              xs={8}
              style={{ textAlign: 'center' }}
              className="title-5"
            >
              Corners
            </Grid>
            <Grid
              item
              xs={2}
              style={{
                fontWeight: '500',
                color:
                  props.stats.AwayTeam === 'Leverkusen' ? '#55a87b' : '#e01a4f',
                textAlign: 'right',
              }}
            >
              {props.stats.Away_Team_Corners}
            </Grid>
            <Grid item xs={12} style={{ padding: '6px 0px' }}>
              <Divider />
            </Grid>

            <Grid
              item
              xs={2}
              style={{
                fontWeight: '500',
                color:
                  props.stats.HomeTeam === 'Leverkusen' ? '#55a87b' : '#e01a4f',
              }}
            >
              {props.stats.Home_Team_Fouls_Committed}
            </Grid>
            <Grid
              item
              xs={8}
              style={{ textAlign: 'center' }}
              className="title-5"
            >
              Fouls Committed
            </Grid>
            <Grid
              item
              xs={2}
              style={{
                fontWeight: '500',
                color:
                  props.stats.AwayTeam === 'Leverkusen' ? '#55a87b' : '#e01a4f',
                textAlign: 'right',
              }}
            >
              {props.stats.Away_Team_Fouls_Committed}
            </Grid>
          </>
        ) : (
          <></>
        )}
      </Grid>
    </>
  );
}
