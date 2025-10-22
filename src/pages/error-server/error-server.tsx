import { FC } from 'react';

type TErrorProps = {
  msg?: string; // необязательное сообщение
};

export const ErrorServer: FC<TErrorProps> = ({ msg }) => (
  <h3 className={`pb-6 text text_type_main-large`}>
    {msg || 'Ошибка сервера'}
  </h3>
);
