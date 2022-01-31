import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { ListItem, Typography } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import Button from '@mui/material/Button';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';

export default function EventTimeLine(props) {
  const { loadingEvents, events } = useSelector((state) => state.Events);

  const [selectedEvent, setSelectedEvent] = useState();

  const handleClick = (event, value) => {
    if (!selectedEvent) {
      setSelectedEvent(value);
      props.handleEventSecond(value.second);
    } else if (selectedEvent._id.$oid === value._id.$oid) {
      setSelectedEvent();
    } else {
      setSelectedEvent(value);
      props.handleEventSecond(value.second);
    }
  };

  const secondsConverter = (sec) => {
    let minutes = Math.floor(sec / 60); // get minutes
    let seconds = sec - minutes * 60;
    let m_result = minutes < 10 ? '0' + minutes : minutes;
    let s_result = seconds < 10 ? '0' + seconds : seconds;
    return String(m_result + ':' + s_result);
  };

  return (
    <>
      <Grid container item xs={12}>
        {!loadingEvents ? (
          events
            .sort((a, b) => a.second - b.second)
            .map((item) => (
              <Grid
                key={item._id.$oid}
                item
                container
                xs={12}
                style={{ marginBottom: '16px' }}
              >
                <Grid item lg={3} xl={2}>
                  <Button
                    size="small"
                    className="tertiary-button"
                    onClick={(event) => handleClick(event, item)}
                  >
                    {secondsConverter(item.second)}
                  </Button>
                  <Divider
                    orientation="vertical"
                    style={{
                      height: '100%',
                      // marginLeft: '29px',
                      borderRightWidth: '2px',
                      borderColor: '#e1edf9',
                      width: '29px',
                    }}
                  />
                </Grid>

                <Grid item lg={9} xl={10}>
                  <Typography
                    className="title-5"
                    style={{ alignSelf: 'center', marginLeft: '16px' }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    className="subtitle-2"
                    style={{ alignSelf: 'center', marginLeft: '16px' }}
                  >
                    {item.description}
                  </Typography>
                </Grid>
              </Grid>
            ))
        ) : (
          <></>
        )}
      </Grid>
    </>
  );
}
