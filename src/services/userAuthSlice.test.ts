import * as api from '@api';
import { configureStore } from '@reduxjs/toolkit';
import { TAuthResponse, TLoginData, TRegisterData } from '@api';
import userAuthReducer, {
  fetchGetUser,
  fetchLogin,
  fetchLogout,
  fetchRegister,
  fetchUpdateUser,
  TUserSlice
} from './userAuthSlice';
import { TUser } from '@utils-types';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

(global as any).localStorage = localStorageMock;
(global as any).document = { cookie: '' };
jest.mock('../utils/cookie', () => ({
  setCookie: jest.fn()
}));

import { setCookie } from '../utils/cookie';
import { fetchGetBurgerIngredient } from './burgerIngredientSlice';

describe('Проверяют редьюсер слайса для работы с пользователем', () => {
  const mockUser: TUser = {
    email: 'test@ya.ru',
    name: 'test'
  };

  const mockUpdateUser: TUser = {
    email: 'new_test@ya.ru',
    name: 'new_test'
  };

  const mockLoginData: TLoginData = {
    email: 'test@ya.ru',
    password: 'pass'
  };

  const mockRegister: TRegisterData = {
    email: 'test@ya.ru',
    name: 'test',
    password: 'pass'
  };

  const mockUpdate: TRegisterData = {
    email: 'new_test@ya.ru',
    name: 'new_test',
    password: 'new_pass'
  };

  const mockAuthResponse: TAuthResponse = {
    user: mockUser,
    refreshToken: 'refreshToken',
    accessToken: 'accessToken',
    success: true
  };

  const initialState: TUserSlice = {
    user: mockUser,
    isAuthenticated: true,
    isLoading: false,
    error: null
  };

  beforeEach(() => {
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    (setCookie as jest.Mock).mockClear();
  });

  it('Тест получения пользователя. Состояние pending ', async () => {
    const store = configureStore({ reducer: { userAuth: userAuthReducer } });
    store.dispatch({ type: fetchGetUser.pending.type });
    const { user, isAuthenticated, isLoading, error } =
      store.getState().userAuth;
    expect(user).toEqual(null);
    expect(isAuthenticated).toEqual(false);
    expect(isLoading).toEqual(true);
    expect(error).toEqual(null);
  });

  it('Тест получения пользователя. Состояние fulfilled ', async () => {
    jest.spyOn(api, 'getUserApi').mockResolvedValue(mockAuthResponse);
    const store = configureStore({ reducer: { userAuth: userAuthReducer } });
    await store.dispatch(fetchGetUser());
    const { user, isAuthenticated, isLoading, error } =
      store.getState().userAuth;
    expect(user).toEqual(mockUser);
    expect(isAuthenticated).toEqual(true);
    expect(isLoading).toEqual(false);
    expect(error).toEqual(null);
  });

  it('Тест получения пользователя. Состояние rejected ', async () => {
    const err = 'Ошибка получения пользователя';
    jest.spyOn(api, 'getUserApi').mockRejectedValue(new Error(err));
    const store = configureStore({ reducer: { userAuth: userAuthReducer } });
    await store.dispatch(fetchGetUser());
    const { user, isAuthenticated, isLoading, error } =
      store.getState().userAuth;
    expect(user).toEqual(null);
    expect(isAuthenticated).toEqual(false);
    expect(isLoading).toEqual(false);
    expect(error).toEqual(err);
  });

  it('Тест авторизации пользователя. Состояние pending ', async () => {
    const store = configureStore({ reducer: { userAuth: userAuthReducer } });
    store.dispatch({ type: fetchLogin.pending.type });
    const { user, isAuthenticated, isLoading, error } =
      store.getState().userAuth;
    expect(user).toEqual(null);
    expect(isAuthenticated).toEqual(false);
    expect(isLoading).toEqual(true);
    expect(error).toEqual(null);
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
    expect(setCookie).not.toHaveBeenCalled();
  });

  it('Тест авторизации пользователя. Состояние fulfilled ', async () => {
    jest.spyOn(api, 'loginUserApi').mockResolvedValue(mockAuthResponse);
    const store = configureStore({ reducer: { userAuth: userAuthReducer } });
    await store.dispatch(fetchLogin(mockLoginData));
    const { user, isAuthenticated, isLoading, error } =
      store.getState().userAuth;
    expect(user).toEqual(mockUser);
    expect(isAuthenticated).toEqual(true);
    expect(isLoading).toEqual(false);
    expect(error).toEqual(null);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'refreshToken',
      mockAuthResponse.refreshToken
    );
    expect(setCookie).toHaveBeenCalledWith(
      'accessToken',
      mockAuthResponse.accessToken
    );
  });

  it('Тест авторизации пользователя. Состояние rejected ', async () => {
    const err = 'Ошибка авторизации';
    jest.spyOn(api, 'loginUserApi').mockRejectedValue(new Error(err));
    const store = configureStore({ reducer: { userAuth: userAuthReducer } });
    await store.dispatch(fetchLogin(mockLoginData));
    const { user, isAuthenticated, isLoading, error } =
      store.getState().userAuth;
    expect(user).toEqual(null);
    expect(isAuthenticated).toEqual(false);
    expect(isLoading).toEqual(false);
    expect(error).toEqual(err);
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
    expect(setCookie).not.toHaveBeenCalled();
  });

  it('Тест регистрации пользователя. Состояние pending ', async () => {
    const store = configureStore({ reducer: { userAuth: userAuthReducer } });
    store.dispatch({ type: fetchRegister.pending.type });
    const { user, isAuthenticated, isLoading, error } =
      store.getState().userAuth;
    expect(user).toEqual(null);
    expect(isAuthenticated).toEqual(false);
    expect(isLoading).toEqual(true);
    expect(error).toEqual(null);
  });

  it('Тест регистрации пользователя. Состояние fulfilled ', async () => {
    jest.spyOn(api, 'registerUserApi').mockResolvedValue(mockAuthResponse);
    const store = configureStore({ reducer: { userAuth: userAuthReducer } });
    await store.dispatch(fetchRegister(mockRegister));
    const { user, isAuthenticated, isLoading, error } =
      store.getState().userAuth;
    expect(user).toEqual(mockUser);
    expect(isAuthenticated).toEqual(false);
    expect(isLoading).toEqual(false);
    expect(error).toEqual(null);
  });

  it('Тест регистрации пользователя. Состояние rejected ', async () => {
    const err = 'Ошибка создания пользователя';
    jest.spyOn(api, 'registerUserApi').mockRejectedValue(new Error(err));
    const store = configureStore({ reducer: { userAuth: userAuthReducer } });
    await store.dispatch(fetchRegister(mockRegister));
    const { user, isAuthenticated, isLoading, error } =
      store.getState().userAuth;
    expect(user).toEqual(null);
    expect(isAuthenticated).toEqual(false);
    expect(isLoading).toEqual(false);
    expect(error).toEqual(err);
  });

  it('Тест разлогирования пользователя. Состояние pending ', async () => {
    document.cookie = `accessToken=${mockAuthResponse.accessToken}`;
    const store = configureStore({
      reducer: { userAuth: userAuthReducer },
      preloadedState: { userAuth: initialState }
    });
    store.dispatch({ type: fetchLogout.pending.type });
    const { user, isAuthenticated, isLoading, error } =
      store.getState().userAuth;
    expect(user).toEqual(initialState.user);
    expect(isAuthenticated).toEqual(true);
    expect(isLoading).toEqual(true);
    expect(error).toEqual(null);
    expect(setCookie).not.toHaveBeenCalled();
    expect(localStorageMock.removeItem).not.toHaveBeenCalled();
  });

  it('Тест разлогирования пользователя. Состояние fulfilled ', async () => {
    document.cookie = `accessToken=${mockAuthResponse.accessToken}`;
    localStorageMock.setItem('refreshToken', mockAuthResponse.refreshToken);
    jest.spyOn(api, 'logoutApi').mockResolvedValue({ success: true });
    const store = configureStore({
      reducer: { userAuth: userAuthReducer },
      preloadedState: { userAuth: initialState }
    });
    await store.dispatch(fetchLogout());
    const { user, isAuthenticated, isLoading, error } =
      store.getState().userAuth;
    expect(error).toEqual(null);
    expect(user).toEqual(null);
    expect(isAuthenticated).toEqual(false);
    expect(isLoading).toEqual(false);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(
      mockAuthResponse.refreshToken
    );
  });

  it('Тест регистрации пользователя. Состояние rejected ', async () => {
    document.cookie = `accessToken=${mockAuthResponse.accessToken}`;
    localStorageMock.setItem('refreshToken', mockAuthResponse.refreshToken);
    const err = 'Ошибка разлогинивание';
    jest.spyOn(api, 'logoutApi').mockRejectedValue(new Error(err));
    const store = configureStore({
      reducer: { userAuth: userAuthReducer },
      preloadedState: { userAuth: initialState }
    });
    await store.dispatch(fetchLogout());
    const { user, isAuthenticated, isLoading, error } =
      store.getState().userAuth;
    expect(user).toEqual(initialState.user);
    expect(isAuthenticated).toEqual(true);
    expect(isLoading).toEqual(false);
    expect(error).toEqual(err);
    expect(setCookie).not.toHaveBeenCalled();
    expect(localStorageMock.removeItem).not.toHaveBeenCalled();
  });

  it('Тест изменения данных пользователя . Состояние pending ', async () => {
    const store = configureStore({ reducer: { userAuth: userAuthReducer } });
    store.dispatch({ type: fetchUpdateUser.pending.type });
    const { user, isAuthenticated, isLoading, error } =
      store.getState().userAuth;
    expect(user).toEqual(null);
    expect(isAuthenticated).toEqual(false);
    expect(isLoading).toEqual(true);
    expect(error).toEqual(null);
  });

  it('Тест изменения данных пользователя. Состояние fulfilled  ', async () => {
    const updatedAuthResponse = {
      user: mockUpdateUser,
      refreshToken: 'refreshToken',
      accessToken: 'accessToken',
      success: true
    };
    jest.spyOn(api, 'updateUserApi').mockResolvedValue(updatedAuthResponse);
    const store = configureStore({
      reducer: { userAuth: userAuthReducer },
      preloadedState: { userAuth: initialState }
    });
    await store.dispatch(fetchUpdateUser(mockUpdate));
    const { user, isAuthenticated, isLoading, error } =
      store.getState().userAuth;
    expect(user).toEqual(mockUpdateUser);
    expect(isAuthenticated).toEqual(true);
    expect(isLoading).toEqual(false);
    expect(error).toEqual(null);
  });

  it('ТТест изменения данных пользователя.Состояние rejected ', async () => {
    const err = 'Ошибка обновления пользователя';
    jest.spyOn(api, 'updateUserApi').mockRejectedValue(new Error(err));
    const store = configureStore({
      reducer: { userAuth: userAuthReducer },
      preloadedState: { userAuth: initialState }
    });
    await store.dispatch(fetchUpdateUser(mockUpdate));
    const { user, isAuthenticated, isLoading, error } =
      store.getState().userAuth;
    expect(user).toEqual(initialState.user);
    expect(isAuthenticated).toEqual(true);
    expect(isLoading).toEqual(false);
    expect(error).toEqual(err);
  });
});
