import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { AppDispatch, RootState } from '../../services/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../slice/orderSlice';

export const Feed: FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const { orders, isLoading, error } = useSelector(
    (state: RootState) => state.orders
  );

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (isLoading || orders.length === 0) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchOrders())} />
  );
};
