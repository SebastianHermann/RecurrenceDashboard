const DefaultState = {
  loadingEvents: false,
  events: [],
  errorMsg: '',
};

const EventsReducer = (state = DefaultState, action) => {
  switch (action.type) {
    case 'EVENTS_LOADING':
      return {
        ...state,
        loadingEvents: true,
        errorMsg: '',
      };
    case 'EVENTS_SUCCESS':
      return {
        ...state,
        loadingEvents: false,
        events: action.payload,
        errorMsg: '',
      };

    case 'EVENTS_FAIL':
      return {
        ...state,
        loadingEvents: false,
        errorMsg: 'Unable to get EVENTS',
      };

    default:
      return state;
  }
};
export default EventsReducer;
