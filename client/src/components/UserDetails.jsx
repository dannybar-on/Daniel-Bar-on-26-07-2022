import React from 'react';
import { useAdminContext } from '../hooks/useAdminContext';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useAuthContext } from '../hooks/useAuthContext';

const UserDetails = ({ userData, isBuddy, friends, setFriends }) => {
  const { dispatch } = useAdminContext();
  const { user } = useAuthContext();
  const handleDelete = async () => {
    if (!user) {
      return;
    }
    const response = await fetch(`/api/admin/${userData._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();
    if (response.ok) {
      dispatch({ type: 'DELETE_USER', payload: json });
    }
  };
  const handleAddFriend = async (friendId) => {
    if (!user) {
      return;
    }
    const response = await fetch(`/api/admin/friends/${user._id}`, {
      method: 'PATCH',
      body: JSON.stringify({ friendId }),
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
    });
    const json = await response.json();
    if (response.ok) {
      dispatch({ type: 'UPDATE_USER', payload: json });

      const newFriends = [...friends];
      newFriends.push({ _id: json.friend._id, email: json.friend.email });
      setFriends(newFriends);
    }
  };
  const handleRemoveFriend = async (friendId) => {
    if (!user) {
      return;
    }
    const response = await fetch(`/api/admin/friends/remove/${user._id}`, {
      method: 'PATCH',
      body: JSON.stringify({ friendId }),
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
    });
    const json = await response.json();
    if (response.ok) {
      dispatch({ type: 'UPDATE_USER', payload: json });
      const newFriends = [...friends];
      newFriends.splice(
        newFriends.findIndex((friend) => friend._id === friendId),
        1
      );
      setFriends(newFriends);
    }
  };

  return (
    <div className="workout-details">
      <h4>{userData.email}</h4>
      <p>
        <strong>Is Admin:</strong>
        {userData.isAdmin ? ' Yes' : ' No'}
      </p>
      <p>
        <strong>Created At: </strong>
        {formatDistanceToNow(new Date(userData.createdAt), { addSuffix: true })}
      </p>
      {!isBuddy && <span onClick={handleDelete}>delete</span>}
      {isBuddy && (
        <>
          {friends.some((f) => f._id === userData._id) ? (
            <button onClick={() => handleRemoveFriend(userData._id)}>
              remove friend
            </button>
          ) : (
            <button onClick={() => handleAddFriend(userData._id)}>
              add friend
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default UserDetails;
