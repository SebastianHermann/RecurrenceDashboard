const DefaultState = {
  loading: false,
  user: {},
  errorMsg: '',
};

const UserReducer = (state = DefaultState, action) => {
  switch (action.type) {
    case 'USER_LOADING':
      return {
        ...state,
        loading: true,
        errorMsg: '',
      };
    case 'USER_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload,
        errorMsg: '',
      };

    case 'USER_FAIL':
      return {
        ...state,
        loading: false,
        errorMsg: 'Unable to get USER',
      };

    default:
      return state;
  }
};
export default ProjectReducer;
