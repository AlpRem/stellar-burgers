import { combineReducers, configureStore } from '@reduxjs/toolkit';
import burgerIngredientReducer from './burgerIngredientSlice';
import burgerConstructorReducer from './burgerConstructorSlice';
import orderReducer from './orderSlice';
import userAuthReducer from './userAuthSlice';

export const rootReducer = combineReducers({
  burgerIngredient: burgerIngredientReducer,
  burgerConstructor: burgerConstructorReducer,
  orders: orderReducer,
  userAuth: userAuthReducer
});

export const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
