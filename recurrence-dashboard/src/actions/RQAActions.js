import axios from 'axios';

export const GetRQA = (request) => async (dispatch) => {
  console.log('GETRQA()', request);

  try {
    // dispatch({
    //   type: 'RQA_LOADING',
    // });
    const rqa = await axios.get(
      `http://127.0.0.1:5000/rp/${request._id.$oid}/rqa`
    );

    console.log('RESULT GETRQA() FROM /RP/RP_ID/RQA', rqa);

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
    if (rqa.data.frp1) {
      dispatch({
        type: 'FRP1_SUCCESS',
        payload: rqa.data.frp1,
      });
    }
    if (rqa.data.frp2) {
      dispatch({
        type: 'FRP2_SUCCESS',
        payload: rqa.data.frp2,
      });
    }
    if (rqa.data.frp3) {
      dispatch({
        type: 'FRP3_SUCCESS',
        payload: rqa.data.frp3,
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
      rqa.data.frp1 &&
      rqa.data.frp2 &&
      rqa.data.frp3
        ? true
        : false;
    console.log(
      'condition',
      condition,
      'all parameters: ',
      rqa.data.rr,
      rqa.data.det,
      rqa.data.lam,
      rqa.data.tt,
      rqa.data.l,
      rqa.data.entr,
      rqa.data['entr-v'],
      rqa.data.frp1,
      rqa.data.frp2,
      rqa.data.frp3
    );
    if (condition) {
      dispatch({
        type: 'RQA_SUCCESS',
      });
    }

    // if (rqa.data.) {
    //   dispatch({
    //     type: 'RQA_SUCCESS',
    //   });
    // }

    // get meta rp
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
    console.log('result is there, RP_SUCESS should be submitted', result);

    dispatch({
      type: 'RP_SUCCESS',
      payload: result,
    });

    dispatch({
      type: 'RQ_META_LOADING',
    });
    // Create Meta stable data, dispatch result under metastable table
    const meta_rp = await axios.post(
      `http://localhost:5000/rp/${result._id.$oid}/meta`,
      payload
    );

    let meta_result = { ...meta_rp.data };

    dispatch({
      type: 'RQ_META_SUCCESS',
      payload: meta_result,
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
    dispatch({
      type: 'RQ_META_LOADING',
    });

    const rp = await axios.get(`http://127.0.0.1:5000/rp/${request._id.$oid}`);

    let result = { ...rp.data, entrV: rp.data['entr-v'] };
    delete result['entr-v'];

    dispatch({
      type: 'RP_SUCCESS',
      payload: result,
    });

    // check if all data is available
    console.log('RETURNING RP_SUCCESS FROM GETRP() /RP/RP_ID', result);

    const meta_rp = await axios.get(
      `http://127.0.0.1:5000/rp/${request._id.$oid}/meta`
    );

    let meta_result = { ...meta_rp.data };
    console.log(
      'RETURNING RQ_META_SUCCESS FROM GETRP() /RP/RP_ID/META',
      meta_result
    );

    dispatch({
      type: 'RQ_META_SUCCESS',
      payload: meta_result,
    });
  } catch (e) {
    dispatch({
      type: 'RP_FAIL',
    });
  }
};

export const ClearRQA = () => async (dispatch) => {
  try {
    dispatch({
      type: 'RP_FAIL',
    });

    dispatch({
      type: 'RP_CLEAR',
    });
  } catch (e) {
    dispatch({
      type: 'RP_FAIL',
    });
  }
};
