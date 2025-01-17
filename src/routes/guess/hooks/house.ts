import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { GUESS_HOUSE_CAP_ID, GUESS_PACKAGE_ID, OBJECT_TYPE } from "../constants";
import { bcs } from "@mysten/sui/bcs";
import { message } from "antd";
import { hexToBytes } from "@noble/curves/abstract/utils";
import { useState } from "react";
import { useGuessModel } from "../models/guess";
import { SuiTransactionBlockResponse } from "@mysten/sui/client";

export const useHouseInitialize = () => {
  const { getHousePubHex } = useGuessModel();

  const [houseId, setHouseId] = useState("");
  const { mutate, isPending } = useSignAndExecuteTransaction({
    onError: (err) => {
      console.log(err);
      message.error("开房失败:" + err.message);
    },
    onSuccess: (result: SuiTransactionBlockResponse) => {
      console.log(result);

      let id = "";
      result.objectChanges?.some((oc) => {
        if (oc.type === "created" && oc.objectType === OBJECT_TYPE.House) {
          id = oc.objectId;
          return true;
        }
      });
      setHouseId(id);
    },
  });

  const init = (houseStake: number) => {
    const tx = new Transaction();
    const [houseStakeCoin] = tx.splitCoins(tx.gas, [BigInt(houseStake)]);
    tx.moveCall({
      target: `${GUESS_PACKAGE_ID}::house_data::initialize_house_data`,
      arguments: [
        tx.object(GUESS_HOUSE_CAP_ID),
        houseStakeCoin,
        tx.pure(bcs.vector(bcs.U8).serialize(hexToBytes(getHousePubHex()))),
      ],
    });
    mutate({ transaction: tx });
  };

  return {
    houseId,
    isPending,
    init,
  };
};
