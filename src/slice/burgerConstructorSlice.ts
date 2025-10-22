import { TConstructorIngredient, TIngredient } from '@utils-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TBurgerIngredientSlice = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
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
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const ingredient: TConstructorIngredient = {
        ...action.payload,
        id: crypto.randomUUID()
      };

      if (ingredient.type === 'bun') state.bun = ingredient;
      else state.ingredients.push(ingredient);
    }
  }
});

export const { addIngredient } = burgerConstructorSlice.actions;
export default burgerConstructorSlice.reducer;
