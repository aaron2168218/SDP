
import { createContext, useContext, useState } from 'react';

const ComplexityContext = createContext();

export const useComplexity = () => useContext(ComplexityContext);

export const ComplexityProvider = ({ children }) => {
  const [complexity, setComplexity] = useState(0);

  return (
    <ComplexityContext.Provider value={{ complexity, setComplexity }}>
      {children}
    </ComplexityContext.Provider>
  );
};
