import React, { createContext, useContext, useState } from "react";
import { useSnackbar } from "./snackbar.tsx";

interface IDevModeProvider {
  children?: React.ReactNode;
}

interface IDevModeContext {
  devMode: boolean;
  serverMode: boolean;
  toggleServerMode: () => void;
  extMode: boolean;
  toggleExtMode: () => void;
}

const DevModeContext = createContext<IDevModeContext | null>(null);
const SERVER_MODE = "server-mode";
const EXT_MODE = "ext-mode";

export const DevModeProvider = ({
  children,
}: IDevModeProvider): JSX.Element => {
  const [serverMode, setServerMode] = useState<boolean>(
    localStorage.getItem(SERVER_MODE) !== "false"
  );

  const [extMode, setExtMode] = useState<boolean>(
    localStorage.getItem(EXT_MODE) !== "false"
  );

  const devMode = !serverMode;

  const { openSnackbar } = useSnackbar();

  const toggleServerMode = () => {
    const toggledServerMode = !serverMode;
    localStorage.setItem(SERVER_MODE, String(toggledServerMode));
    setServerMode(toggledServerMode);
    openSnackbar(
      toggledServerMode
        ? "Server communication enabled"
        : "Server communication disabled",
      toggledServerMode ? "success" : "warning"
    );
  };

  const toggleExtMode = () => {
    const toggledExtMode = !extMode;
    localStorage.setItem(EXT_MODE, String(toggledExtMode));
    setExtMode(toggledExtMode);
    openSnackbar(
      toggledExtMode
        ? "Extension communication enabled"
        : "Extension communication disabled",
      toggledExtMode ? "success" : "warning"
    );
  };

  return (
    <DevModeContext.Provider
      value={{
        devMode,
        serverMode,
        toggleServerMode,
        extMode,
        toggleExtMode,
      }}
    >
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
