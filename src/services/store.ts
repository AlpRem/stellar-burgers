import { configureStore } from '@reduxjs/toolkit';
import burgerIngredientReducer from '../slice/BurgerIngredientSlice';

export const store = configureStore({
  reducer: {
    burgerIngredient: burgerIngredientReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
