import { TOrder } from '@utils-types';
import * as api from '@api';
import { TFeedsResponse, TNewOrderResponse } from '@api';
import { configureStore } from '@reduxjs/toolkit';
import orderReducer, {
    clearOrder,
    fetchFindByIdOrder,
    fetchFindByUserOrders,
    fetchGetListOrders,
    fetchSaveOrder,
    TOrderSlice
} from './orderSlice';
import burgerConstructorReducer, {
  addIngredient
} from './burgerConstructorSlice';

describe('Проверяют редьюсер слайса для работы с заказами', () => {
  const mockOrders: TOrder[] = [
    {
      _id: '1',
      status: 'done',
      name: 'Люминесцентный краторный бургер',
      createdAt: '2025-11-03T16:39:58.280Z',
      updatedAt: '2025-11-03T16:39:58.605Z',
      number: 1,
      ingredients: ['1', '2']
    }
  ];

  const mockFeedsResponse: TFeedsResponse = {
    orders: mockOrders,
    total: 10,
    totalToday: 2,
    success: true
  };

  const mockOrderResponse: TNewOrderResponse = {
    order: mockOrders[0],
    name: 'Люминесцентный краторный бургер',
    success: true
  };

  test('Тест получения списка заказов. Состояние pending', async () => {
    const store = configureStore({ reducer: { orders: orderReducer } });
    store.dispatch({ type: fetchGetListOrders.pending.type });
    const { orders, total, totalToday, isLoading, error } =
      store.getState().orders;
    expect(orders).toEqual([]);
    expect(total).toEqual(0);
    expect(totalToday).toEqual(0);
    expect(isLoading).toEqual(true);
    expect(error).toEqual(null);
  });

  it('Тест получения списка заказов. Состояние fulfilled ', async () => {
    jest.spyOn(api, 'getFeedsApi').mockResolvedValue(mockFeedsResponse);
    const store = configureStore({ reducer: { orders: orderReducer } });
    await store.dispatch(fetchGetListOrders());
    const { orders, total, totalToday, isLoading, error } =
      store.getState().orders;
    expect(orders).toEqual(mockOrders);
    expect(total).toEqual(mockFeedsResponse.total);
    expect(totalToday).toEqual(mockFeedsResponse.totalToday);
    expect(isLoading).toEqual(false);
    expect(error).toEqual(null);
  });

  test('Тест загрузки ингредиентов. Состояние rejected', async () => {
    const err = 'Ошибка получения списка заказов';
    jest.spyOn(api, 'getFeedsApi').mockRejectedValue(new Error(err));
    const store = configureStore({ reducer: { orders: orderReducer } });
    await store.dispatch(fetchGetListOrders());
    const { orders, total, totalToday, isLoading, error } =
      store.getState().orders;
    expect(orders).toEqual([]);
    expect(total).toEqual(0);
    expect(totalToday).toEqual(0);
    expect(isLoading).toEqual(false);
    expect(error).toEqual(err);
  });

  test('Тест получения заказа по номеру. Состояние pending', async () => {
    const store = configureStore({ reducer: { orders: orderReducer } });
    store.dispatch({ type: fetchFindByIdOrder.pending.type });
    const { currentOrder, isLoading, error } = store.getState().orders;
    expect(currentOrder).toEqual(null);
    expect(isLoading).toEqual(true);
    expect(error).toEqual(null);
  });

  it('Тест получения заказа по номеру. Состояние fulfilled ', async () => {
    jest.spyOn(api, 'getOrderByNumberApi').mockResolvedValue(mockFeedsResponse);
    const store = configureStore({ reducer: { orders: orderReducer } });
    await store.dispatch(fetchFindByIdOrder(mockOrders[0].number));
    const { currentOrder, isLoading, error } = store.getState().orders;
    expect(currentOrder).toEqual(mockOrders[0]);
    expect(isLoading).toEqual(false);
    expect(error).toEqual(null);
  });

  test('Тест получения заказа по номеру. Состояние rejected', async () => {
    const err = 'Ошибка получения заказа по ключу';
    jest.spyOn(api, 'getOrderByNumberApi').mockRejectedValue(new Error(err));
    const store = configureStore({ reducer: { orders: orderReducer } });
    await store.dispatch(fetchFindByIdOrder(mockOrders[0].number));
    const { currentOrder, isLoading, error } = store.getState().orders;
    expect(currentOrder).toEqual(null);
    expect(isLoading).toEqual(false);
    expect(error).toEqual(err);
  });

  test('Тест сохранения заказа. Состояние pending', async () => {
    const store = configureStore({ reducer: { orders: orderReducer } });
    store.dispatch({ type: fetchSaveOrder.pending.type });
    const { currentOrder, isLoading, error } = store.getState().orders;
    expect(currentOrder).toEqual(null);
    expect(isLoading).toEqual(true);
    expect(error).toEqual(null);
  });

  it('Тест сохранения заказа. Состояние fulfilled ', async () => {
    jest.spyOn(api, 'orderBurgerApi').mockResolvedValue(mockOrderResponse);
    const store = configureStore({ reducer: { orders: orderReducer } });
    await store.dispatch(
      fetchSaveOrder({
        bun: { _id: mockOrders[0].ingredients[0] },
        ingredients: [{ _id: mockOrders[0].ingredients[1] }]
      })
    );
    const { currentOrder, isLoading, error } = store.getState().orders;
    expect(currentOrder).toEqual(mockOrders[0]);
    expect(isLoading).toEqual(false);
    expect(error).toEqual(null);
  });

  test('Тест сохранения заказа. Состояние rejected', async () => {
    const err = 'Ошибка сохранения заказа';
    jest.spyOn(api, 'orderBurgerApi').mockRejectedValue(new Error(err));
    const store = configureStore({ reducer: { orders: orderReducer } });
    await store.dispatch(
      fetchSaveOrder({
        bun: { _id: mockOrders[0].ingredients[0] },
        ingredients: [{ _id: mockOrders[0].ingredients[1] }]
      })
    );
    const { currentOrder, isLoading, error } = store.getState().orders;
    expect(currentOrder).toEqual(null);
    expect(isLoading).toEqual(false);
    expect(error).toEqual(err);
  });

  test('Тест сохранения заказа. Состояние pending', async () => {
    const store = configureStore({ reducer: { orders: orderReducer } });
    store.dispatch({ type: fetchFindByUserOrders.pending.type });
    const { orders, isLoading, error } = store.getState().orders;
    expect(orders).toEqual([]);
    expect(isLoading).toEqual(true);
    expect(error).toEqual(null);
  });

  it('Тест получения заказов конкретного пользователя. Состояние fulfilled ', async () => {
    jest.spyOn(api, 'getOrdersApi').mockResolvedValue(mockOrders);
    const store = configureStore({ reducer: { orders: orderReducer } });
    await store.dispatch(fetchFindByUserOrders());
    const { orders, isLoading, error } = store.getState().orders;
    expect(orders).toEqual(mockOrders);
    expect(isLoading).toEqual(false);
    expect(error).toEqual(null);
  });

  test('Тест получения заказов конкретного пользователя. Состояние rejected', async () => {
    const err = 'Ошибка получения заказов пользователя';
    jest.spyOn(api, 'getOrdersApi').mockRejectedValue(new Error(err));
    const store = configureStore({ reducer: { orders: orderReducer } });
    await store.dispatch(fetchFindByUserOrders());
    const { orders, isLoading, error } = store.getState().orders;
    expect(orders).toEqual([]);
    expect(isLoading).toEqual(false);
    expect(error).toEqual(err);
  });

  it('Тест очистки данных о заказе ', () => {
    const initialState: TOrderSlice = {
      orders: mockFeedsResponse.orders,
      total: mockFeedsResponse.total,
      totalToday: mockFeedsResponse.totalToday,
      currentOrder: mockFeedsResponse.orders[0],
      isLoading: false,
      error: null
    };
    let newOrder = orderReducer(initialState, clearOrder());
    expect(newOrder.currentOrder).toEqual(null);
  });
});
