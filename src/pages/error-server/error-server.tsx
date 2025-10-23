import { FC } from 'react';
import styles from '../constructor-page/constructor-page.module.css';

type TErrorProps = {
  msg?: string; // необязательное сообщение
};

export const ErrorServer: FC<TErrorProps> = ({ msg }) => (
  <main className={styles.containerMain}>
    <h3 className={`pb-6 text text_type_main-large`}>
      {msg || 'Ошибка сервера'}
    </h3>
  </main>
);
