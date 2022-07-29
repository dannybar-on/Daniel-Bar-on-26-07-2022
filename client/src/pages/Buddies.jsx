import React, { useState, useEffect } from 'react';
import { useAdminContext } from '../hooks/useAdminContext';
import { useAuthContext } from '../hooks/useAuthContext';
import UserDetails from '../components/UserDetails';

const Buddies = () => {
  const { users, dispatch } = useAdminContext();
  const { user } = useAuthContext();
  const [friends, setFriends] = useState([]);
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

  useEffect(() => {
    const fetchFriends = async () => {
      const res = await fetch(`/api/admin/friends/${user._id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setFriends(data);
      }
    };
    if (user) {
      fetchFriends();
    }
  }, [user]);

  return (
    <div className="home">
      <div className="workouts">
        <h2>Registered Users:</h2>
        {users &&
          users
            .filter((userData) => user._id !== userData._id)
            .map((user) => {
              return (
                <UserDetails
                  friends={friends}
                  setFriends={setFriends}
                  isBuddy={true}
                  userData={user}
                  key={user._id}
                />
              );
            })}
      </div>
    </div>
  );
};

export default Buddies;
