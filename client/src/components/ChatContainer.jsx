import React, { useState, useEffect, useRef } from 'react';
import { useAdminContext } from '../hooks/useAdminContext';
import { useAuthContext } from '../hooks/useAuthContext';
import ChatInput from './ChatInput';
import Loader from './Loader';
import Messages from './Messages';

const ChatContainer = ({ currentChat, socket }) => {
  const { user } = useAuthContext();
  const { dispatch } = useAdminContext();
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState('');
  const scrollRef = useRef();

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(`/api/message/`, {
        method: 'POST',
        body: JSON.stringify({
          from: user._id,
          to: currentChat._id,
        }),
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json();
      if (response.ok) {
        await dispatch({ type: 'SET_MESSAGES', payload: json });
        setMessages(json);
      }
    };
    fetchMessages();
  }, [dispatch, user, currentChat]);

  const handleSendMsg = async (msg) => {
    if (!user) {
      return;
    }
    socket.emit('send-msg', {
      to: currentChat._id,
      from: user._id,
      message: msg,
    });
    const response = await fetch(`/api/message/addmsg`, {
      method: 'POST',
      body: JSON.stringify({
        from: user._id,
        to: currentChat._id,
        message: msg,
      }),
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
    });
    const json = await response.json();
    if (response.ok) {
      dispatch({ type: 'ADD_MESSAGE', payload: json });
      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: json.message.text });
      setMessages(msgs);
    }
  };
  useEffect(() => {
    if (socket) {
      socket.on('receive-msg', (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!user && !currentChat) {
    return <Loader />;
  }

  return (
    <div className="chat">
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`https://robohash.org/${currentChat._id}?set=set5`}
              alt="avatar"
            />
          </div>
          <div className="username">
            <h3>{currentChat.email}</h3>
          </div>
        </div>
      </div>
      <Messages messages={messages} scrollRef={scrollRef} />
      <ChatInput handleSendMsg={handleSendMsg} />
    </div>
  );
};

export default ChatContainer;
