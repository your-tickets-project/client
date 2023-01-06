import { store } from 'client/store';
import { authSlice } from 'client/store/reducers/auth';
import { UserType } from 'interfaces';

export const authLogIn = ({
  user,
  accessToken,
}: {
  user: UserType;
  accessToken: string;
}) => {
  store.dispatch(authSlice.actions.login({ user, accessToken }));
};

export const authCheckUser = ({ user }: { user: UserType }) => {
  store.dispatch(authSlice.actions.checkUser({ user }));
};

export const authLogOut = () => store.dispatch(authSlice.actions.logOut());
