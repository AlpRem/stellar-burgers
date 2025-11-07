import * as api from '@api';
import { configureStore } from '@reduxjs/toolkit';
import {
  logoutApi,
  TAuthResponse,
  TLoginData,
  TRegisterData,
  TUserResponse
} from '@api';
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
  it('Тест получения пользователя ', async () => {
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

  it('Тест авторизации пользователя ', async () => {
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

  it('Тест регистрации пользователя ', async () => {
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

  it('Тест разлогирования пользователя ', async () => {
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

  it('Тест изменения даннных пользователя ', async () => {
    const updatedAuthResponse = {
      user: mockUpdateUser, // возвращаем обновленные данные
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
});
