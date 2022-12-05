import { createContext, ReactNode, useContext, useMemo } from "react";
import { User } from "../types/User";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";

interface InitialStateInterface {
  user: User | null;
  setUser: (user: User | null) => void;
  logOut: () => void;
}

const initialState: InitialStateInterface = {
  user: null,
  setUser: () => {},
  logOut: () => {},
};

const UserContextProvider = createContext(initialState);

export const useUserContext = () => useContext(UserContextProvider);

const UserContext = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useLocalStorage("subtracker-user", null);

  function logOut() {
    setUser(null);
    navigate("/login");
  }

  const state = useMemo(() => {
    return {
      user,
      setUser,
      logOut,
    };
  }, [user]);

  return (
    <UserContextProvider.Provider value={state}>
      {children}
    </UserContextProvider.Provider>
  );
};

export default UserContext;
