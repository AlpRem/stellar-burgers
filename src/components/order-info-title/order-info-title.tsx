import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { OrderInfo } from '@components';

type OrderInfoTitleProps = {
  className?: string;
};

export const OrderInfoTitle: FC<OrderInfoTitleProps> = ({ className }) => {
  const { number } = useParams<{ number: string }>();

  return (
    <div className={className}>
      <p className='text text_type_main-large'>#{number}</p>
      <OrderInfo />
    </div>
  );
};

export default OrderInfoTitle;
