import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../services/store';
import { fetchGetIngredientById } from '../../services/burgerIngredientSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { currentIngredient, isLoading, error } = useSelector(
    (state: RootState) => state.burgerIngredient
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
