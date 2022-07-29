import React, { useEffect } from 'react';
import { useAdminContext } from '../hooks/useAdminContext';
import UserDetails from '../components/UserDetails';
import { useAuthContext } from '../hooks/useAuthContext';
import UserForm from '../components/UserForm';

const Panel = () => {
  const { users, dispatch } = useAdminContext();
  const { user } = useAuthContext();
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/admin', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        dispatch({ type: 'SET_USERS', payload: data });
      }
    };
    if (user) {
      fetchUsers();
    }
  }, [dispatch, user]);

  return (
    <div className="home">
      <div className="workouts">
        {users && users.map((u) => <UserDetails userData={u} key={u._id} />)}
      </div>
      <UserForm />
    </div>
  );
};

export default Panel;
