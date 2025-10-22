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
      const tempIngredients = [...state.ingredients];
      const [movedIngredients] = tempIngredients.splice(currentIndex, 1);
      tempIngredients.splice(newIndex, 0, movedIngredients);
      state.ingredients = tempIngredients;
    }
  }
});

export const { addIngredient, deleteIngredient, moveIngredient } =
  burgerConstructorSlice.actions;
export default burgerConstructorSlice.reducer;
