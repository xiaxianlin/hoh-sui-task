import {
  useSignAndExecuteTransaction,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import { useAppModel } from "../../models/app-model";
import { USDC_TYPE } from "../../constants";
import { Transaction } from "@mysten/sui/transactions";
import { Form, message } from "antd";
import { useState } from "react";
export type FieldType = {
  amount: number;
  recipient: string;
};
export const useSendTokens = () => {
  const { address } = useAppModel();
  const [form] = Form.useForm();

  const [txStatus, setTxStatus] = useState("");

  const { data, isPending, refetch } = useSuiClientQuery("getCoins", {
    coinType: USDC_TYPE,
    owner: address,
  });

  const { mutate } = useSignAndExecuteTransaction();

  const coin = data?.data?.[0];

  const send = ({ amount, recipient }: FieldType) => {
    const tx = new Transaction();
    const amountInSmallestUnit = BigInt(amount * 1_000_000);
    const [newCoin] = tx.splitCoins(coin!.coinObjectId, [
      tx.pure.u64(amountInSmallestUnit),
    ]);
    tx.transferObjects([newCoin], tx.pure.address(recipient));
    mutate(
      { transaction: tx },
      {
        onSuccess: (result) => {
          message.success("Send sucess");
          refetch();
          form.resetFields();
          setTxStatus(`Transaction successful. Digest: ${result.digest}`);
        },
        onError: (error) => {
          console.error("Error sending tokens:", error);
          setTxStatus(
            `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          );
        },
      },
    );
  };

  return { coin, loading: isPending, send, form, txStatus };
};
