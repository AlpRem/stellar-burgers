import { configureStore } from '@reduxjs/toolkit';
import burgerIngredientReducer from '../slice/burgerIngredientSlice';
import burgerConstructorReducer from '../slice/burgerConstructorSlice';
import orderReducer from '../slice/orderSlice';
import UserAuthReducer from '../slice/userAuthSlice';

export const store = configureStore({
  reducer: {
    burgerIngredient: burgerIngredientReducer,
    burgerConstructor: burgerConstructorReducer,
    orders: orderReducer,
    userAuth: UserAuthReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
