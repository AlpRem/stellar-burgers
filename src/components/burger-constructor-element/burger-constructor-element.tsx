import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { AppDispatch } from '../../services/store';
import {
  deleteIngredient,
  moveIngredient
} from '../../services/burgerConstructorSlice';
import { useAppDispatch } from '../../services/hooks';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch: AppDispatch = useAppDispatch();
    const handleMoveDown = () => {
      if (index < totalItems - 1)
        dispatch(moveIngredient({ currentIndex: index, newIndex: index + 1 }));
    };

    const handleMoveUp = () => {
      if (index > 0)
        dispatch(moveIngredient({ currentIndex: index, newIndex: index - 1 }));
    };

    const handleClose = () => {
      dispatch(deleteIngredient(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
