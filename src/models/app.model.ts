import { useCurrentAccount } from "@mysten/dapp-kit";
import { createContainer } from "unstated-next";

const useContainer = () => {
  const account = useCurrentAccount();

  return {
    account,
    address: account?.address || "",
  };
};

export const AppModel = createContainer(useContainer);
export const useAppModel = AppModel.useContainer;
