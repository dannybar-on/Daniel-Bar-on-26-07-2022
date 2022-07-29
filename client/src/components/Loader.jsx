import React from 'react';
import { default as loader } from '../assets/loader.gif';
const Loader = () => {
  return (
    <div className="loader">
      <img src={loader} alt="" />
    </div>
  );
};

export default Loader;
