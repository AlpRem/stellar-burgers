import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';
import { fetchGetIngredientById } from '../../services/burgerIngredientSlice';
import { useAppDispatch, useAppSelector } from '../../services/hooks';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentIngredient, isLoading } = useAppSelector(
    (state) => state.burgerIngredient
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchGetIngredientById(id));
    }
  }, [dispatch, id]);

  if (isLoading || !currentIngredient) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={currentIngredient} />;
};
