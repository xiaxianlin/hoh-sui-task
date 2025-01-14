import { Transaction } from "@mysten/sui/transactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTransactionExecution } from "./sui";
import { useAppModel } from "@/models/app.model";
import { ESCROW_PACKAGE_ID } from "@/constants";
import { QueryKey } from "../constants";

export function useGenerateDemoData() {
  const { address } = useAppModel();
  const executeTransaction = useTransactionExecution();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!address) throw new Error("You need to connect your wallet!");
      const txb = new Transaction();

      const bear = txb.moveCall({
        target: `${ESCROW_PACKAGE_ID}::demo_bear::new`,
        arguments: [txb.pure.string(`A happy bear`)],
      });

      txb.transferObjects([bear], txb.pure.address(address));

      return executeTransaction(txb);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.GetOwnedObjects] });
    },
  });
}
