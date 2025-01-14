import { useSuiClient } from "@mysten/dapp-kit";
import { LockedObject } from "./LockedObject";
import { LockedListingQuery, queryLocked } from "@/escrow/store/locked";
import { Locked } from "@/escrow/store/db";
import { InfiniteScrollArea } from "@/components";
import { useInfiniteScroll } from "ahooks";

export function LockedList({ params }: { isPersonal?: boolean; params: LockedListingQuery }) {
  const suiClient = useSuiClient();

  const { data, loading, loadingMore, loadMore } = useInfiniteScroll(async () => {
    const { data } = await queryLocked({ deleted: "false", ...params });
    const objects = await suiClient.multiGetObjects({
      ids: data.map((x: Locked) => x.objectId),
      options: { showOwner: true, showContent: true },
    });
    return { hasMore: false, list: objects.map((x) => x.data), data };
  });

  const getItemId = (objectId?: string) => {
    return data?.data?.find((x) => x.objectId === objectId)?.itemId;
  };

  return (
    <InfiniteScrollArea loadMore={loadMore} hasNextPage={!!data?.hasMore} loading={loading || loadingMore}>
      {data?.list.map((object) => (
        <LockedObject key={object?.objectId!} object={object!} itemId={getItemId(object?.objectId)} />
      ))}
    </InfiniteScrollArea>
  );
}
