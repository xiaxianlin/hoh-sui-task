import { useSuiClientInfiniteQuery } from "@mysten/dapp-kit";
import { LockedObject } from "./LockedObject";
import { CONSTRACT } from "../constants";
import { InfiniteScrollArea } from "@/components";
import { useAppModel } from "@/models/app.model";

export function MyLockedObejcts() {
  const { address } = useAppModel();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuiClientInfiniteQuery(
    "getOwnedObjects",
    {
      filter: { StructType: CONSTRACT.lockedType },
      owner: address!,
      options: { showContent: true, showOwner: true, showDisplay: true },
    },
    {
      enabled: !!address,
      select: (data) => data.pages.flatMap((page) => page.data),
    },
  );

  return (
    <InfiniteScrollArea
      loadMore={() => fetchNextPage()}
      hasNextPage={hasNextPage}
      loading={isFetchingNextPage || isLoading}
    >
      {data?.map((item) => <LockedObject key={item.data?.objectId} object={item.data!} />)}
    </InfiniteScrollArea>
  );
}
