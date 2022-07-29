import React, { useState, useEffect, useRef } from 'react';
import ChatContainer from '../components/ChatContainer';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import { useAdminContext } from '../hooks/useAdminContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { io } from 'socket.io-client';
import Loader from '../components/Loader';

const Chat = () => {
  // const socket = useRef();
  const [socket, setSocket] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [contacts, setContacts] = useState([]);
  const { dispatch } = useAdminContext();
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
        setContacts(data);
        dispatch({ type: 'SET_USERS', payload: data });
      }
    };
    if (user) {
      fetchUsers();
    }
  }, [dispatch, user]);

  const setupSocket = () => {
    if (user && !socket) {
      const newSocket = io('https://chat-buddey.herokuapp.com/');
      newSocket.emit('add-user', user._id);
      setSocket(newSocket);
    }
  };
  useEffect(() => {
    setupSocket();
  }, []);

  if (!contacts) {
    return <Loader />;
  }
  const handleChangeChat = (chat) => {
    setCurrentChat(chat);
  };
  return (
    <div className="chat-container">
      <div className="inner-container">
        <Contacts contacts={contacts} changeChat={handleChangeChat} />
        {currentChat ? (
          <ChatContainer currentChat={currentChat} socket={socket} />
        ) : (
          <Welcome />
        )}
      </div>
    </div>
  );
};

export default Chat;
