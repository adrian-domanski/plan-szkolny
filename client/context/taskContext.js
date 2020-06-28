import React, { createContext, useReducer } from "react";
import { initState, authReducer } from "./reducers/authReducer";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [authContext, dispatch] = useReducer(authReducer, initState);
  return (
    <AuthContext.Provider value={{ authContext, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
