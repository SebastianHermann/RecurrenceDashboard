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

export default function EventList(props) {
  const { events } = useSelector((state) => state.Events);
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
        <Grid item xs={12}></Grid>
        <Grid item xs={12}></Grid>
        {events.length !== 0 ? (
          events.map((item) => (
            <ListItem>
              <Grid container item xs={12}>
                <Grid item xs={3}>
                  <div>
                    <ListItemButton
                      onClick={(event) => handleClick(event, item)}
                      style={{ padding: '0 6px', width: 'fit-content' }}
                    >
                      <ListItemText primary={secondsConverter(item.second)} />
                    </ListItemButton>
                  </div>
                </Grid>
                <Grid item xs={8}>
                  <ListItemText primary={item.title} />
                </Grid>
                <Grid item xs={1}>
                  {selectedEvent ? (
                    selectedEvent._id.$oid === item._id.$oid ? (
                      <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() => setSelectedEvent()}
                      >
                        <ExpandLess />
                      </IconButton>
                    ) : (
                      <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() => setSelectedEvent(item)}
                      >
                        <ExpandMore />
                      </IconButton>
                    )
                  ) : (
                    <IconButton
                      aria-label="delete"
                      size="small"
                      onClick={() => setSelectedEvent(item)}
                    >
                      <ExpandMore />
                    </IconButton>
                  )}
                </Grid>
                <Grid item xs={3}></Grid>
                <Grid item xs={9}>
                  <Collapse
                    in={
                      selectedEvent && selectedEvent._id.$oid === item._id.$oid
                    }
                    timeout="auto"
                    unmountOnExit
                  >
                    <Typography
                      variant="body2"
                      component="div"
                      color="text.secondary"
                    >
                      {item.description}
                    </Typography>
                  </Collapse>
                </Grid>
                <Grid item xs={12}>
                  <Divider style={{ paddingTop: '6px' }} />
                </Grid>
              </Grid>
            </ListItem>
          ))
        ) : (
          <></>
        )}
      </Grid>
    </>
  );
}
