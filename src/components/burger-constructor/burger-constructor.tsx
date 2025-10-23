import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { AppDispatch, RootState } from '../../services/store';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearOrder, fetchSaveOrder } from '../../slice/orderSlice';
import { clearConstructor } from '../../slice/burgerConstructorSlice';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector((state: RootState) => ({
    bun: state.burgerConstructor.bun,
    ingredients: state.burgerConstructor.ingredients
  }));
  const { isAuthenticated } = useSelector((state: RootState) => state.userAuth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const { currentOrder, isLoading } = useSelector(
    (state: RootState) => state.orders
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
  const closeOrderModal = () => {
    dispatch(clearOrder());
    dispatch(clearConstructor());
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
