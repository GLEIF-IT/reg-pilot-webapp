import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import "./App.css";
import { createClient } from "signify-polaris-web";
import { regService } from "./services/reg-server.ts";
import fakeEcrCredential from "@test/credential/ecr.json";
import fakeOorCredential from "@test/credential/oor.json";
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
  const { extMode, serverMode } = useConfigMode();
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
    console.log("data received");
    console.log(data);

    if (!data) {
      alert("Could not set signify data");
      return;
    }

    try {
      if (serverMode) {
        await handleVerifyLogin(data);
      } else {
        openSnackbar("Response received: Verified", "success");
      }

      localStorage.setItem("signify-data", JSON.stringify(data));
      setSignatureData(data);
      setSelectedId(data?.headers?.["signify-resource"]);
      setSelectedAcdc(data.credential?.raw);
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
    if (extMode) {
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
    } else {
      handleSignifyData(fakeEcrCredential);
    }
  };

  const handleCredSignin = async (credType?: string) => {
    if (extMode) {
      setCredLoading(true);
      const resp = await signifyClient.authorize();
      setCredLoading(false);
      console.log("promised resp from signifyClient.authorizeCred()");
      console.log(resp);
      handleSignifyData(resp);
    } else {
      handleSignifyData(
        credType === "oor" ? fakeOorCredential : fakeEcrCredential
      );
    }
  };

  const handleAidSignin = async () => {
    if (extMode) {
      // setAidLoading(true);
      // const resp = await signifyClient.authorizeAid();
      // setAidLoading(false);
      // console.log("promised resp from signifyClient.authorizeAid()", resp);
      // handleSignifyData(resp);
    } else {
      handleSignifyData(fakeEcrCredential);
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
                aidName={signatureData?.credential?.raw?.issueeName}
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
                aidName={signatureData?.credential?.raw?.issueeName}
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
                aidName={signatureData?.credential?.raw?.issueeName}
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
