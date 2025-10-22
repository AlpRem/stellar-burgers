import { TIngredient } from '@utils-types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';

type TBurgerIngredientSlice = {
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
  currentIngredient: TIngredient | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TBurgerIngredientSlice = {
  buns: [],
  mains: [],
  sauces: [],
  currentIngredient: null,
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

export const fetchGetIngredientById = createAsyncThunk<
  TIngredient,
  string,
  { rejectValue: string }
>('ingredients/fetchById', async (id, { rejectWithValue }) => {
  try {
    const allIngredients = await getIngredientsApi();
    const ingredient = allIngredients.find((item) => item._id === id);
    if (!ingredient) return rejectWithValue('Данные не найдены');
    return ingredient;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

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
    builder
      .addCase(fetchGetIngredientById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGetIngredientById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.currentIngredient = action.payload;
      })
      .addCase(fetchGetIngredientById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export default burgerIngredientSlice.reducer;
