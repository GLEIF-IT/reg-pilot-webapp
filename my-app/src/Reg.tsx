import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import "./App.css";
import {
  isExtensionInstalled,
  requestAutoSignin,
  requestAid,
  requestCredential,
  trySettingVendorUrl,
} from "signify-polaris-web";
import fakeSigData from "./test/fakeSigData.json";
import { useDevMode } from "./context/devMode.tsx";
import { useSnackbar } from "./context/snackbar.tsx";

import ExtNotFound from "./components/ext-not-found.tsx";
import AppLayout from "./pages/app-layout.tsx";
import HomePage from "./pages/home.tsx";
import ReportsPage from "./pages/reports.tsx";
import StatusPage from "./pages/status.tsx";
import SettingsPage from "./pages/settings.tsx";

const statusPath = "/status";

const RegComponent = () => {
  const { devMode, toggleDevMode } = useDevMode();
  const { openSnackbar } = useSnackbar();
  const [signatureData, setSignatureData] = useState<any>();
  const [extensionInstalled, setExtensionInstalled] = useState<null | boolean>(
    null
  );

  const [selectedId, setSelectedId] = useState(""); // Step 2 Selection
  const [selectedAcdc, setSelectedAcdc] = useState(null); // Step 3 Selection
  const [serverUrl, setServerUrl] = useState("http://localhost:8000");

  const [vendorConf, setVendorConf] = useState(false);

  const [pingUrl, setPingUrl] = useState("");
  const [loginUrl, setLoginUrl] = useState("");

  const [aidLoading, setAidLoading] = useState(false);
  const [credLoading, setCredLoading] = useState(false);
  const [autoCredLoading, setAutoCredLoading] = useState(false);

  useEffect(() => {
    setPingUrl(serverUrl + "/ping");
    setLoginUrl(serverUrl + "/login");
  }, [serverUrl]);

  const handleSettingVendorUrl = async (url) => {
    await trySettingVendorUrl(url);
    setVendorConf(true);
  };

  const handleSignifyData = (data) => {
    console.log("signify-data", data);
    localStorage.setItem("signify-data", JSON.stringify(data, null, 2));
    if (data) {
      setSignatureData(data);
      setSelectedId(data.headers["signify-resource"]);
      setSelectedAcdc(data.credential);
      openSnackbar(
        data?.autoSignin
          ? "Success! Auto Signin Credential selected."
          : "Success! Credential selected.", "success"
      );
    } else {
      alert("Could not set signify data");
    }
  };

  const populateExtensionStatus = async () => {
    const extensionId = await isExtensionInstalled();
    setExtensionInstalled(Boolean(extensionId));
  };
  useEffect(() => {
    populateExtensionStatus();
  }, []);

  const removeData = () => {
    localStorage.removeItem("signify-data");
    setSignatureData("");
  };

  const handleAutoSignin = async () => {
    if (devMode) {
      handleSignifyData(fakeSigData);
    } else {
      setAutoCredLoading(true);
      const resp = await requestAutoSignin();
      console.log("data received", resp);
      if (resp) {
        handleSignifyData(resp);
      }
      setAutoCredLoading(false);
    }
  };

  const handleCredSignin = async () => {
    if (devMode) {
      handleSignifyData(fakeSigData);
    } else {
      setCredLoading(true);
      const resp = await requestCredential();
      setCredLoading(false);
      console.log("promised resp from requestCredential", resp);
      handleSignifyData(resp);
    }
  };

  const handleAidSignin = async () => {
    if (devMode) {
      handleSignifyData(fakeSigData);
    } else {
      setAidLoading(true);
      const resp = await requestAid();
      setAidLoading(false);
      console.log("promised resp from requestAid", resp);
      handleSignifyData(resp);
    }
  };

  if (extensionInstalled === null) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100vh" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (extensionInstalled === false) {
    return <ExtNotFound />;
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <AppLayout devMode={devMode} toggleDevMode={toggleDevMode} />
      <Box sx={{ marginTop: "60px", width: "100%" }}>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                devMode={devMode}
                selectedId={selectedId}
                selectedAcdc={selectedAcdc}
                handleCredSignin={handleCredSignin}
                handleAutoSignin={handleAutoSignin}
                handleAidSignin={handleAidSignin}
                aidLoading={aidLoading}
                credLoading={credLoading}
                autoCredLoading={autoCredLoading}
                removeData={removeData}
                signatureData={signatureData}
                loginUrl={loginUrl}
                handleSettingVendorUrl={handleSettingVendorUrl}
                vendorConf={vendorConf}
              />
            }
          />
          <Route
            path="/status"
            element={
              <StatusPage
                selectedAid={signatureData?.credential?.sad?.a?.i}
                devMode={devMode}
                serverUrl={serverUrl}
                statusPath={statusPath}
                signatureData={signatureData}
              />
            }
          />
          <Route
            path="/reports"
            element={
              <ReportsPage
                devMode={devMode}
                serverUrl={serverUrl}
                selectedAid={signatureData?.credential?.sad?.a?.i}
                selectedAcdc={signatureData?.credential?.sad?.d}
                signatureData={signatureData}
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
