import { createRoot } from "react-dom/client";
import Popup from "@pages/popup/Popup";
import "@pages/popup/index.css";
import "@assets/styles/tailwind.css";

function init() {
  const rootContainer = document.querySelector("#__root");
  if (!rootContainer) throw new Error("Can't find Popup root element");
  const root = createRoot(rootContainer);
  root.render(<Popup />);

  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (
      sender.url ===
        "chrome-extension://" +
          chrome.runtime.id +
          "/service-worker-loader.js" &&
      request.type === "popup" &&
      request.subtype === "isOpened"
    ) {
      sendResponse({ data: { isOpened: true } });
    }
  });
}

init();
