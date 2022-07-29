import React from 'react';
import { v4 as uuidv4 } from 'uuid';

const Messages = ({ messages, scrollRef }) => {
  if (!messages) return <div>Loading...</div>;
  return (
    <div className="messages-container">
      {messages.map((message, idx) => (
        <div ref={scrollRef} key={uuidv4()}>
          <div
            key={idx}
            className={`message ${message.fromSelf ? 'sent' : 'recieved'}`}
          >
            <div className="content">
              <p>{message.message}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Messages;
