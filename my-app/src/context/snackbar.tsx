import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert, AlertProps } from "@mui/material";

interface ISnackbarProvider {
  children?: React.ReactNode;
}

interface ISnackbarContext {
  openSnackbar: (message: string, sev?: AlertProps["severity"]) => void;
  isSnackbarOpen: boolean;
  snackbarMessage: string;
  setSnackbarMessage: (message: string) => void;
  setSnackbarSeverity: (severity: AlertProps["severity"]) => void;
}

const SnackbarContext = createContext<ISnackbarContext | null>(null);

export const SnackbarProvider = ({
  children,
}: ISnackbarProvider): JSX.Element => {
  const [isSnackbarOpen, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState<AlertProps["severity"]>("info");

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const openSnackbar = (message: string, sev?: "info") => {
    setSnackbarMessage(message);
    if (sev) {
      setSeverity(sev);
    }
    setOpenSnackbar(true);
  };

  const setSnackbarSeverity = (sev: AlertProps["severity"]) => {
    setSeverity(sev);
  };

  return (
    <SnackbarContext.Provider
      value={{
        isSnackbarOpen,
        openSnackbar,
        snackbarMessage,
        setSnackbarMessage,
        setSnackbarSeverity,
      }}
    >
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      {children}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};
