import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { SuiObjectData } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTransactionExecution } from "./sui";
import { ESCROW_PACKAGE_ID } from "@/constants";
import { message } from "antd";
import { QueryKey } from "../constants";

export function useLockObjectMutation() {
  const account = useCurrentAccount();
  const executeTransaction = useTransactionExecution();

  return useMutation({
    mutationFn: async ({ object }: { object: SuiObjectData }) => {
      if (!account?.address) throw new Error("You need to connect your wallet!");
      const txb = new Transaction();

      const [locked, key] = txb.moveCall({
        target: `${ESCROW_PACKAGE_ID}::lock::lock`,
        arguments: [txb.object(object.objectId)],
        typeArguments: [object.type!],
      });

      txb.transferObjects([locked, key], txb.pure.address(account.address));

      return executeTransaction(txb);
    },
  });
}

export function useUnlockMutation() {
  const account = useCurrentAccount();
  const executeTransaction = useTransactionExecution();
  const client = useSuiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      lockedId,
      keyId,
      suiObject,
    }: {
      lockedId: string;
      keyId: string;
      suiObject: SuiObjectData;
    }) => {
      if (!account?.address) throw new Error("You need to connect your wallet!");
      const key = await client.getObject({
        id: keyId,
        options: {
          showOwner: true,
        },
      });

      if (
        !key.data?.owner ||
        typeof key.data.owner === "string" ||
        !("AddressOwner" in key.data.owner) ||
        key.data.owner.AddressOwner !== account.address
      ) {
        message.error("You are not the owner of the key");
        return;
      }

      const txb = new Transaction();

      const item = txb.moveCall({
        target: `${ESCROW_PACKAGE_ID}::lock::unlock`,
        typeArguments: [suiObject.type!],
        arguments: [txb.object(lockedId), txb.object(keyId)],
      });

      txb.transferObjects([item], txb.pure.address(account.address));

      return executeTransaction(txb);
    },
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: [QueryKey.Locked] });
      }, 1_000);
    },
  });
}
//docs::/#mutationunlock
