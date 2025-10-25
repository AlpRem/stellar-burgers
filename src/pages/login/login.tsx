import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';

import { fetchLogin } from '../../services/userAuthSlice';
import { useAppDispatch, useAppSelector } from '../../services/hooks';

export const Login: FC = () => {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.userAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(fetchLogin({ email, password }))
      .unwrap()
      .catch(() => {});
  };

  return (
    <>
      {error}
      <LoginUI
        errorText=''
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
      />
    </>
  );
};
