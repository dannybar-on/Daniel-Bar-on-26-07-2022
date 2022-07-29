import React, { useState } from 'react';
import { IoMdSend } from 'react-icons/io';
import { BsEmojiSmileFill } from 'react-icons/bs';
const ChatInput = ({ handleSendMsg }) => {
  const [msg, setMsg] = useState('');

  const sendChat = (e) => {
    e.preventDefault();
    if (!msg.length) return;
    handleSendMsg(msg);
    setMsg('');
  };
  return (
    <div className="input-main-container">
      <form className="input-container" onSubmit={(e) => sendChat(e)}>
        <input
          type="text"
          placeholder="Type a message..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button className="submit-btn">
          <IoMdSend />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
