import React, { createContext, useState, useContext } from "react";

// Create Context Object
export const UserContext = createContext();

// Create a provider for components to consume and subscribe to changes
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]); // New state to store registered users
  const [loginState, setLoginState] = useState("LOGGED_OUT");
  return (
    <UserContext.Provider
      value={[
        user,
        setUser,
        registeredUsers,
        setRegisteredUsers,
        loginState,
        setLoginState,
      ]}
    >
      {children}
    </UserContext.Provider>
  );
};
