import { AdminContext } from '../context/AdminContext';
import { useContext } from 'react';

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw Error('useAdminContext must be used within a AdminContextProvider');
  }
  return context;
};
