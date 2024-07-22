import { createClient } from "signify-polaris-web";
import { signifyService } from "@test/lib/signify";
import dummyHeaders from "@test/credential/signed_header.json";

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
    return fetch(rurl, { ...request, headers: resp.headers });
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

  return { ping, verify, postLogin, postReport, checkReport, getStatus };
};

export const regService = RegServer();
