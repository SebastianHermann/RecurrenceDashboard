const DefaultState = {
  loading: false,
  tGroups: [],
  errorMsg: '',
};

const TGroupReducer = (state = DefaultState, action) => {
  switch (action.type) {
    case 'TGROUPS_LOADING':
      return {
        ...state,
        loading: true,
        errorMsg: '',
      };
    case 'TGROUPS_SUCCESS':
      return {
        ...state,
        loading: false,
        tGroups: action.payload,
        errorMsg: '',
      };

    case 'TGROUPS_FAIL':
      return {
        ...state,
        loading: false,
        errorMsg: 'Unable to get Tactical Groups Data',
      };

    default:
      return state;
  }
};
export default TGroupReducer;
