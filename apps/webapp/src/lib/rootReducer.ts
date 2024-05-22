import { combineReducers } from 'redux';
import hotelSlice from './features/hotel/hotelSlice';
import toastSlice from './features/toast/toastSlice';

const rootReducer = combineReducers({
  hotel: hotelSlice.reducer,
  toast: toastSlice.reducer,
});

export default rootReducer;
