import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./assets/css/layout.css";
import "./assets/css/nav.css";
import "./assets/css/common.css";
import "./assets/css/outweights.css";
import "./assets/css/daily.css";
import "./assets/css/storage.css";
import "./assets/css/login.css";
import "./assets/css/workerMainPage.css";
import App from "./App";
import { UnfinishedTicketsContextProvider } from "./context/UnfinishedTicketsContext";
import { FinishedTicketsContextProvider } from "./context/FinishedTicketsContext";
import { AwaitForPaymentTicketsContextProvider } from "./context/AwaitForPaymentTicketsContext";
import { UserContextProvider } from "./context/userContext";
import { SocketProvider } from "./context/socketContext";
import { ClientContextProvider } from "./context/ClientContext";
import { WalletContextProvider } from "./context/WalletContext";
import { NewTicketsContextProvider } from "./context/NewTicketsContext";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <UserContextProvider>
    <ClientContextProvider>
      <SocketProvider>
        <WalletContextProvider>
          <NewTicketsContextProvider>
            <AwaitForPaymentTicketsContextProvider>
              <FinishedTicketsContextProvider>
                <UnfinishedTicketsContextProvider>
                  <App />
                </UnfinishedTicketsContextProvider>
              </FinishedTicketsContextProvider>
            </AwaitForPaymentTicketsContextProvider>
          </NewTicketsContextProvider>
        </WalletContextProvider>
      </SocketProvider>
    </ClientContextProvider>
  </UserContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
