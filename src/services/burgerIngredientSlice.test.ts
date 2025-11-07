import { TIngredient } from '@utils-types';
import { configureStore } from '@reduxjs/toolkit';
import burgerIngredientReducer, { fetchGetBurgerIngredient, fetchGetIngredientById } from './burgerIngredientSlice';
import * as api from '@api';

describe('Проверяют редьюсер слайса для ингредиентов бургера', () => {
  const mockBunsIngredients: TIngredient[] = [{
    "_id": "1",
    "name": "Краторная булка N-200i",
    "type": "bun",
    "proteins": 80,
    "fat": 24,
    "carbohydrates": 53,
    "calories": 420,
    "price": 1255,
    "image": "https://code.s3.yandex.net/react/code/bun-02.png",
    "image_mobile": "https://code.s3.yandex.net/react/code/bun-02-mobile.png",
    "image_large": "https://code.s3.yandex.net/react/code/bun-02-large.png",
  }];
  const mockMainsIngredients: TIngredient[] = [{
    "_id": "2",
    "name": "Биокотлета из марсианской Магнолии",
    "type": "main",
    "proteins": 420,
    "fat": 142,
    "carbohydrates": 242,
    "calories": 4242,
    "price": 424,
    "image": "https://code.s3.yandex.net/react/code/meat-01.png",
    "image_mobile": "https://code.s3.yandex.net/react/code/meat-01-mobile.png",
    "image_large": "https://code.s3.yandex.net/react/code/meat-01-large.png",
  }];
  const mockSaucesIngredients: TIngredient[] = [{
    "_id": "4",
    "name": "Соус Spicy-X",
    "type": "sauce",
    "proteins": 30,
    "fat": 20,
    "carbohydrates": 40,
    "calories": 30,
    "price": 90,
    "image": "https://code.s3.yandex.net/react/code/sauce-02.png",
    "image_mobile": "https://code.s3.yandex.net/react/code/sauce-02-mobile.png",
    "image_large": "https://code.s3.yandex.net/react/code/sauce-02-large.png",
  }];

  test('Тест загрузки ингредиентов. Состояние pending', async () => {
    const store = configureStore({ reducer: { burgerIngredient: burgerIngredientReducer } });
    store.dispatch({ type: fetchGetBurgerIngredient.pending.type });
    const {buns, mains, sauces, isLoading, error} = store.getState().burgerIngredient;
    expect(buns).toEqual([]);
    expect(mains).toEqual([]);
    expect(sauces).toEqual([]);
    expect(isLoading).toEqual(true);
    expect(error).toEqual(null);
  });

  test('Тест загрузки ингредиентов. Состояние fulfilled', async () => {
    jest.spyOn(api, 'getIngredientsApi').mockResolvedValue([...mockBunsIngredients, ...mockMainsIngredients, ...mockSaucesIngredients]);
    const store = configureStore({ reducer: { burgerIngredient: burgerIngredientReducer } });
    await store.dispatch(fetchGetBurgerIngredient());
    const {buns, mains, sauces, isLoading, error} = store.getState().burgerIngredient;
    expect(buns).toEqual(mockBunsIngredients);
    expect(mains).toEqual(mockMainsIngredients);
    expect(sauces).toEqual(mockSaucesIngredients);
    expect(isLoading).toEqual(false);
    expect(error).toEqual(null);
  });

  test('Тест загрузки ингредиентов. Состояние rejected', async () => {
    const err = 'Ошибка получения ингредиентов';
    jest.spyOn(api, 'getIngredientsApi').mockRejectedValue(new Error(err));
    const store = configureStore({ reducer: { burgerIngredient: burgerIngredientReducer } });
    await store.dispatch(fetchGetBurgerIngredient());
    const {buns, mains, sauces, isLoading, error } = store.getState().burgerIngredient;
    expect(buns).toEqual([]);
    expect(mains).toEqual([]);
    expect(sauces).toEqual([]);
    expect(isLoading).toEqual(false);
    expect(error ).toEqual(err);
  });

  test('Тест получения ингредиента по ID. Состояние pending', async () => {
    const store = configureStore({ reducer: { burgerIngredient: burgerIngredientReducer } });
    store.dispatch({ type: fetchGetIngredientById.pending.type });
    const {currentIngredient, isLoading, error} = store.getState().burgerIngredient;
    expect(currentIngredient).toEqual(null);
    expect(isLoading).toEqual(true);
    expect(error).toEqual(null);
  });

  test('Тест получения ингредиента по ID. Состояние fulfilled', async () => {
    jest.spyOn(api, 'getIngredientsApi').mockResolvedValue([...mockBunsIngredients, ...mockMainsIngredients, ...mockSaucesIngredients]);
    const store = configureStore({ reducer: { burgerIngredient: burgerIngredientReducer } });
    await store.dispatch(fetchGetIngredientById(mockBunsIngredients[0]._id));
    const {currentIngredient, isLoading, error} = store.getState().burgerIngredient;
    expect(currentIngredient).toEqual(mockBunsIngredients[0]);
    expect(isLoading).toEqual(false);
    expect(error).toEqual(null);
  });

  test('Тест получения ингредиента по ID. Состояние rejected', async () => {
    const err = 'Ошибка поиска ингредиента';
    jest.spyOn(api, 'getIngredientsApi').mockRejectedValue(new Error(err));
    const store = configureStore({ reducer: { burgerIngredient: burgerIngredientReducer } });
    await store.dispatch(fetchGetIngredientById(mockBunsIngredients[0]._id));
    const {currentIngredient, isLoading, error } = store.getState().burgerIngredient;
    expect(currentIngredient).toEqual(null);
    expect(isLoading).toEqual(false);
    expect(error ).toEqual(err);
  });

})
