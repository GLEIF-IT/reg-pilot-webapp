import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import "./App.css";
import { createClient } from "signify-polaris-web";
import { regService } from "./services/reg-server.ts";
import fakeSigData from "./test/fakeSigData.json";
import { useConfigMode } from "@context/configMode.tsx";
import { useSnackbar } from "@context/snackbar.tsx";

import ExtNotFound from "./components/ext-not-found.tsx";
import AppLayout from "./pages/app-layout.tsx";
import HomePage from "./pages/home.tsx";
import ReportsPage from "./pages/reports.tsx";
import StatusPage from "./pages/status.tsx";
import SettingsPage from "./pages/settings.tsx";

const statusPath = "/status";

const signifyClient = createClient();

const RegComponent = () => {
  const location = useLocation();
  const { devMode } = useConfigMode();
  const { openSnackbar } = useSnackbar();
  const [signatureData, setSignatureData] = useState<any>();
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);
  const [extensionInstalled, setExtensionInstalled] = useState<null | boolean>(
    null
  );

  const [selectedId, setSelectedId] = useState(""); // Step 2 Selection
  const [selectedAcdc, setSelectedAcdc] = useState(null); // Step 3 Selection
  const [serverUrl, setServerUrl] = useState(
    "https://reg-api-test.rootsid.cloud"
  );

  const [vendorConf, setVendorConf] = useState(false);

  const [pingUrl, setPingUrl] = useState(serverUrl + "/ping");
  const [loginUrl, setLoginUrl] = useState(serverUrl + "/login");

  const [aidLoading, setAidLoading] = useState(false);
  const [credLoading, setCredLoading] = useState(false);
  const [autoCredLoading, setAutoCredLoading] = useState(false);

  useEffect(() => {
    setPingUrl(serverUrl + "/ping");
    setLoginUrl(serverUrl + "/login");
  }, [serverUrl]);

  const handleInitialSignatureLoad = async () => {
    setIsLoadingInitial(true);
    // await handleSignifyData(JSON.parse(localStorage.getItem("signify-data")));
    setIsLoadingInitial(false);
  };

  const handleSettingVendorUrl = async (url: string) => {
    await signifyClient.configureVendor({ url });
    setVendorConf(true);
  };

  const handleVerifyLogin = async (data) => {
    let vlei_cesr = data?.credential.cesr;
    const requestBody = {
      said: data.credential?.raw?.sad?.d,
      vlei: vlei_cesr,
    };
    const lhead = new Headers();
    lhead.set("Content-Type", "application/json");
    const lRequest = {
      headers: lhead,
      method: "POST",
      body: JSON.stringify(requestBody),
    };
    // loginUrl
    const response = await regService.postLogin(loginUrl, lRequest);
    const responseData = await response.json();

    if (response.status >= 400) {
      throw new Error(responseData.msg);
    }
    if (!response) return;

    if (responseData.msg) {
      openSnackbar(responseData.msg, "success");
    }
  };

  const handleSignifyData = async (data) => {
    if (!data) {
      alert("Could not set signify data");
      return;
    }

    try {
      if (devMode) {
        openSnackbar("<Devmode> Response received: Verified", "success");
      } else {
        await handleVerifyLogin(data);
      }

      localStorage.setItem("signify-data", JSON.stringify(data));
      setSignatureData(data);
      setSelectedId(data?.headers?.["signify-resource"]);
      setSelectedAcdc(data.credential?.raw);
      openSnackbar(
        data?.autoSignin
          ? "Success! Auto Signin Credential selected."
          : "Success! Credential selected.",
        "success"
      );
    } catch (error) {
      if (typeof error?.message === "string")
        openSnackbar(error?.message, "error");
      else
        openSnackbar(`Unable to connect with server at ${loginUrl}`, "error");
    }
  };

  const populateExtensionStatus = async () => {
    const extensionId = await signifyClient.isExtensionInstalled();
    setExtensionInstalled(Boolean(extensionId));
    if (extensionId) {
      if (localStorage.getItem("signify-data")) {
        handleInitialSignatureLoad();
      } else if (location.pathname !== "/") {
        handleCredSignin();
      }
    }
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
      // setAutoCredLoading(true);
      // try {
      //   const resp = await signifyClient.authorizeAutoSignin();
      //   console.log("data received", resp);
      //   if (resp) {
      //     handleSignifyData(resp);
      //   }
      // } catch (error) {
      //   openSnackbar(error?.message, "error");
      // }
      // setAutoCredLoading(false);
    }
  };

  const handleCredSignin = async () => {
    if (devMode) {
      handleSignifyData(fakeSigData);
    } else {
      setCredLoading(true);
      const resp = await signifyClient.authorize();
      setCredLoading(false);
      console.log("promised resp from signifyClient.authorizeCred()", resp);
      handleSignifyData(resp);
    }
  };

  const handleAidSignin = async () => {
    if (devMode) {
      handleSignifyData(fakeSigData);
    } else {
      // setAidLoading(true);
      // const resp = await signifyClient.authorizeAid();
      // setAidLoading(false);
      // console.log("promised resp from signifyClient.authorizeAid()", resp);
      // handleSignifyData(resp);
    }
  };

  if (extensionInstalled === null || isLoadingInitial) {
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
      <AppLayout />
      <Box sx={{ marginTop: "60px", width: "100%" }}>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
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
                selectedAid={signatureData?.credential?.raw?.sad?.a?.i}
                serverUrl={serverUrl}
                statusPath={statusPath}
                signatureData={signatureData}
                handleSignifyData={handleSignifyData}
              />
            }
          />
          <Route
            path="/reports"
            element={
              <ReportsPage
                serverUrl={serverUrl}
                selectedAid={signatureData?.credential?.raw?.sad?.a?.i}
                selectedAcdc={signatureData?.credential?.raw?.sad?.d}
                signatureData={signatureData}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <SettingsPage
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
