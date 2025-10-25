import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { fetchFindByUserOrders } from '../../services/orderSlice';
import { Preloader } from '@ui';
import { useAppDispatch, useAppSelector } from '../../services/hooks';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();

  const { orders, isLoading } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchFindByUserOrders());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
