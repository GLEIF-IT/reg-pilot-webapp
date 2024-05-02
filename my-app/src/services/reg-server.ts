import { signifyFetch } from "../temp-signify-polaris-web";

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

  const postLogin = async (url: string, request: any): Promise<any> => {
    const response = await fetch(url, request);
    const { error, ...rest } = await response.json();

    if (error) throw error;

    return rest;
  };

  const postReport = async (
    url: string,
    request: any,
    signin,
    fetchHeaders: boolean
  ): Promise<any> => {
    const response_signed = await signifyFetch(
      url,
      request,
      fetchHeaders,
      signin?.identifier?.name ?? signin.credential?.issueeName
    );
    const response_signed_data = await response_signed.json();
    return response_signed_data;
  };

  const getStatus = async (url: string, request: any, signin, fetchHeaders: boolean): Promise<any> => {
    const resp = await signifyFetch(
      url,
      request,
      fetchHeaders,
      signin?.identifier?.name ?? signin?.credential?.issueeName
    );
    const { error, ...rest } = await resp.json();
    if (error) throw error;

    return rest;
  };

  return { ping, postLogin, postReport, getStatus };
};

export const regService = RegServer();
