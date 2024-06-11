import { createClient } from "signify-polaris-web";

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

  const postReport = async (
    rurl: string,
    request: any,
    sessionId: string
  ): Promise<any> => {
    const resp = await signifyClient.signRequest({
      url: rurl,
      method: request.method,
      sessionId,
      headers: request.headers,
    });
    if (request.headers) {
      delete request.headers["content-type"];
    }
    delete resp.headers["content-type"];
    return fetch(rurl, { ...request, headers: resp.headers });
  };

  const checkReport = async (
    rurl: string,
    request: any,
    sessionId: string
  ): Promise<any> => {
    const headers = await signifyClient.signRequest({
      url: rurl,
      method: request.method,
      sessionId,
      headers: request.headers,
    });
    return fetch(rurl, { ...request, headers });
  };

  const verify = async (
    rurl: string,
    request: any,
    sessionId: string
  ): Promise<any> => {
    const headers = await signifyClient.signRequest({
      url: rurl,
      sessionId,
      method: request.method,
      headers: request.headers,
    });
    return fetch(rurl, { ...request, headers });
  };

  const getStatus = async (
    rurl: string,
    request: any,
    sessionId: string
  ): Promise<any> => {
    const resp = await signifyClient.signRequest({
      url: rurl,
      sessionId,
      method: request.method,
      headers: request.headers,
    });
    return fetch(rurl, { ...request, headers: resp.headers });
  };

  return { ping, verify, postLogin, postReport, checkReport, getStatus };
};

export const regService = RegServer();
