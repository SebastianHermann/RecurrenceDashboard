const DefaultState = {
  loading: false,
  projects: [],
  errorMsg: '',
};

const ProjectReducer = (state = DefaultState, action) => {
  switch (action.type) {
    case 'PROJECTS_LOADING':
      return {
        ...state,
        loading: true,
        errorMsg: '',
      };
    case 'PROJECTS_SUCCESS':
      return {
        ...state,
        loading: false,
        projects: action.payload,
        errorMsg: '',
      };

    case 'PROJECTS_FAIL':
      return {
        ...state,
        loading: false,
        errorMsg: 'Unable to get projects',
      };

    default:
      return state;
  }
};
export default ProjectReducer;
