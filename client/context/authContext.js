import React, { createContext, useReducer } from "react";
import { initState, authReducer } from "./reducers/authReducer";

export const AuthContext = createContext();

const AuthContextProvider = ({ children, ssrValues }) => {
  const [authContext, dispatch] = useReducer(authReducer, initState);

  return (
    <AuthContext.Provider
      value={{
        // authContext: { ...authContext, ...ssrValues },
        authContext: Object.assign({}, authContext, ssrValues),
        dispatch,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
