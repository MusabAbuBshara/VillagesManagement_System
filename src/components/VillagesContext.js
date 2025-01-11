import React, { createContext, useState } from "react";

export const VillagesContext = createContext();

export const VillagesProvider = ({ children }) => {
  const [villages, setVillages] = useState([]);

  return (
    <VillagesContext.Provider value={{ villages, setVillages }}>
      {children}
    </VillagesContext.Provider>
  );
};
