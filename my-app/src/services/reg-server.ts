import { signifyHeaders } from "signify-polaris-web";

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
    signin
  ): Promise<any> => {
    const headers = await signifyHeaders(
      rurl,
      request,
      signin?.identifier?.name ?? signin.credential?.issueeName
    );
    return fetch(rurl, { ...request, headers });
  };

  const verify = async (rurl: string, request: any, signin): Promise<any> => {
    const headers = await signifyHeaders(
      rurl,
      request,
      signin?.identifier?.name ?? signin.credential?.issueeName
    );
    return fetch(rurl, { ...request, headers });
  };

  const getStatus = async (rurl: string, request: any, signin): Promise<any> => {
    const headers = await signifyHeaders(
      rurl,
      request,
      signin?.identifier?.name ?? signin?.credential?.issueeName
    );
    return fetch(rurl, { ...request, headers });
  };

  return { ping, verify, postLogin, postReport, getStatus };
};

export const regService = RegServer();
