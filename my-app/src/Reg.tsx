import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Box, CircularProgress, Snackbar, Alert } from "@mui/material";
import "./App.css";
import {
  isExtensionInstalled,
  subscribeToSignature,
  unsubscribeFromSignature,
  requestAutoSignin,
  requestCredential,
  trySettingVendorUrl,
  canCallAsync,
} from "signify-polaris-web";
import fakeSigData from "./test/fakeSigData.json";
import { useDevMode } from "./context/devMode.tsx";

import AppLayout from "./pages/app-layout.tsx";
import HomePage from "./pages/home.tsx";
import ReportsPage from "./pages/reports.tsx";
import StatusPage from "./pages/status.tsx";
import SettingsPage from "./pages/settings.tsx";

const statusPath = "/status";

const RegComponent = () => {
  const { devMode, toggleDevMode } = useDevMode();
  const [signatureData, setSignatureData] = useState<any>();
  const [extensionInstalled, setExtensionInstalled] = useState<null | boolean>(
    null
  );
  
  const [cstatus, setCstatus] = useState("Signed out");
  const [selectedId, setSelectedId] = useState(""); // Step 2 Selection
  const [selectedAcdc, setSelectedAcdc] = useState(null); // Step 3 Selection
  const [serverUrl, setServerUrl] = useState("http://localhost:8000");

  const [pingUrl, setPingUrl] = useState("");
  const [loginUrl, setLoginUrl] = useState("");
  
  useEffect(() => {
    setPingUrl(serverUrl + "/ping");
    setLoginUrl(serverUrl + "/login");
  }, [serverUrl]);
  

  const handleSignifyData = (data) => {
    localStorage.setItem("signify-data", JSON.stringify(data, null, 2));
    if (data) {
      setSignatureData(data);
      setSelectedId(data.headers["signify-resource"]);
      setSelectedAcdc(data.credential);
    } else {
      alert("Could not set signify data");
    }
  };

  useEffect(() => {
    if (!devMode) {
      subscribeToSignature(handleSignifyData);
      isExtensionInstalled((extensionId) => {
        setExtensionInstalled(Boolean(extensionId));
      });
    } else {
      if (!signatureData) {
        handleSignifyData(fakeSigData);
      }
    }

    return () => {
      if (!devMode) unsubscribeFromSignature();
    };
  }, []);

  const removeData = () => {
    localStorage.removeItem("signify-data");
    setSignatureData("");
  };

  const handleCredSignin = () => {
    if (devMode) {
      handleSignifyData(fakeSigData);
    } else {
      requestCredential();
    }
  };

  const handleRequestAutoSignin = async () => {
    console.log("canCallAsync()", canCallAsync());
    if (canCallAsync()) {
      const resp = await requestAutoSignin();
      if (resp) {
        handleSignifyData(resp);
      }
    } else {
      requestAutoSignin();
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <AppLayout devMode={devMode} toggleDevMode={toggleDevMode} />
      <Box sx={{ marginTop: "60px", width: '100%' }}>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                devMode={devMode}
                selectedId={selectedId}
                selectedAcdc={selectedAcdc}
                handleCredSignin={handleCredSignin}
                removeData={removeData}
                signatureData={signatureData}
                extensionInstalled={extensionInstalled}
                serverUrl={serverUrl}
                loginUrl={loginUrl}
                setServerUrl={setServerUrl}
              />
            }
          />
          <Route
            path="/status"
            element={
              <StatusPage
                selectedAid={selectedId}
                selectedAcdc={selectedAcdc}
                devMode={devMode}
                serverUrl={serverUrl}
                statusPath={statusPath}
              />
            }
          />
          <Route
            path="/reports"
            element={
              <ReportsPage
                devMode={devMode}
                serverUrl={serverUrl}
                selectedId={selectedId}
                selectedAcdc={selectedAcdc}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <SettingsPage
                devMode={devMode}
                selectedId={selectedId}
                selectedAcdc={selectedAcdc}
                signatureData={signatureData}
                extensionInstalled={extensionInstalled}
                serverUrl={serverUrl}
                setServerUrl={setServerUrl}
                pingUrl={pingUrl}
                setPingUrl={setPingUrl}
                loginUrl={loginUrl}
                setLoginUrl={setLoginUrl}
              />
            }
          />
        </Routes>
      </Box>
    </Box>
  );
};

export default RegComponent;
