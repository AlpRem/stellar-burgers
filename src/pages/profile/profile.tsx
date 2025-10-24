import { ProfileUI } from '@ui-pages';
import { ChangeEvent, FC, SyntheticEvent, useEffect, useState } from 'react';
import { AppDispatch, RootState } from '../../services/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGetUser, fetchUpdateUser } from '../../services/userAuthSlice';
import { Preloader } from '@ui';

export const Profile: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user, isLoading } = useSelector((state: RootState) => state.userAuth);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (!user) {
      dispatch(fetchGetUser());
    } else {
      setFormValue({ name: user.name, email: user.email, password: '' });
    }
  }, [user, dispatch]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!isFormChanged) return;
    dispatch(
      fetchUpdateUser({
        name: formValue.name,
        email: formValue.email,
        password: formValue.password || undefined
      })
    );
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!user) return;
    setFormValue({ name: user.name, email: user.email, password: '' });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );

  // return null;
};
