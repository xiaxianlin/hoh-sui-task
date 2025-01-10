import { SuiObjectData } from "@mysten/sui/client";
import { MIST_PER_SUI } from "@mysten/sui/utils";

export const usdc_balance = (balance: string = "") => Number(balance) / 1_000_000;
export const balance = (balance: string = "") => {
  return Number.parseInt(balance) / Number(MIST_PER_SUI);
};

export const getCounterFields = <T>(data?: SuiObjectData | null): T | undefined => {
  if (data?.content?.dataType !== "moveObject") {
    return;
  }
  return data.content.fields as T;
};
