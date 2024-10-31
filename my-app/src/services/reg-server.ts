import { createClient } from "signify-polaris-web";
import { signifyService } from "@test/lib/signify";
import { ErrorMessages } from "@services/constants.ts";

const signifyClient = createClient();
const RegServer = () => {
  /**
   *
   * @param rurl e.g http://localhost:8081/ping
   * @returns text response e.g Pong
   */
  const ping = async (rurl: string) => {
    try {
      const response = await fetch(rurl);
      if (response) {
        const responseStr = await response.text();
        return responseStr;
      }
    } catch (error) {
      throw error;
    }
  };

  const postLogin = async (rurl: string, request: any) => {
    return fetch(rurl, request);
  };

  const dropReportStatusByAid = async (
    rurl: string,
    request: any,
    extMode: boolean,
    aidName: string
  ): Promise<Response> => {
    let resp;
    if (extMode) {
      resp = await signifyClient.signRequest({
        url: rurl,
        method: request.method,
        headers: request.headers,
      });
    } else {
      resp = await signifyService.getSignedHeaders({
        rurl,
        method: request.method,
        headers: request.headers,
        aidName,
      });
    }
    const sresp = fetch(rurl, { ...request, headers: resp.headers });
    return sresp;
  };

  const postReport = async (
    rurl: string,
    request: any,
    extMode: boolean,
    aidName: string
  ): Promise<any> => {
    let resp;
    if (extMode) {
      resp = await signifyClient.signRequest({
        url: rurl,
        method: request.method,
        headers: request.headers,
      });
    } else {
      resp = await signifyService.getSignedHeaders({
        rurl,
        method: request.method,
        headers: request.headers,
        aidName,
      });
    }

    if (request.headers) {
      delete request.headers["content-type"];
    }
    delete resp.headers["content-type"];
    return fetch(rurl, {
      ...request,
      headers: { ...resp.headers },
    });
  };

  const checkReport = async (
    rurl: string,
    request: any,
    extMode: boolean,
    aidName: string
  ): Promise<any> => {
    let resp;
    if (extMode) {
      resp = await signifyClient.signRequest({
        url: rurl,
        method: request.method,
        headers: request.headers,
      });
    } else {
      resp = await signifyService.getSignedHeaders({
        rurl,
        method: request.method,
        headers: request.headers,
        aidName,
      });
    }
    return fetch(rurl, { ...request, headers: resp.headers });
  };

  const checkLogin = async (rurl: string, request: any) => {
    return new Promise(async (resolve, reject) => {
      const checkLoginResp = await fetch(rurl, request);
      const checkLoginRespData = await checkLoginResp.json();
      if (checkLoginResp.status >= 400) {
        reject(checkLoginRespData);
      } else {
        if (checkLoginRespData?.msg?.includes(ErrorMessages.pending_auth)) {
          const interloopCheckLogin = setInterval(async () => {
            const _resp = await fetch(rurl, request);
            const _respData = await _resp.json();
            if (
              _respData.status < 400 &&
              !_respData?.msg?.includes(ErrorMessages.pending_auth)
            ) {
              clearInterval(interloopCheckLogin);
              resolve(_respData);
            }
          }, 3000);
        } else {
          resolve(checkLoginRespData);
        }
      }
    });
  };

  const verify = async (
    rurl: string,
    request: any,
    extMode: boolean,
    aidName: string
  ): Promise<any> => {
    let resp;
    if (extMode) {
      resp = await signifyClient.signRequest({
        url: rurl,
        method: request.method,
        headers: request.headers,
      });
    } else {
      resp = await signifyService.getSignedHeaders({
        rurl,
        method: request.method,
        headers: request.headers,
        aidName,
      });
    }

    return fetch(rurl, { ...request, headers: resp.headers });
  };

  const getStatus = async (
    rurl: string,
    request: any,
    extMode: boolean,
    aidName: string
  ): Promise<any> => {
    let resp;
    if (extMode) {
      resp = await signifyClient.signRequest({
        url: rurl,
        method: request.method,
        headers: request.headers,
      });
      console.log("getStatus resp");
      console.log(resp.headers);
    } else {
      resp = await signifyService.getSignedHeaders({
        rurl,
        method: request.method,
        headers: request.headers,
        aidName,
      });
    }
    return fetch(rurl, { ...request, headers: resp.headers });
  };

  return {
    ping,
    verify,
    postLogin,
    postReport,
    dropReportStatusByAid,
    checkReport,
    getStatus,
    checkLogin,
  };
};

export const regService = RegServer();
