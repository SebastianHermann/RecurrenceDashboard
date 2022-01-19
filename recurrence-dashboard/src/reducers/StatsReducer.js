const DefaultState = {
  loadingStats: false,
  stats: [],
  loadingAllStats: false,
  allStats: [],
  errorMsg: '',
};

const StatsReducer = (state = DefaultState, action) => {
  switch (action.type) {
    case 'STATS_LOADING':
      return {
        ...state,
        loadingStats: true,
        errorMsg: '',
      };
    case 'STATS_SUCCESS':
      return {
        ...state,
        loadingStats: false,
        stats: action.payload,
        errorMsg: '',
      };

    case 'STATS_FAIL':
      return {
        ...state,
        loadingStats: false,
        errorMsg: 'Unable to get stats',
      };
    case 'ALL_STATS_LOADING':
      return {
        ...state,
        loadingAllStats: true,
        errorMsg: '',
      };
    case 'ALL_STATS_SUCCESS':
      return {
        ...state,
        loadingAllStats: false,
        allStats: action.payload,
        errorMsg: '',
      };

    case 'ALL_STATS_FAIL':
      return {
        ...state,
        loadingAllStats: false,
        errorMsg: 'Unable to get stats',
      };

    default:
      return state;
  }
};
export default StatsReducer;
