const DefaultState = {
  rqasLoading: false,
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
  met1: '',
  met1Loading: false,
  met2: '',
  met2Loading: false,
  met3: '',
  met3Loading: false,
  errorMsg: '',
};

const RQAReducer = (state = DefaultState, action) => {
  switch (action.type) {
    case 'RQA_LOADING':
      return {
        ...state,
        rqasLoading: true,
        rrLoading: true,
        detLoading: true,
        lamLoading: true,
        lLoading: true,
        ttLoading: true,
        entrLoading: true,
        entrVLoading: true,
        met1Loading: true,
        met2Loading: true,
        met3Loading: true,
        errorMsg: '',
      };
    case 'RP_LOADING':
      return {
        ...state,
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
    case 'MET1_SUCCESS':
      return {
        ...state,
        met1Loading: false,
        met1: action.payload,
        errorMsg: '',
      };
    case 'MET2_SUCCESS':
      return {
        ...state,
        met2Loading: false,
        met2: action.payload,
        errorMsg: '',
      };
    case 'MET3_SUCCESS':
      return {
        ...state,
        met3Loading: false,
        met3: action.payload,
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
        rqasLoading: false,
        rrLoading: false,
        detLoading: false,
        lamLoading: false,
        lLoading: false,
        ttLoading: false,
        entrLoading: false,
        entrVLoading: false,
        met1Loading: false,
        met2Loading: false,
        met3Loading: false,
        errorMsg: '',
      };

    default:
      return state;
  }
};
export default RQAReducer;
