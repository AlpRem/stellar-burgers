import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { Preloader, ProfileMenuUI } from '@ui';
import { AppDispatch, RootState } from '../../services/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLogout } from '../../services/userAuthSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.userAuth);

  const handleLogout = () => {
    dispatch(fetchLogout()).unwrap;
  };

  if (isLoading) {
    return <Preloader />;
  }
  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
