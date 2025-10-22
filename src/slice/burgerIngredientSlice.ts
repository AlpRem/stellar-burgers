import { TIngredient } from '@utils-types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';

type BurgerIngredientSlice = {
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: BurgerIngredientSlice = {
  buns: [],
  mains: [],
  sauces: [],
  isLoading: false,
  error: null
};

export const fetchGetBurgerIngredient = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      return await getIngredientsApi();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const burgerIngredientSlice = createSlice({
  name: 'burgerIngredient',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetBurgerIngredient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGetBurgerIngredient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.buns = action.payload.filter((data) => data.type === 'bun');
        state.mains = action.payload.filter((data) => data.type === 'main');
        state.sauces = action.payload.filter((data) => data.type === 'sauce');
      })
      .addCase(fetchGetBurgerIngredient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export default burgerIngredientSlice.reducer;
