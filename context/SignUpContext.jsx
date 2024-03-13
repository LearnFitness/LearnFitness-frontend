import { createContext, useState } from "react";

export const SignUpContext = createContext();

function SignUpContextProvider({ children }) {
  const [signUpData, setSignUpData] = useState({});

  function updateSignUpData(key, value) {
    setSignUpData((prevData) => ({ ...prevData, [key]: value }))
  }

  return (
    <SignUpContext.Provider value={{ signUpData, updateSignUpData }}>
      {children}
    </SignUpContext.Provider>)
}

export default SignUpContextProvider;