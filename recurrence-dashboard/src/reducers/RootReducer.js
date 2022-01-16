import { combineReducers } from 'redux';
import ProjectReducer from './ProjectReducer';
import RPReducer from './RPReducer';
import TeamsReducer from './TeamsReducer';
import TGroupReducer from './TGroupReducer';
import TrackingReducer from './TrackingReducer';

const RootReducer = combineReducers({
  Projects: ProjectReducer,
  Teams: TeamsReducer,
  Tracking: TrackingReducer,
  TGroups: TGroupReducer,
  RecurrenceAnalysis: RPReducer,
});

export default RootReducer;
