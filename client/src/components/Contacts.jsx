import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import Loader from './Loader';

const Contacts = ({ contacts, changeChat }) => {
  const { user } = useAuthContext();
  const [selectedContact, setSelectedContact] = useState(null);
  const [updatedContacts, setUpdatedContacts] = useState(contacts);

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
        setUpdatedContacts(data);
        // dispatch({ type: 'SET_USERS', payload: data });
      }
    };
    if (user) {
      fetchFriends();
    }
  }, [user]);

  const changeCurrentChat = (index, contact) => {
    setSelectedContact(index);
    changeChat(contact);
  };

  if (!contacts) {
    return <Loader />;
  }
  return (
    <div className="contacts-container">
      <div className="spacer">
        <div className="contacts">
          {updatedContacts.map((contact, idx) => (
            <div
              key={contact._id}
              className={`contact ${idx === selectedContact ? 'selected' : ''}`}
              onClick={() => changeCurrentChat(idx, contact)}
            >
              <div className="contact-avatar">
                <img
                  src={`https://robohash.org/${contact._id}?set=set5`}
                  alt="avatar"
                />
              </div>
              <div className="username">
                <h3>{contact.email}</h3>
              </div>
            </div>
          ))}
        </div>
        <div className="current-user">
          <div className="avatar">
            <img
              src={`https://robohash.org/${user._id}?set=set5`}
              alt="avatar"
            />
          </div>
          <div className="username">
            <h3>{user.email}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
