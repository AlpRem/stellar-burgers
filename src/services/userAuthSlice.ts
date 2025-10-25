import { TUser } from '@utils-types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { setCookie } from '../utils/cookie';

type TUserSlice = {
  user: TUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserSlice = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

export const fetchGetUser = createAsyncThunk<
  TUser,
  void,
  { rejectValue: string }
>('userAuth/fetchUser', async (_, { rejectWithValue }) => {
  try {
    const res = await getUserApi();
    return res.user;
  } catch {
    return rejectWithValue('Ошибка получения пользователя');
  }
});

export const fetchLogin = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: string }
>('userAuth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await loginUserApi(data);
    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);
    return res.user;
  } catch {
    return rejectWithValue('Ошибка авторизации');
  }
});

export const fetchRegister = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('userAuth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await registerUserApi(data);
    return res.user;
  } catch {
    // if (err instanceof Error) return rejectWithValue(err.message);
    return rejectWithValue('Ошибка создания пользователя');
  }
});

export const fetchLogout = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('userAuth/logout', async (_, { rejectWithValue }) => {
  try {
    await logoutApi();
    localStorage.removeItem('refreshToken');
    document.cookie = 'accessToken=; Max-Age=0; path=/;';
    return;
  } catch {
    return rejectWithValue('Ошибка разлогинивание');
  }
});

export const fetchUpdateUser = createAsyncThunk<
  TUser,
  Partial<{ name: string; email: string; password: string }>,
  { rejectValue: string }
>('userAuth/updateUser', async (userData, { rejectWithValue }) => {
  try {
    const res = await updateUserApi(userData);
    return res.user;
  } catch {
    return rejectWithValue('Ошибка обновления пользователя');
  }
});

export const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchRegister.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRegister.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchRegister.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchGetUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGetUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchGetUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
      });

    builder
      .addCase(fetchLogout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLogout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchLogout.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchUpdateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUpdateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(fetchUpdateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export default userAuthSlice.reducer;
