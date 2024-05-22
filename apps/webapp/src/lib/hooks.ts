import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  useStore,
} from 'react-redux';
import { AppDispatch, AppStore, RootState } from './store';
import { Dispatch } from 'react';
import { UnknownAction } from '@reduxjs/toolkit';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;
