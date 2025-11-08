import { TOrder } from '@utils-types';
import * as api from '@api';
import { orderBurgerApi, TFeedsResponse, TNewOrderResponse } from '@api';
import { configureStore } from '@reduxjs/toolkit';
import orderReducer, {
  fetchFindByIdOrder,
  fetchFindByUserOrders,
  fetchGetListOrders,
  fetchSaveOrder
} from './orderSlice';

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

  it('Тест получения списка заказов ', async () => {
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

  it('Тест получения заказа по номеру ', async () => {
    jest.spyOn(api, 'getOrderByNumberApi').mockResolvedValue(mockFeedsResponse);
    const store = configureStore({ reducer: { orders: orderReducer } });
    await store.dispatch(fetchFindByIdOrder(mockOrders[0].number));
    const { currentOrder, isLoading, error } = store.getState().orders;
    expect(currentOrder).toEqual(mockOrders[0]);
    expect(isLoading).toEqual(false);
    expect(error).toEqual(null);
  });

  it('Тест сохранения заказа ', async () => {
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

  it('Тест получения заказов конкретного пользователя ', async () => {
    jest.spyOn(api, 'getOrdersApi').mockResolvedValue(mockOrders);
    const store = configureStore({ reducer: { orders: orderReducer } });
    await store.dispatch(fetchFindByUserOrders());
    const { orders, isLoading, error } = store.getState().orders;
    expect(orders).toEqual(mockOrders);
    expect(isLoading).toEqual(false);
    expect(error).toEqual(null);
  });
});
