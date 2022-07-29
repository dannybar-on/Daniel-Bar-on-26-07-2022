import { createContext, useReducer } from 'react';

export const AdminContext = createContext();
export const AdminReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USERS':
      return {
        users: action.payload,
      };
    case 'CREATE_USER':
      return {
        users: [action.payload, ...state.users],
      };
    case 'DELETE_USER':
      return {
        users: state.users.filter((user) => user._id !== action.payload._id),
      };
    case 'UPDATE_USER':
      return {
        users: state.users.map((user) => {
          if (user._id === action.payload._id) {
            return action.payload;
          }
          return user;
        }),
      };
    case 'ADD_MESSAGE':
      return {
        messages: [action.payload, ...state.messages],
      };
    case 'SET_MESSAGES':
      return {
        messages: action.payload,
      };
    default:
      return state;
  }
};
export const AdminContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AdminReducer, {
    users: null,
    messages: null,
  });

  return (
    <AdminContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AdminContext.Provider>
  );
};
