import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert, AlertProps, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

interface ISnackbarProvider {
  children?: React.ReactNode;
}

interface ISnackbarContext {
  openSnackbar: (message: string, sev?: AlertProps["severity"], id?: string) => void;
  isSnackbarOpen: boolean;
  snackbarMessage: string;
  setSnackbarMessage: (message: string) => void;
  setSnackbarSeverity: (severity: AlertProps["severity"]) => void;
}

const SnackbarContext = createContext<ISnackbarContext | null>(null);

export const SnackbarProvider = ({ children }: ISnackbarProvider): JSX.Element => {
  const [isSnackbarOpen, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState<AlertProps["severity"]>("info");
  const [alertId, setAlertId] = useState("alert-message");

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const openSnackbar = (message: string, sev?: "info", id?: string) => {
    setSnackbarMessage(message);
    if (sev) {
      setSeverity(sev);
    }
    if (id) {
      setAlertId(id);
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
          action={
            <IconButton data-testid="alert-close-btn" onClick={handleClose} color="inherit" size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          }
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
          id={alertId}
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
