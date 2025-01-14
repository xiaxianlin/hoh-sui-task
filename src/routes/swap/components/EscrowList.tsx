import { Escrow } from "./Escrow";
import { InfiniteScrollArea } from "@/components";
import { Escrow as IEscrow } from "@/escrow/store/db";
import { queryPendingEscrows, queryRequestedEscrows } from "@/escrow/store/escrow";
import { useInfiniteScroll } from "ahooks";

export function EscrowList({ address, swaped }: { address: string; swaped?: boolean }) {
  const { data, loading, loadingMore, loadMore } = useInfiniteScroll(async () => {
    const data = swaped ? await queryRequestedEscrows(address) : await queryPendingEscrows(address);

    return { hasMore: false, list: data };
  });

  return (
    <InfiniteScrollArea loadMore={loadMore} hasNextPage={!!data?.hasMore} loading={loading || loadingMore}>
      {data?.list.map((escrow: IEscrow) => <Escrow key={escrow.itemId} escrow={escrow} />)}
    </InfiniteScrollArea>
  );
}
