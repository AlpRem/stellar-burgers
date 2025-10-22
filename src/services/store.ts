import { configureStore } from '@reduxjs/toolkit';
import burgerIngredientReducer from '../slice/burgerIngredientSlice';
import burgerConstructorReducer from '../slice/burgerConstructorSlice';

export const store = configureStore({
  reducer: {
    burgerIngredient: burgerIngredientReducer,
    burgerConstructor: burgerConstructorReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
