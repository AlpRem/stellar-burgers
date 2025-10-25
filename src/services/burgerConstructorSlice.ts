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
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const ingredient = action.payload;
        if (ingredient.type === 'bun') state.bun = ingredient;
        else state.ingredients.push(ingredient);
        localStorage.setItem('burger', JSON.stringify(state));
      },
      prepare: (ingredients: TIngredient) => ({
        payload: {
          ...ingredients,
          id: crypto.randomUUID()
        } as TConstructorIngredient
      })
    },

    deleteIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
      localStorage.setItem('burger', JSON.stringify(state));
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
      localStorage.setItem('burger', JSON.stringify(state));
    },

    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
      localStorage.removeItem('burger');
    },

    saveConstructorToStore: (
      state,
      action: PayloadAction<TBurgerIngredientSlice>
    ) => {
      state.bun = action.payload.bun;
      state.ingredients = action.payload.ingredients;
    }
  }
});

export const {
  addIngredient,
  deleteIngredient,
  moveIngredient,
  clearConstructor,
  saveConstructorToStore
} = burgerConstructorSlice.actions;
export default burgerConstructorSlice.reducer;
