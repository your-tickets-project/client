import { useSelector } from 'react-redux';
import { RootState } from '..';

export const AppSelector = () => useSelector((state: RootState) => state.app);

export const AuthSelector = () => useSelector((state: RootState) => state.auth);
