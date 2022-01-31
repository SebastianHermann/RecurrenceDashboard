import { combineReducers } from 'redux';
import EventsReducer from './EventsReducer';
import ProjectReducer from './ProjectReducer';
import RPReducer from './RPReducer';
import RQAReducer from './RQAReducer';
import StatsReducer from './StatsReducer';
import TeamsReducer from './TeamsReducer';
import TGroupReducer from './TGroupReducer';
import TrackingReducer from './TrackingReducer';

const RootReducer = combineReducers({
  Projects: ProjectReducer,
  Teams: TeamsReducer,
  Tracking: TrackingReducer,
  TGroups: TGroupReducer,
  RecurrenceAnalysis: RPReducer,
  Stats: StatsReducer,
  Events: EventsReducer,
  RQA: RQAReducer,
});

export default RootReducer;
