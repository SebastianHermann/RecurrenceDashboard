const DefaultState = {
  rpsLoading: false,
  rps: [],
  selectedRPLoading: false,
  selectedRP: {},
  errorMsg: '',
};

const RPReducer = (state = DefaultState, action) => {
  switch (action.type) {
    case 'RPS_LOADING':
      return {
        ...state,
        rpsLoading: true,
        errorMsg: '',
      };
    case 'RPS_SUCCESS':
      return {
        ...state,
        rpsLoading: false,
        rps: action.payload,
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
        selectedRP: action.payload,
        errorMsg: '',
      };
    case 'RPS_CLEAR':
      return {
        ...DefaultState,
      };

    case 'RPS_FAIL':
      return {
        ...state,
        rpsLoading: false,
        errorMsg: 'Unable to get Recurrence Plot Information',
      };
    case 'RP_FAIL':
      return {
        ...state,
        selectedRPLoading: false,
        errorMsg: 'Unable to get Recurrence Plot Data',
      };

    default:
      return state;
  }
};
export default RPReducer;
