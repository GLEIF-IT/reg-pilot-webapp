import { SignifyClient, Tier, ready, randomPasscode } from "signify-ts";
import AgentData from "@test/lib/agent.json";

const Signify = () => {
  let _client: SignifyClient | null;

  const connect = async (agentUrl: string, passcode: string) => {
    try {
      await ready();
      _client = new SignifyClient(agentUrl, passcode, Tier.low);
      await _client.connect();
      const state = await getState();
    } catch (error) {
      console.error(error);
      _client = null;
      return { error };
    }
  };

  const getState = async () => {
    return await _client?.state();
  };

  const isConnected = async () => {
    if (!_client) {
      await connect(AgentData.url, AgentData.passcode);
    }

    try {
      const state = await getState();
      console.log("Signify client is connected", _client);
      return _client && state?.controller?.state?.i ? true : false;
    } catch (error) {
      console.log(
        _client
          ? "Signify client is not valid, unable to connect"
          : "Signify client is not connected",
        _client
      );
      return false;
    }
  };

  /**
   * @param rurl - resource url that the request is being made to -- required
   * @param method - http method of the request -- default GET
   * @param headers - headers object of the request -- default empty
   * @param aidName -- required
   * @returns Promise<Request> - returns a signed headers request object
   */
  const getSignedHeaders = async ({
    rurl,
    method = "GET",
    headers = new Headers({}),
    aidName,
  }: {
    rurl: string;
    method?: string;
    headers?: Headers;
    aidName: string;
  }): Promise<any> => {
    // in case the client is not connected, try to connect
    const connected = await isConnected();
    if (!connected) {
      throw new Error("Signify client is not connected");
    }

    const sreq = await _client?.createSignedRequest(aidName, rurl, {
      method,
      headers,
    });
    let jsonHeaders: { [key: string]: string } = {};
    for (const pair of sreq?.headers?.entries()) {
      jsonHeaders[pair[0]] = pair[1];
    }

    return {
      headers: jsonHeaders,
    };
  };

  return {
    getSignedHeaders,
  };
};

export const signifyService = Signify();
