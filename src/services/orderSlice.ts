import { TOrder } from '@utils-types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';

type TOrderSlice = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  currentOrder: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderSlice = {
  orders: [],
  total: 0,
  totalToday: 0,
  currentOrder: null,
  isLoading: false,
  error: null
};

export const fetchGetListOrders = createAsyncThunk(
  'feed/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await getFeedsApi();
    } catch {
      return rejectWithValue('Ошибка получения списка заказов');
    }
  }
);

export const fetchFindByIdOrder = createAsyncThunk<TOrder, number>(
  'order/fetchByNumber',
  async (number, { rejectWithValue }) => {
    try {
      const res = await getOrderByNumberApi(number);
      return res.orders[0];
    } catch {
      return rejectWithValue('Ошибка получения заказа по ключу');
    }
  }
);

export const fetchSaveOrder = createAsyncThunk<
  TOrder,
  { bun: { _id: string }; ingredients: { _id: string }[] },
  { rejectValue: string }
>('orders/create', async ({ bun, ingredients }, { rejectWithValue }) => {
  try {
    const ids = [bun._id, ...ingredients.map((i) => i._id), bun._id];
    const res = await orderBurgerApi(ids);
    return res.order;
  } catch {
    return rejectWithValue('Ошибка сохранения заказа');
  }
});

export const fetchFindByUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await getOrdersApi();
    } catch {
      return rejectWithValue('Ошибка получения заказов пользователя');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrder(state) {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetListOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGetListOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchGetListOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchFindByIdOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFindByIdOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.currentOrder = action.payload;
      })
      .addCase(fetchFindByIdOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchSaveOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSaveOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.currentOrder = action.payload;
      })
      .addCase(fetchSaveOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchFindByUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFindByUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.orders = action.payload;
      })
      .addCase(fetchFindByUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
