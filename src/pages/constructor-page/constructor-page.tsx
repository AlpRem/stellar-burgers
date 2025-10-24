import styles from './constructor-page.module.css';

import { BurgerIngredients } from '@components';
import { BurgerConstructor } from '@components';
import { Preloader } from '@ui';
import { FC, useEffect } from 'react';
import { AppDispatch, RootState } from '../../services/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGetBurgerIngredient } from '../../services/burgerIngredientSlice';

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useSelector(
    (state: RootState) => state.burgerIngredient.isLoading
  );

  const dispatch: AppDispatch = useDispatch();
  const { buns, mains, sauces } = useSelector(
    (state: RootState) => state.burgerIngredient
  );

  useEffect(() => {
    if (buns.length === 0 && mains.length === 0 && sauces.length === 0) {
      dispatch(fetchGetBurgerIngredient());
    }
  }, [dispatch, buns, mains, sauces]);

  return (
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
