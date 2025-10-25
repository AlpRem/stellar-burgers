import styles from './constructor-page.module.css';

import { BurgerIngredients } from '@components';
import { BurgerConstructor } from '@components';
import { Preloader } from '@ui';
import { FC, useEffect } from 'react';

import { fetchGetBurgerIngredient } from '../../services/burgerIngredientSlice';
import { useAppDispatch, useAppSelector } from '../../services/hooks';

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useAppSelector(
    (state) => state.burgerIngredient.isLoading
  );

  const dispatch = useAppDispatch();
  const { buns, mains, sauces } = useAppSelector(
    (state) => state.burgerIngredient
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
