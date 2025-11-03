import { TConstructorIngredient, TIngredient } from '@utils-types';

export type TConstructorIngredientFromOrder = {
  bun: TConstructorIngredient;
  ingredients: TConstructorIngredient[];
  isLoading: boolean;
  error: null;
};
