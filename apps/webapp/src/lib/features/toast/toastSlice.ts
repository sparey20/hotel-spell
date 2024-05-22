import { ThunkAction, createSlice } from '@reduxjs/toolkit';

export type ToastState = {
  message: string;
  type: 'error' | 'success';
  isVisible: boolean;
};

const toastSlice = createSlice({
  name: 'toast',
  initialState: { toast: { message: '', type: 'error', isVisible: false } },
  reducers: {
    updateMessage(state, action) {
      state.toast.message = action.payload.message;
    },
    updateType(state, action) {
      state.toast.type = action.payload.type;
    },
    show(state) {
      state.toast.isVisible = true;
    },
    hide(state) {
      state.toast.isVisible = false;
    },
  },
});

export const showToastWithTimeout =
  (showToastWithTimeoutParams: {
    message: string;
    type: 'error' | 'success';
    timeout?: number;
  }): ThunkAction<void, ToastState, unknown, any> =>
  async (dispatch) => {
    const { message, timeout = 3000, type } = showToastWithTimeoutParams;
    const { updateMessage, show, hide, updateType } = toastSlice.actions;

    dispatch(updateType({ type }));
    dispatch(updateMessage({ message }));
    dispatch(show());

    setTimeout(() => {
      dispatch(hide());
    }, timeout);
  };

export default toastSlice;
