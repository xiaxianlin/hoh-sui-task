import React from "react";
import ReactDOM from "react-dom/client";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import { ConfigProvider, theme } from "antd";
import { ConfigModel, useConfigModel } from "./models/config-model.ts";

import "@mysten/dapp-kit/dist/index.css";
import "./index.less";

const ClientContainer = () => {
  const { env, config, queryClient } = useConfigModel();

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={config.networkConfig} network={env}>
        <WalletProvider autoConnect>
          <App />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
};

const Container = () => {
  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <ConfigModel.Provider>
        <ClientContainer />
      </ConfigModel.Provider>
    </ConfigProvider>
  );
};

// @ts-ignore
const isDev = process.env.NODE_ENV === "development";

ReactDOM.createRoot(document.getElementById("root")!).render(
  isDev ? (
    <Container />
  ) : (
    <React.StrictMode>
      <Container />
    </React.StrictMode>
  ),
);
