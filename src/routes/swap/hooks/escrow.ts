import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { SuiObjectData } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTransactionExecution } from "./sui";
import { ESCROW_PACKAGE_ID } from "@/constants";
import { Escrow, Locked } from "@/escrow/store/db";
import { useAppModel } from "@/models/app.model";
import { QueryKey } from "../constants";

export function useCreateEscrowMutation() {
  const { address } = useAppModel();
  const executeTransaction = useTransactionExecution();

  return useMutation({
    mutationFn: async ({ object, locked }: { object: SuiObjectData; locked: Locked }) => {
      if (!address) throw new Error("You need to connect your wallet!");

      const txb = new Transaction();
      txb.moveCall({
        target: `${ESCROW_PACKAGE_ID}::shared::create`,
        arguments: [txb.object(object.objectId!), txb.pure.id(locked.keyId!), txb.pure.address(locked.creator!)],
        typeArguments: [object.type!],
      });

      return executeTransaction(txb);
    },
  });
}

export function useCancelEscrowMutation() {
  const { address } = useAppModel();
  const queryClient = useQueryClient();
  const executeTransaction = useTransactionExecution();

  return useMutation({
    mutationFn: async ({ escrow, suiObject }: { escrow: Escrow; suiObject: SuiObjectData }) => {
      if (!address) throw new Error("You need to connect your wallet!");
      const txb = new Transaction();

      const item = txb.moveCall({
        target: `${ESCROW_PACKAGE_ID}::shared::return_to_sender`,
        arguments: [txb.object(escrow.objectId)],
        typeArguments: [suiObject?.type!],
      });

      txb.transferObjects([item], txb.pure.address(address));

      return executeTransaction(txb);
    },

    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: [QueryKey.Escrow] });
      }, 1_000);
    },
  });
}

export function useAcceptEscrowMutation() {
  const currentAccount = useCurrentAccount();
  const client = useSuiClient();
  const executeTransaction = useTransactionExecution();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ escrow, locked }: { escrow: Escrow; locked: Locked }) => {
      if (!currentAccount?.address) throw new Error("You need to connect your wallet!");
      const txb = new Transaction();

      const escrowObject = await client.multiGetObjects({
        ids: [escrow.itemId!, locked.itemId!],
        options: {
          showType: true,
        },
      });

      const escrowType = escrowObject.find((x) => x.data?.objectId === escrow.itemId)?.data?.type;

      const lockedType = escrowObject.find((x) => x.data?.objectId === locked.itemId)?.data?.type;

      if (!escrowType || !lockedType) {
        throw new Error("Failed to fetch types.");
      }

      const item = txb.moveCall({
        target: `${ESCROW_PACKAGE_ID}::shared::swap`,
        arguments: [txb.object(escrow.objectId), txb.object(escrow.keyId!), txb.object(locked.objectId)],
        typeArguments: [escrowType, lockedType],
      });

      txb.transferObjects([item], txb.pure.address(currentAccount.address));

      return executeTransaction(txb);
    },

    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: [QueryKey.Escrow] });
      }, 1_000);
    },
  });
}
