import { FC, useEffect, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { useLocation, useNavigate } from 'react-router-dom';
import { clearOrder, fetchSaveOrder } from '../../services/orderSlice';
import {
  clearConstructor,
  saveConstructorToStore
} from '../../services/burgerConstructorSlice';
import { useAppDispatch, useAppSelector } from '../../services/hooks';

export const BurgerConstructor: FC = () => {
  const constructorItems = useAppSelector((state) => ({
    bun: state.burgerConstructor.bun,
    ingredients: state.burgerConstructor.ingredients
  }));
  const { isAuthenticated } = useAppSelector((state) => state.userAuth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { currentOrder, isLoading, error } = useAppSelector(
    (state) => state.orders
  );

  const orderRequest = isLoading;
  const orderModalData = currentOrder;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    dispatch(
      fetchSaveOrder({
        bun: constructorItems.bun,
        ingredients: constructorItems.ingredients
      })
    );
  };

  useEffect(() => {
    const burgerJson = localStorage.getItem('burger');
    if (burgerJson) dispatch(saveConstructorToStore(JSON.parse(burgerJson)));
    if (currentOrder && !error && !isLoading) {
      dispatch(clearConstructor());
    }
  }, [currentOrder, error, isLoading, dispatch]);

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
