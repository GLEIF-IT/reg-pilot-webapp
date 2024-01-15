import { useState, useEffect } from "react";
import { IdentifierCard } from "@components/identifierCard";
import { IMessage } from "@pages/background/types";

export function SelectIdentifier(): JSX.Element {
  const [aids, setAids] = useState([]);
  const fetchIdentifiers = async () => {
    const { data } = await chrome.runtime.sendMessage<IMessage<void>>({
      type: "fetch-resource",
      subtype: "identifiers",
    });
    console.log("data", data);
    setAids(data.aids);
  };

  const createSigninWithIdentifiers = async (aid: any) => {
    await chrome.runtime.sendMessage<IMessage<any>>({
      type: "create-resource",
      subtype: "signin",
      data: {
        identifier: aid,
      },
    });

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id!,
        { type: "tab", subtype: "reload-state" });
    });
    window.close();
  };

  useEffect(() => {
    fetchIdentifiers();
  }, []);

  return (
    <>
      {aids.map((aid, index) => (
        <div key={index} className="my-2 mx-4">
          <div className=" relative opacity-80 hover:opacity-100">
            <IdentifierCard aid={aid} />
            <button
              type="button"
              onClick={() => createSigninWithIdentifiers(aid)}
              className=" absolute right-0 bottom-0 text-white bg-green font-medium rounded-full text-xs px-2 py-1 text-center me-2 mb-2"
            >
              {"Select >"}
            </button>
          </div>
        </div>
      ))}
    </>
  );
}