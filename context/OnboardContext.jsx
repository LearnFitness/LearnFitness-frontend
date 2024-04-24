import { createContext, useState } from "react";

export const OnboardContext = createContext(null);

export default function OnboardContextProvider({ children }) {
  const [onboardData, setOnboardData] = useState({});

  function updateOnboardData(key, value) {
    setOnboardData((prevData) => ({ ...prevData, [key]: value }))
  }

  function updateMultipleOnboardData(newData) {
    setOnboardData((prevData) => ({ ...prevData, ...newData }))
  }

  return (
    <OnboardContext.Provider value={{ onboardData, updateOnboardData, updateMultipleOnboardData }}>
      {children}
    </OnboardContext.Provider>)
}