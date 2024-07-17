import React, { createContext, useContext, useState } from "react";
import { useSnackbar } from "./snackbar.tsx";

interface IConfigModeProvider {
  children?: React.ReactNode;
}

interface IConfigModeContext {
  serverMode: boolean;
  toggleServerMode: () => void;
  extMode: boolean;
  toggleExtMode: () => void;
}

const ConfigModeContext = createContext<IConfigModeContext | null>(null);
const SERVER_MODE = "server-mode";
const EXT_MODE = "ext-mode";

export const ConfigModeProvider = ({
  children,
}: IConfigModeProvider): JSX.Element => {
  const [serverMode, setServerMode] = useState<boolean>(
    localStorage.getItem(SERVER_MODE) !== "false"
  );

  const [extMode, setExtMode] = useState<boolean>(
    localStorage.getItem(EXT_MODE) !== "false"
  );

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
    <ConfigModeContext.Provider
      value={{
        serverMode,
        toggleServerMode,
        extMode,
        toggleExtMode,
      }}
    >
      {children}
    </ConfigModeContext.Provider>
  );
};

export const useConfigMode = () => {
  const context = useContext(ConfigModeContext);
  if (!context) {
    throw new Error("useConfigMode must be used within a ConfigModeProvider");
  }
  return context;
};
