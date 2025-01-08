import React from "react";
import ReactDOM from "react-dom/client";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import { ConfigProvider, theme } from "antd";
import { ConfigModel, useConfigModel } from "./models/config.model.ts";

import "@mysten/dapp-kit/dist/index.css";
import "./index.less";

const ClientContainer = () => {
  const { env, config, client } = useConfigModel();
  return (
    <QueryClientProvider client={client}>
      <SuiClientProvider networks={config.networkConfig} network={env}>
        <WalletProvider autoConnect>
          <App />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <ConfigModel.Provider>
        <ClientContainer />
      </ConfigModel.Provider>
    </ConfigProvider>
  </React.StrictMode>,
);
