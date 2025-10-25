import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';

import { fetchGetBurgerIngredient } from '../../services/burgerIngredientSlice';
import { fetchGetListOrders } from '../../services/orderSlice';
import { useAppDispatch, useAppSelector } from '../../services/hooks';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();

  const { orders, isLoading, error } = useAppSelector((state) => state.orders);

  const { buns, mains, sauces } = useAppSelector(
    (state) => state.burgerIngredient
  );

  useEffect(() => {
    if (buns.length === 0 && mains.length === 0 && sauces.length === 0) {
      dispatch(fetchGetBurgerIngredient());
    }
    dispatch(fetchGetListOrders());
  }, [dispatch, buns, mains, sauces]);

  if (isLoading || orders.length === 0) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => dispatch(fetchGetListOrders())}
    />
  );
};
