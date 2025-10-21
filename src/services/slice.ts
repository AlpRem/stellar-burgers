import { TIngredient } from '@utils-types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import * as console from 'node:console';

type IngredientsState = {
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
  isLoading: boolean;
  isError: boolean;
};

const initialState: IngredientsState = {
  buns: [],
  mains: [],
  sauces: [],
  isLoading: false,
  isError: false
};

export const fetchIngredient = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      return await getIngredientsApi();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const slice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredient.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchIngredient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.buns = action.payload.filter((data) => data.type === 'bun');
        state.mains = action.payload.filter((data) => data.type === 'main');
        state.sauces = action.payload.filter((data) => data.type === 'sauce');
      })
      .addCase(fetchIngredient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  }
});

export default slice.reducer;
