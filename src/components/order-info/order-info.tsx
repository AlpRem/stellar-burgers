import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '@ui';
import { OrderInfoUI } from '@ui';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';
import { clearOrder, fetchFindByIdOrder } from '../../services/orderSlice';
import { fetchGetBurgerIngredient } from '../../services/burgerIngredientSlice';
import { useAppDispatch, useAppSelector } from '../../services/hooks';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useAppDispatch();
  const { currentOrder } = useAppSelector((state) => state.orders);
  const { buns, mains, sauces } = useAppSelector(
    (state) => state.burgerIngredient
  );
  const ingredients: TIngredient[] = [...buns, ...mains, ...sauces];
  useEffect(() => {
    if (number) {
      dispatch(fetchFindByIdOrder(+number));
    }
    if (!buns.length && !mains.length && !sauces.length) {
      dispatch(fetchGetBurgerIngredient());
    }
    return () => {
      dispatch(clearOrder());
    };
  }, [dispatch, number, buns.length, mains.length, sauces.length]);

  const orderInfo = useMemo(() => {
    if (!currentOrder || !ingredients.length) return null;

    const date = new Date(currentOrder.createdAt);
    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = currentOrder.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );
    return {
      ...currentOrder,
      ingredientsInfo,
      date,
      total
    };
  }, [currentOrder, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
