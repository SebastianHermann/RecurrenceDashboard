import axios from 'axios';

export const GetRPSInfo = (request) => async (dispatch) => {
  try {
    dispatch({
      type: 'RPS_LOADING',
    });
    console.log('Getting Info');
    const rps = await axios.get(
      `http://127.0.0.1:5000/rps/${request.project_id}`
    );

    dispatch({
      type: 'RPS_SUCCESS',
      payload: rps.data,
    });
  } catch (e) {
    dispatch({
      type: 'RPS_FAIL',
    });
  }
};

export const CreateRP = (request) => async (dispatch) => {
  try {
    dispatch({
      type: 'RP_LOADING',
    });
    console.log('RP Requested', request);
    let payload = {
      game_id: request.game_id,
      project_id: request.project_id,
      rp_title: request.rp_title,
      rp_type: request.rp_type,
      target_tactical_group_id: request.target_tactical_group_id,
      target_group_1: request.target_group_1,
      target_group_2_id: request.target_group_2_id,
      target_group_2: request.target_group_2,
      cross_tactical_group_id: request.cross_tactical_group_id,
      cross_group_1: request.cross_group_1,
      cross_group_2_id: request.cross_group_2_id,
      cross_group_2: request.cross_group_2,
      threshold: request.threshold,
      calc_logic: request.calc_logic,
      downsample: request.downsample,
      mirror_cord: request.mirror_cord,
    };

    const rp = await axios.post(
      `http://localhost:5000/rps/${request.project_id}`,
      payload
    );

    dispatch({
      type: 'RP_SUCCESS',
      payload: rp.data,
    });
  } catch (e) {
    dispatch({
      type: 'RP_FAIL',
    });
  }
};

export const GetRP = (request) => async (dispatch) => {
  try {
    dispatch({
      type: 'RP_LOADING',
    });
    const rp = await axios.get(`http://127.0.0.1:5000/rp/${request._id.$oid}`);

    dispatch({
      type: 'RP_SUCCESS',
      payload: rp.data,
    });
  } catch (e) {
    dispatch({
      type: 'RP_FAIL',
    });
  }
};
