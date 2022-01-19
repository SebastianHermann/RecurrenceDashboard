import axios from 'axios';

export const GetStats =
  (game_id = null) =>
  async (dispatch) => {
    try {
      dispatch({
        type: 'STATS_LOADING',
      });

      const stats = await axios.get(
        `http://127.0.0.1:5000/meta/stats?game_id=${game_id}`
      );

      dispatch({
        type: 'STATS_SUCCESS',
        payload: stats.data[0],
      });
    } catch (e) {
      dispatch({
        type: 'STATS_FAIL',
      });
    }
  };

export const GetAllStats = () => async (dispatch) => {
  try {
    dispatch({
      type: 'ALL_STATS_LOADING',
    });

    const stats = await axios.get(`http://127.0.0.1:5000/meta/stats`);

    dispatch({
      type: 'ALL_STATS_SUCCESS',
      payload: stats.data,
    });
  } catch (e) {
    dispatch({
      type: 'ALL_STATS_FAIL',
    });
  }
};
