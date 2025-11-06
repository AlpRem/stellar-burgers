import { rootReducer, store } from './store';

describe('Проверка правильной инициализации rootReducer', () => {
  it(' Тест, проверяющий правильную настройку и работу rootReducer', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(store.getState());
  });
})
