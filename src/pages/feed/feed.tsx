import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { AppDispatch, RootState } from '../../services/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGetBurgerIngredient } from '../../services/burgerIngredientSlice';
import { fetchGetListOrders } from '../../services/orderSlice';

export const Feed: FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const { orders, isLoading, error } = useSelector(
    (state: RootState) => state.orders
  );

  const { buns, mains, sauces } = useSelector(
    (state: RootState) => state.burgerIngredient
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
