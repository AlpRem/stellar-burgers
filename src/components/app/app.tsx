import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { background?: Location };
  const background = state?.background;
  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='*' element={<NotFound404 />} />
        <Route path='/' element={<ConstructorPage />} />
        {/*<Route path='/feed' element={<Feed />} />*/}
        {/*<Route path='/login' element={<Login />} />*/}
        {/*<Route path='/register' element={<Register />} />*/}
        {/*<Route path='/forgot-password' element={<ForgotPassword />} />*/}
        {/*<Route path='/reset-password' element={<ResetPassword />} />*/}
        {/*<Route path='/profile' element={<Profile />} />*/}
        {/*<Route path='/profile/orders' element={<ProfileOrders />} />*/}
        {/*<Route path='/feed/:number' element={<OrderInfo />} />*/}
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
      </Routes>
      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингридиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
