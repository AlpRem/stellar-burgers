import { combineReducers } from '@reduxjs/toolkit';
import reducer from './slice';

export const rootReducer = combineReducers({
  ingredients: reducer
});

export type RootState = ReturnType<typeof rootReducer>;
