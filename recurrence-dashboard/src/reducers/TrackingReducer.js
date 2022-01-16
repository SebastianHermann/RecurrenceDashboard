const DefaultState = {
  loading: false,
  trackingData: [],
  errorMsg: '',
};

const TrackingReducer = (state = DefaultState, action) => {
  switch (action.type) {
    case 'TRACKING_LOADING':
      return {
        ...state,
        loading: true,
        errorMsg: '',
      };
    case 'TRACKING_SUCCESS':
      return {
        ...state,
        loading: false,
        trackingData: action.payload,
        errorMsg: '',
      };

    case 'TRACKING_FAIL':
      return {
        ...state,
        loading: false,
        errorMsg: 'Unable to get Tracking Data',
      };

    default:
      return state;
  }
};
export default TrackingReducer;
