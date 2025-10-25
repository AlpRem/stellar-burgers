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
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      const ingredient = action.payload;
      if (ingredient.type === 'bun') state.bun = ingredient;
      else state.ingredients.push(ingredient);
    },

    deleteIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },

    moveIngredient: (
      state,
      action: PayloadAction<{ currentIndex: number; newIndex: number }>
    ) => {
      const { currentIndex, newIndex } = action.payload;
      if (
        currentIndex === newIndex ||
        currentIndex < 0 ||
        currentIndex >= state.ingredients.length
      )
        return;
      const movedIngredient = state.ingredients.splice(currentIndex, 1)[0];
      state.ingredients.splice(newIndex, 0, movedIngredient);
    },

    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredient,
  deleteIngredient,
  moveIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;
export default burgerConstructorSlice.reducer;
