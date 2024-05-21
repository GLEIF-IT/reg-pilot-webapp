import React, { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import { useSnackbar } from "../context/snackbar.tsx";
import fakeLoginResponse from "../test/fakeLoginResponse.json";
import ServerInfo from "../components/home/server-info.tsx";
import { regService } from "../services/reg-server.ts";
import fakeCheckStatus from "../test/fakeCheckStatus.json";
import fakeFileUpload from "../test/fakeFileUpload.json";

const getFakeFileResponse = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(fakeFileUpload);
    }, 2000);
  });
};

const SettingsPage = ({
  devMode,
  selectedId,
  selectedAcdc,
  signatureData,
  extensionInstalled,
  serverUrl,
  setServerUrl,
  pingUrl,
  setPingUrl,
  loginUrl,
  setLoginUrl,
}: {
  devMode: boolean;
  selectedId: any;
  selectedAcdc: any;
  signatureData: any;
  extensionInstalled: any;
  serverUrl: any;
  setServerUrl: any;
  pingUrl: any;
  setPingUrl: any;
  loginUrl: any;
  setLoginUrl: any;
}) => {
  const { openSnackbar } = useSnackbar();

  // Define the endpoint paths
  const [pingResponse, setPingResponse] = useState("");

  const [loginRequest, setLoginRequest] = useState<any>("");
  const [loginResponse, setLoginResponse] = useState<any>("");

  const [verifyUrl, setVerifyUrl] = useState(`${serverUrl}/verify/headers`);
  const [verifyRequest, setVerifyRequest] = useState<any>("");
  const [verifyResponse, setVerifyResponse] = useState<any>("");

  const [statusUrl, setStatusUrl] = useState(
    `${serverUrl}/status/${selectedId}`
  );
  const [statusRequest, setStatusRequest] = useState<any>("");
  const [statusResponse, setStatusResponse] = useState<any>("");

  const [reportUrl, setReportUrl] = useState(
    `${serverUrl}/upload/${selectedId}/${selectedAcdc?.anchor?.pre}`
  );
  const [reportRequest, setReportRequest] = useState<any>("");
  const [reportResponse, setReportResponse] = useState<any>("");

  useEffect(() => {
    handleSetRequests();
  }, []);

  useEffect(() => {
    setVerifyUrl(`${serverUrl}/verify/headers`);
    setStatusUrl(`${serverUrl}/status/${selectedId}`);
    setReportUrl(
      `${serverUrl}/upload/${selectedId}/${selectedAcdc?.anchor?.pre}`
    );
  }, [serverUrl]);

  const handleSetRequests = () => {
    let vlei_cesr = signatureData?.credential.cesr;
    console.log("vlei cesr", vlei_cesr);
    console.log("signatureData", signatureData);
    console.log("Login url is", loginUrl);

    // Create the request body object
    let heads = new Headers();
    heads.set("Content-Type", "application/json");
    setLoginRequest({
      headers: heads,
      method: "POST",
      body: JSON.stringify({ said: selectedAcdc?.sad?.d, vlei: vlei_cesr }),
    });

    setVerifyRequest({ method: "GET", headers: signatureData?.headers });
    setStatusRequest({ method: "GET", headers: signatureData?.headers });
    setReportRequest({ method: "POST", headers: signatureData?.headers });
  };

  async function handlePing() {
    if (devMode) {
      setPingResponse("PONG");
      openSnackbar(`<Devmode> Response received: PONG`, "success");
      return;
    }

    // Make the API request using the fetch function
    try {
      const response = (await regService.ping(pingUrl)) as string;
      setPingResponse(response);
    } catch (error) {
      openSnackbar(`Unable to connect with server at ${pingUrl}`, "error");
    }
  }

  const handleLogin = async () => {
    if (devMode) {
      setLoginResponse(fakeLoginResponse);
      openSnackbar("<Devmode> Response received!", "success");
      return;
    }

    try {
      const response = await regService.postLogin(`${loginUrl}`, {
        ...loginRequest,
      });
      const data = await response.json();
      setLoginResponse(data);

      if (response.status >= 400) {
        throw new Error(data.msg);
      }
      openSnackbar("Credential verified!", "success");
    } catch (error) {
      openSnackbar(error?.message, "error");
      console.error("Error in login", error);
    }
  };

  const handleVerify = async () => {
    if (devMode) {
      setVerifyResponse("");
      openSnackbar("<Devmode> Response received!", "success");
      return;
    }

    try {
      const response = await regService.verify(
        verifyUrl,
        verifyRequest,
        signatureData,
      );
      const response_signed_data = await response.json();
      setVerifyResponse(response_signed_data);
      if (!response) return;
      if (response.status >= 400) {
        throw new Error(response_signed_data?.title);
      }
    } catch (error) {
      openSnackbar(error?.message, "error");
    }
  };

  const handleStatus = async () => {
    if (devMode) {
      const aid = "ECJLhLl1-xtrgi9SktH-8_Qc5yz2B24fT6fhdO9o3BdQ";
      if (Object.keys(fakeCheckStatus).includes(aid)) {
        const fakeStatueAid = fakeCheckStatus[aid] ?? [];
        setStatusResponse(fakeStatueAid.map((ele) => JSON.parse(ele)));
      } else {
        alert("check status fake data: no data found for aid: " + aid);
      }
      openSnackbar("<Devmode> Response received!", "success");
      return;
    }

    try {
      const response = await regService.getStatus(
        statusUrl,
        statusRequest,
        signatureData
      );
      const response_signed_data = await response.json();
      setStatusResponse(response_signed_data);
      if (!response) return;
      if (response.status >= 400) {
        throw new Error(
          `${response_signed_data?.msg}`
        );
      }
    } catch (error) {
      openSnackbar(error?.message, "error");
    }
  };

  const handleReportUpload = async (report) => {
    if (devMode) {
      const fakeFile = await getFakeFileResponse();
      setReportResponse(fakeFile);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("upload", report);
      const lRequest = {
        ...reportRequest,
        body: formData,
      };
      const response = await regService.postReport(
        reportUrl,
        lRequest,
        signatureData,
      );
      const response_signed_data = await response.json();
      console.log("upload response", response_signed_data);
      setReportResponse(response_signed_data);
      if (response.status >= 400) {
        throw new Error(
          `${response_signed_data?.msg ?? response_signed_data?.title}`
        );
      }
      return response_signed_data;
    } catch (error) {
      console.error("Error uploading report", error);
      openSnackbar(error?.message, "error");
    }
  };

  return (
    <Grid container spacing={1} style={{ padding: "32px" }}>
      <Grid item xs={12}>
        <Box sx={{ maxHeight: "500px", overflow: "scroll", paddingX: "32px" }}>
          {extensionInstalled ? (
            <>
              {signatureData && (
                <ServerInfo
                  serverUrl={serverUrl}
                  pingUrl={pingUrl}
                  handlePing={handlePing}
                  pingResponse={pingResponse}
                  loginUrl={loginUrl}
                  handleLogin={handleLogin}
                  loginRequest={loginRequest}
                  loginResponse={loginResponse}
                  setServerUrl={setServerUrl}
                  setPingUrl={setPingUrl}
                  setLoginUrl={setLoginUrl}
                  verifyUrl={verifyUrl}
                  setVerifyUrl={setVerifyUrl}
                  verifyRequest={verifyRequest}
                  verifyResponse={verifyResponse}
                  handleVerify={handleVerify}
                  statusUrl={statusUrl}
                  setStatusUrl={setStatusUrl}
                  statusRequest={statusRequest}
                  statusResponse={statusResponse}
                  handleStatus={handleStatus}
                  reportUrl={reportUrl}
                  setReportUrl={setReportUrl}
                  reportRequest={reportRequest}
                  reportResponse={reportResponse}
                  handleReportUpload={handleReportUpload}
                />
              )}
            </>
          ) : (
            <></>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default SettingsPage;
