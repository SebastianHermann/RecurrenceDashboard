const DefaultState = {
  loading: false,
  teams: [],
  errorMsg: '',
};

const TeamsReducer = (state = DefaultState, action) => {
  switch (action.type) {
    case 'TEAMS_LOADING':
      return {
        ...state,
        loading: true,
        errorMsg: '',
      };
    case 'TEAMS_SUCCESS':
      return {
        ...state,
        loading: false,
        teams: action.payload,
        errorMsg: '',
      };

    case 'TEAMS_FAIL':
      return {
        ...state,
        loading: false,
        errorMsg: 'Unable to get teams',
      };

    default:
      return state;
  }
};
export default TeamsReducer;
