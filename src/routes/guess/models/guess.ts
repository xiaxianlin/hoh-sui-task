import { useState } from "react";
import { createContainer } from "unstated-next";
import { bytesToHex, hexToBytes } from "@noble/curves/abstract/utils";
import { bls12_381 as bls } from "@noble/curves/bls12-381";

const useGuessContainer = () => {
  const [privKeyHex, setPrivKeyHex] = useState("");

  const getHousePubHex = () => {
    return hexToBytes(privKeyHex).length === 32 ? bytesToHex(bls.getPublicKey(privKeyHex)) : "";
  };

  return {
    privKeyHex,
    setPrivKeyHex,
    getHousePubHex,
  };
};

export const GuessModel = createContainer(useGuessContainer);
export const useGuessModel = GuessModel.useContainer;
