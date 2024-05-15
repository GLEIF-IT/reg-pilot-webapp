import { signifyHeaders } from "signify-polaris-web";

const RegServer = () => {
  /**
   *
   * @param url e.g http://localhost:8081/ping
   * @returns text response e.g Pong
   */
  const ping = async (url: string) => {
    try {
      const response = await fetch(url);
      if (response) {
        const responseStr = await response.text();
        return responseStr;
      }
    } catch (error) {
      throw error;
    }
  };

  const postLogin = async (url: string, request: any) => {
    return fetch(url, request);
  };

  const postReport = async (
    url: string,
    request: any,
    signin,
    fetchHeaders: boolean
  ): Promise<any> => {
    return signifyHeaders(
      url,
      request,
      fetchHeaders,
      signin?.identifier?.name ?? signin.credential?.issueeName
    );
  };

  const verify = async (
    url: string,
    request: any,
    signin,
    fetchHeaders: boolean
  ): Promise<any> => {
    const vreq = signifyHeaders(
      url,
      request,
      fetchHeaders,
      signin?.identifier?.name ?? signin.credential?.issueeName
    ) as unknown as Request;
    return await fetch(vreq);
  };

  const getStatus = async (
    url: string,
    request: any,
    signin,
    fetchHeaders: boolean
  ): Promise<any> => {
    const req = signifyHeaders(
      url,
      request,
      fetchHeaders,
      signin?.identifier?.name ?? signin?.credential?.issueeName
    ) as unknown as Request;
    return fetch(req);
  };

  return { ping, verify, postLogin, postReport, getStatus };
};

export const regService = RegServer();
