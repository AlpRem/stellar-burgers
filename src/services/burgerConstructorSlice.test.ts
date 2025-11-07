import { TConstructorIngredient } from '@utils-types';
import burgerConstructorReducer, {
  addIngredient,
  clearConstructor,
  deleteIngredient,
  moveIngredient, saveConstructorToStore,
  TBurgerIngredientSlice
} from './burgerConstructorSlice';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
(global as any).localStorage = localStorageMock;


describe('Проверяют редьюсер слайса для конструктора бургера', () =>{

  const mockBun: TConstructorIngredient = {
    "id": "01",
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
    "image_large": "https://code.s3.yandex.net/react/code/bun-02-large.png"
  }

  const mockIngredients: TConstructorIngredient[] = [
    {
      "id": "02",
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
    },
    {
      "id": "04",
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

    }
  ]
  const initialState: TBurgerIngredientSlice = {
    bun: mockBun,
    ingredients: mockIngredients,
    isLoading: false,
    error: null
  }

  beforeEach(() => {
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  it('Тест добавления ингредиентов ', () => {
    const initialStateAdd: TBurgerIngredientSlice = {
      bun: null,
      ingredients: [],
      isLoading: false,
      error: null
    }
    let newIngredients = burgerConstructorReducer(initialStateAdd, addIngredient(mockBun));
    expect(newIngredients.bun).toEqual({...mockBun, id: expect.any(String)});
    expect(newIngredients.bun).toEqual({...mockBun, id: expect.any(String)});
    newIngredients = burgerConstructorReducer(newIngredients, addIngredient(mockIngredients[0]));
    newIngredients = burgerConstructorReducer(newIngredients, addIngredient(mockIngredients[1]));
    expect(newIngredients.ingredients).toHaveLength(2);
    expect(newIngredients.ingredients[0]).toEqual({...mockIngredients[0],id: expect.any(String)});
    expect(newIngredients.ingredients[1]).toEqual({...mockIngredients[1],id: expect.any(String)});
  });

  it('Тест удаления ингредиента ', () => {
    const newIngredients = burgerConstructorReducer(initialState, deleteIngredient(mockIngredients[0].id));
    expect(newIngredients.ingredients).toEqual([mockIngredients[1]]);
  });

  it('Тест изменения порядка ингредиентов ', () => {
    let newIngredients = burgerConstructorReducer(initialState, moveIngredient({ currentIndex: 0, newIndex: 1}));
    expect(newIngredients.ingredients).toEqual([mockIngredients[1], mockIngredients[0]]);
    newIngredients = burgerConstructorReducer(initialState, moveIngredient({ currentIndex: 1, newIndex: 1}));
    expect(newIngredients.ingredients).toEqual(mockIngredients);
  });

  it('Тест очистки конструктора ингредиентов ', () => {
    const newIngredients = burgerConstructorReducer(initialState, clearConstructor());
    expect(newIngredients.bun).toEqual(null);
    expect(newIngredients.ingredients).toEqual([]);
  });

  it('Тест заполнения данных в конструктор ингредиентов ', () => {
    const newIngredients = burgerConstructorReducer(initialState, saveConstructorToStore(initialState));
    expect(newIngredients.bun).toEqual(mockBun);
    expect(newIngredients.ingredients).toEqual(mockIngredients);
  });
})
