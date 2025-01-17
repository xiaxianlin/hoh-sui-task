import { useAppModel } from "@/models/app-model";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import { OBJECT_TYPE } from "../constants";

export const useFetchCounterNft = () => {
  const { address } = useAppModel();
  const { data, isLoading, isError, error, refetch } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: address,
      limit: 1,
      filter: { MatchAll: [{ StructType: OBJECT_TYPE.Counter }, { AddressOwner: address }] },
      options: { showOwner: true, showType: true },
    },
    { queryKey: ["CounterNFT"] },
  );

  return {
    data: data && data.data.length > 0 ? data?.data : [],
    isLoading,
    isError,
    error,
    refetch,
  };
};
