import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { Preloader, ProfileMenuUI } from '@ui';
import { fetchLogout } from '../../services/userAuthSlice';
import { useAppDispatch, useAppSelector } from '../../services/hooks';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.userAuth);

  const handleLogout = () => {
    dispatch(fetchLogout()).unwrap;
  };

  if (isLoading) {
    return <Preloader />;
  }
  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
