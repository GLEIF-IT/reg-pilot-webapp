import React, { createContext, useContext, useState } from "react";
import { useSnackbar } from "./snackbar.tsx";

interface IDevModeProvider {
  children?: React.ReactNode;
}

interface IDevModeContext {
  devMode: boolean;
  toggleDevMode: () => void;
}

const DevModeContext = createContext<IDevModeContext | null>(null);
const DEV_MODE = "dev-mode";

export const DevModeProvider = ({
  children,
}: IDevModeProvider): JSX.Element => {
  const [devMode, setDevMode] = useState<boolean>(
    localStorage.getItem(DEV_MODE) === "true"
  );
  const { openSnackbar } = useSnackbar();

  const toggleDevMode = () => {
    const toggledDevMode = !devMode;
    localStorage.setItem(DEV_MODE, String(toggledDevMode));
    setDevMode(toggledDevMode);
    openSnackbar(
      toggledDevMode ? "Dev Mode turned on" : "Dev Mode turned off",
      toggledDevMode ? "warning" : "success"
    );
  };

  return (
    <DevModeContext.Provider value={{ devMode, toggleDevMode }}>
      {children}
    </DevModeContext.Provider>
  );
};

export const useDevMode = () => {
  const context = useContext(DevModeContext);
  if (!context) {
    throw new Error("useDevMode must be used within a DevModeProvider");
  }
  return context;
};
