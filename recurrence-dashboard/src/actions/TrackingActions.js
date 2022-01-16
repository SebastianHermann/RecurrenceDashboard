import axios from 'axios';

export const GetTrackingData = (request) => async (dispatch) => {
  try {
    dispatch({
      type: 'TRACKING_LOADING',
    });

    const trackingData = await axios.get(
      `http://127.0.0.1:5000/meta/tracking?game_id=${request.game_id}`
    );
    console.log('<!Tracking data from server', trackingData.data);
    dispatch({
      type: 'TRACKING_SUCCESS',
      payload: trackingData.data,
    });
  } catch (e) {
    dispatch({
      type: 'TRACKING_FAIL',
    });
  }
};
