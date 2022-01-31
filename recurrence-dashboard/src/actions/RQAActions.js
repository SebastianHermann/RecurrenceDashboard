import axios from 'axios';

export const GetRQA = (request) => async (dispatch) => {
  try {
    // dispatch({
    //   type: 'RQA_LOADING',
    // });
    const rqa = await axios.get(
      `http://127.0.0.1:5000/rp/${request._id.$oid}/rqa`
    );

    if (rqa.data.rr) {
      dispatch({
        type: 'RR_SUCCESS',
        payload: rqa.data.rr,
      });
    }
    if (rqa.data.det) {
      dispatch({
        type: 'DET_SUCCESS',
        payload: rqa.data.det,
      });
    }
    if (rqa.data.lam) {
      dispatch({
        type: 'LAM_SUCCESS',
        payload: rqa.data.lam,
      });
    }
    if (rqa.data.l) {
      dispatch({
        type: 'L_SUCCESS',
        payload: rqa.data.l,
      });
    }
    if (rqa.data.tt) {
      dispatch({
        type: 'TT_SUCCESS',
        payload: rqa.data.tt,
      });
    }
    if (rqa.data.entr) {
      dispatch({
        type: 'ENTR_SUCCESS',
        payload: rqa.data.entr,
      });
    }
    if (rqa.data['entr-v']) {
      dispatch({
        type: 'ENTRV_SUCCESS',
        payload: rqa.data['entr-v'],
      });
    }
    if (rqa.data.met1) {
      dispatch({
        type: 'MET1_SUCCESS',
        payload: rqa.data.met1,
      });
    }
    if (rqa.data.met2) {
      dispatch({
        type: 'MET2_SUCCESS',
        payload: rqa.data.met2,
      });
    }
    if (rqa.data.met3) {
      dispatch({
        type: 'MET3_SUCCESS',
        payload: rqa.data.met3,
      });
    }
    let condition =
      rqa.data.rr &&
      rqa.data.det &&
      rqa.data.lam &&
      rqa.data.tt &&
      rqa.data.l &&
      rqa.data.entr &&
      rqa.data['entr-v'] &&
      rqa.data.met1 &&
      rqa.data.met2 &&
      rqa.data.met3;
    if (condition) {
      dispatch({
        type: 'RQA_SUCCESS',
      });
    }
    console.log('Loading?', condition);
  } catch (e) {
    dispatch({
      type: 'RP_FAIL',
    });
  }
};

export const CreateRP = (request) => async (dispatch) => {
  try {
    dispatch({
      type: 'RP_LOADING',
    });
    dispatch({
      type: 'RQA_LOADING',
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

    let result = { ...rp.data, entrV: rp.data['entr-v'] };
    delete result['entr-v'];

    dispatch({
      type: 'RP_SUCCESS',
      payload: result,
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
    dispatch({
      type: 'RQA_LOADING',
    });
    const rp = await axios.get(`http://127.0.0.1:5000/rp/${request._id.$oid}`);

    let result = { ...rp.data, entrV: rp.data['entr-v'] };
    delete result['entr-v'];

    dispatch({
      type: 'RP_SUCCESS',
      payload: result,
    });
    dispatch({
      type: 'RQA_SUCCESS',
    });
  } catch (e) {
    dispatch({
      type: 'RP_FAIL',
    });
  }
};
