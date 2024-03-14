import { combineReducers } from 'redux';
import hotelSlice from './features/hotel/hotelSlice';

const rootReducer = combineReducers({
  hotel: hotelSlice.reducer,
});

export default rootReducer;
