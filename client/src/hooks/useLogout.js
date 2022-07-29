import { useAuthContext } from './useAuthContext';
import { useAdminContext } from './useAdminContext';

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: dispatchUsers } = useAdminContext();

  const logout = () => {
    localStorage.removeItem('user');

    dispatch({ type: 'LOGOUT' });
    dispatchUsers({ type: 'SET_USERS', payload: null });
  };

  return { logout };
};
