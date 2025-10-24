import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../services/store';
import { getCookie } from '../../utils/cookie';
import { fetchGetUser } from '../../services/userAuthSlice';
import { Preloader } from '@ui';

type ProtectedRouteParams = {
  onlyUnAuthorized?: boolean;
  children: ReactNode;
};

function ProtectedRoute({ children, onlyUnAuthorized }: ProtectedRouteParams) {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.userAuth
  );

  useEffect(() => {
    const token = getCookie('accessToken');
    if (token && !isAuthenticated) {
      dispatch(fetchGetUser());
    }
  }, [dispatch, isAuthenticated]);

  if (isLoading) {
    return <Preloader />;
  }

  if (onlyUnAuthorized && isAuthenticated) {
    const from = location.state?.from || { pathname: '/' };
    const backgroundLocation = location.state?.from?.background || null;
    return (
      <Navigate replace to={from} state={{ background: backgroundLocation }} />
    );
  }

  if (!onlyUnAuthorized && !isAuthenticated) {
    return (
      <Navigate
        replace
        to={'/login'}
        state={{
          from: {
            ...location,
            background: location.state?.background,
            status: null
          }
        }}
      />
    );
  }
  return <>{children}</>;
}

export default ProtectedRoute;
