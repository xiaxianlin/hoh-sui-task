import { createContainer } from "unstated-next";
import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";
import { useMemo, useState } from "react";
import { QueryClient } from "@tanstack/react-query";

const useContainer = () => {
  const [env, setEnv] = useState<"devnet" | "testnet" | "mainnet">("testnet");
  const client = useMemo(() => new QueryClient(), []);
  const config = useMemo(
    () =>
      createNetworkConfig({
        devnet: { url: getFullnodeUrl("devnet") },
        testnet: { url: getFullnodeUrl("testnet") },
        mainnet: { url: getFullnodeUrl("mainnet") },
      }),
    [],
  );

  return {
    env,
    config,
    client,
    setEnv,
  };
};

export const ConfigModel = createContainer(useContainer);
export const useConfigModel = ConfigModel.useContainer;
