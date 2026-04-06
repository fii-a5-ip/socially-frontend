// Acesta este un fișier temporar creat de Criss pentru a opri erorile Vite
import React, { createContext, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  return {}; // Returnăm un obiect gol ca să nu crape Navbar-ul
};