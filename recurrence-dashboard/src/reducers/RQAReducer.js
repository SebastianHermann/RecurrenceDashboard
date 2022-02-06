const DefaultState = {
  rqa_id: '',
  selectedRPLoading: false,
  selectedRP: {},
  user_name: '',
  game_id: '',
  project_id: '',
  rp_title: '',
  rp_type: '',
  threshold: '',
  calc_logic: '',
  target_tactical_group_id: '',
  target_group_1: [],
  target_group_2: [],
  cross_tactical_group_id: '',
  cross_group_1: [],
  cross_group_2: [],
  mirror_cord: true,
  downsample: '',

  meta_rp_id: '',
  meta_min_rec_points: '',
  meta_white_space_width: '',
  meta_rp_data: [],
  meta_rp_data_loading: false,

  rr: '',
  rrLoading: false,
  det: '',
  detLoading: false,
  lam: '',
  lamLoading: false,
  l: '',
  lLoading: false,
  tt: '',
  ttLoading: false,
  entr: '',
  entrLoading: false,
  entrV: '',
  entrVLoading: false,
  frp1: '',
  frp1Loading: false,
  frp2: '',
  frp2Loading: false,
  frp3: '',
  frp3Loading: false,
  rqaMetaLoading: false,

  errorMsg: '',
};

const RQAReducer = (state = DefaultState, action) => {
  switch (action.type) {
    case 'RQA_LOADING':
      return {
        ...state,
        rrLoading: true,
        detLoading: true,
        lamLoading: true,
        lLoading: true,
        ttLoading: true,
        entrLoading: true,
        entrVLoading: true,
        frp1Loading: true,
        frp2Loading: true,
        frp3Loading: true,
        errorMsg: '',
      };
    case 'RP_LOADING':
      return {
        ...DefaultState,
        selectedRPLoading: true,
        errorMsg: '',
      };
    case 'RP_SUCCESS':
      return {
        ...state,
        selectedRPLoading: false,
        errorMsg: '',
        ...action.payload,
      };
    case 'RP_FAIL':
      return {
        ...state,
        selectedRPLoading: false,
        errorMsg: 'Unable to get Recurrence Plot Data',
      };
    case 'RR_SUCCESS':
      return {
        ...state,
        rrLoading: false,
        rr: action.payload,
        errorMsg: '',
      };
    case 'DET_SUCCESS':
      return {
        ...state,
        detLoading: false,
        det: action.payload,
        errorMsg: '',
      };
    case 'LAM_SUCCESS':
      return {
        ...state,
        lamLoading: false,
        lam: action.payload,
        errorMsg: '',
      };
    case 'L_SUCCESS':
      return {
        ...state,
        lLoading: false,
        l: action.payload,
        errorMsg: '',
      };
    case 'TT_SUCCESS':
      return {
        ...state,
        ttLoading: false,
        tt: action.payload,
        errorMsg: '',
      };
    case 'ENTR_SUCCESS':
      return {
        ...state,
        entrLoading: false,
        entr: action.payload,
        errorMsg: '',
      };
    case 'ENTRV_SUCCESS':
      return {
        ...state,
        entrVLoading: false,
        entrV: action.payload,
        errorMsg: '',
      };
    case 'FRP1_SUCCESS':
      return {
        ...state,
        frp1Loading: false,
        frp1: action.payload,
        errorMsg: '',
      };
    case 'FRP2_SUCCESS':
      return {
        ...state,
        frp2Loading: false,
        frp2: action.payload,
        errorMsg: '',
      };
    case 'FRP3_SUCCESS':
      return {
        ...state,
        frp3Loading: false,
        frp3: action.payload,
        errorMsg: '',
      };

    case 'RQA_ID_SUCCESS':
      return {
        ...state,
        rqa_id: action.payload,
        errorMsg: '',
      };

    case 'RQA_ALL_SUCCESS':
      return {
        ...state,
        rqasLoading: false,
        errorMsg: '',
      };
    case 'RQA_SUCCESS':
      return {
        ...state,
        rrLoading: false,
        detLoading: false,
        lamLoading: false,
        lLoading: false,
        ttLoading: false,
        entrLoading: false,
        entrVLoading: false,
        frp1Loading: false,
        frp2Loading: false,
        frp3Loading: false,
        errorMsg: '',
      };

    case 'RQ_META_LOADING':
      return {
        ...state,
        rqaMetaLoading: true,
        errorMsg: '',
      };
    case 'RQ_META_SUCCESS':
      return {
        ...state,
        ...action.payload,
        rqaMetaLoading: false,
        errorMsg: '',
      };

    default:
      return state;
  }
};
export default RQAReducer;
