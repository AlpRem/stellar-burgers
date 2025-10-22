import { TIngredient } from '@utils-types';
import { createSlice } from '@reduxjs/toolkit';

type TBurgerIngredientSlice = {
  bun: TIngredient | null;
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TBurgerIngredientSlice = {
  bun: null,
  ingredients: [],
  isLoading: false,
  error: null
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action) => {
      if (action.payload.type === 'bun') state.bun = action.payload;
      else state.ingredients.push(action.payload);
    }
  }
});

export const { addIngredient } = burgerConstructorSlice.actions;
export default burgerConstructorSlice.reducer;
