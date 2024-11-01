import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import { useSnackbar } from "../context/snackbar.tsx";
import fakeLoginResponse from "../test/fakeLoginResponse.json";
import ServerInfo from "../components/home/server-info.tsx";
import { useConfigMode } from "@context/configMode";
import { regService } from "../services/reg-server.ts";
import { generateFileDigest } from "@services/utils.ts";
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
  checkloginUrl,
  aidName,
}: {
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
  checkloginUrl: any;
}) => {
  const navigate = useNavigate();
  const { serverMode, extMode } = useConfigMode();
  const { openSnackbar } = useSnackbar();

  // Define the endpoint paths
  const [pingResponse, setPingResponse] = useState("");

  const [loginRequest, setLoginRequest] = useState<any>("");
  const [loginResponse, setLoginResponse] = useState<any>("");

  const [checkloginRequest, setCheckLoginRequest] = useState<any>("");
  const [_checkloginUrl, setCheckloginUrl] = useState<any>(`${checkloginUrl}/${selectedId}`);
  const [checkloginResponse, setCheckLoginResponse] = useState<any>("");

  const [verifyUrl, setVerifyUrl] = useState(`${serverUrl}/verify/headers`);
  const [verifyRequest, setVerifyRequest] = useState<any>("");
  const [verifyResponse, setVerifyResponse] = useState<any>("");

  const [statusUrl, setStatusUrl] = useState(
    `${serverUrl}/status/${selectedId}`
  );
  const [statusRequest, setStatusRequest] = useState<any>("");
  const [statusResponse, setStatusResponse] = useState<any>("");

  const [reportUrl, setReportUrl] = useState(
    `${serverUrl}/upload/${selectedId}`
  );
  const [reportRequest, setReportRequest] = useState<any>("");
  const [reportResponse, setReportResponse] = useState<any>("");

  useEffect(() => {
    if (!signatureData) {
      navigate("/?from=settings");
    }
  }, []);

  useEffect(() => {
    handleSetRequests();
  }, []);

  useEffect(() => {
    setVerifyUrl(`${serverUrl}/verify/headers`);
    setStatusUrl(`${serverUrl}/status/${selectedId}`);
    setReportUrl(
      `${serverUrl}/upload/${selectedId}`
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
      body: JSON.stringify({
        said: selectedAcdc?.sad?.d,
        vlei: vlei_cesr,
      }),
    });

    setCheckLoginRequest({
      headers: heads,
      method: "GET",
      body: null,
    });

    setVerifyRequest({ method: "GET", headers: signatureData?.headers });
    setStatusRequest({ method: "GET", headers: signatureData?.headers });
    setReportRequest({ method: "POST", headers: signatureData?.headers });
  };

  async function handlePing() {
    if (!serverMode) {
      setPingResponse("PONG");
      openSnackbar(`<Mocked> Response received: PONG`, "success");
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
    if (!serverMode) {
      setLoginResponse(fakeLoginResponse);
      openSnackbar("<Mocked> Response received!", "success");
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
      openSnackbar(data?.msg, "success");
    } catch (error) {
      openSnackbar(error?.message, "error");
      console.error("Error in login", error);
    }
  };

  const handleCheckLogin = async () => {
    if (!serverMode) {
      setLoginResponse(fakeLoginResponse);
      openSnackbar("<Mocked> Response received!", "success");
      return;
    }

    try {
      const response = await regService.postLogin(_checkloginUrl, {
        ...checkloginRequest,
      });
      const data = await response.json();
      setLoginResponse(data);

      if (response.status >= 400) {
        throw new Error(data.msg);
      }
      openSnackbar(data?.msg, "success");
    } catch (error) {
      openSnackbar(error?.message, "error");
      console.error("Error in login", error);
    }
  };

  const handleVerify = async () => {
    if (!serverMode) {
      setVerifyResponse("");
      openSnackbar("<Mocked> Response received!", "success");
      return;
    }

    try {
      const response = await regService.verify(
        verifyUrl,
        verifyRequest,
        extMode,
        aidName
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
    if (!serverMode) {
      const aid = "ECJLhLl1-xtrgi9SktH-8_Qc5yz2B24fT6fhdO9o3BdQ";
      if (Object.keys(fakeCheckStatus).includes(aid)) {
        const fakeStatueAid = fakeCheckStatus[aid] ?? [];
        setStatusResponse(fakeStatueAid.map((ele) => JSON.parse(ele)));
      } else {
        alert("check status fake data: no data found for aid: " + aid);
      }
      openSnackbar("<Mocked> Response received!", "success");
      return;
    }

    try {
      const response = await regService.getStatus(
        statusUrl,
        statusRequest,
        extMode,
        aidName
      );
      const response_signed_data = await response.json();
      setStatusResponse(response_signed_data);
      if (!response) return;
      if (response.status >= 400) {
        throw new Error(`${response_signed_data?.msg}`);
      }
    } catch (error) {
      openSnackbar(error?.message, "error");
    }
  };

  const handleReportUpload = async (report) => {
    if (!serverMode) {
      const fakeFile = await getFakeFileResponse();
      setReportResponse(fakeFile);
      return;
    }

    const reader = new FileReader();
    reader.onload = async function () {
      const signedZipBuf = reader?.result as ArrayBuffer;
      const signedZipDig = await generateFileDigest(signedZipBuf);
      const formData = new FormData();
      const ctype = "application/zip";
      const blob = new Blob([signedZipBuf], { type: ctype });
      formData.append("upload", blob, report.name);
      try {
        const lRequest = {
          method: "POST",
          body: formData,
        };
        const response = await regService.postReport(
          `${reportUrl}/${signedZipDig}`,
          lRequest,
          extMode,
          aidName
        );
        const response_signed_data = await response.json();
        setReportResponse(response_signed_data);
        if (response.status >= 400) {
          throw new Error(
            `${response_signed_data?.detail ?? response_signed_data?.title}`
          );
        }
        openSnackbar(
          response_signed_data?.message,
          response_signed_data?.status === "failed" ? "warning" : "success"
        );

        return response_signed_data;
      } catch (error) {
        console.error("Error uploading report", error);
        openSnackbar(error?.message, "error");
      }
    };
    reader.readAsArrayBuffer(report);
  };

  return (
    <Grid container spacing={1} style={{ padding: "32px" }}>
      <Grid item xs={12}>
        <Box sx={{ maxHeight: "500px", overflow: "scroll", paddingX: "32px" }}>
          {extensionInstalled ? (
            <>
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
                checkloginUrl={_checkloginUrl}
                setCheckloginUrl={setCheckloginUrl}
                handleCheckLogin={handleCheckLogin}
              />
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
