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

  const postLogin = async (
    url: string,
    request: any,
  ): Promise<any> => {
    
    const response = await fetch(url, request);
    const responseData = await response.text();
    return responseData;
  };

  return { ping, postLogin };
};

export const regService = RegServer();
