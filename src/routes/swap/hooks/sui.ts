import { useSuiClientQuery, useSignTransaction, useSuiClient } from "@mysten/dapp-kit";
import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { message } from "antd";

export function useTransactionExecution() {
  const client = useSuiClient();
  const { mutateAsync: signTransactionBlock } = useSignTransaction();

  const executeTransaction = async (txb: Transaction): Promise<SuiTransactionBlockResponse | void> => {
    try {
      const signature = await signTransactionBlock({
        transaction: txb,
      });

      const res = await client.executeTransactionBlock({
        transactionBlock: signature.bytes,
        signature: signature.signature,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      });

      message.success("Successfully executed transaction!");
      return res;
    } catch (e: any) {
      message.error(`Failed to execute transaction: ${e.message as string}`);
    }
  };

  return executeTransaction;
}

export function useGetObject({ id }: { id?: string }) {
  return useSuiClientQuery(
    "getObject",
    { id: id!, options: { showType: true, showOwner: true, showContent: true, showDisplay: true } },
    { enabled: !!id },
  );
}
