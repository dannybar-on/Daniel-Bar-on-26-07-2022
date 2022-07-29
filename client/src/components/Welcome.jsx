import React from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { default as RoboGif } from '../assets/robot.gif';
const Welcome = () => {
  const { user } = useAuthContext();

  return (
    <div className="welcome-container">
      <img src={RoboGif} alt="welcoming-gif" />
      <h1>
        Welcome, <span>{user.email}!</span>
      </h1>
      <h3>Please select a chat to start messaging</h3>
    </div>
  );
};

export default Welcome;
