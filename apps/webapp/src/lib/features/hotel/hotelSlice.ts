import { createSlice } from '@reduxjs/toolkit';

const hotelSlice = createSlice({
  name: 'hotel',
  initialState: { hotel: null },
  reducers: {
    updateHotel(state, action) {
      const resource = action.payload;
      state.hotel = resource;
    },
  },
});

export default hotelSlice;
