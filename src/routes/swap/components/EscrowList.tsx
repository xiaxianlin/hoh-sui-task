// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useInfiniteQuery } from "@tanstack/react-query";
import { Escrow } from "./Escrow";
import { InfiniteScrollArea } from "@/components";
import { useState } from "react";
import { Input } from "antd";
import { QueryKey } from "../constants";
import { EscrowListingQuery, queryEscrow } from "@/escrow/store/escrow";
import { Escrow as IEscrow } from "@/escrow/store/db";

export function EscrowList({ params, enableSearch }: { params: EscrowListingQuery; enableSearch?: boolean }) {
  const [escrowId, setEscrowId] = useState("");

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } = useInfiniteQuery({
    initialPageParam: "",
    queryKey: [QueryKey.Escrow, params, escrowId],
    queryFn: async ({ pageParam }) => {
      return queryEscrow({
        ...params,
        ...(pageParam ? { cursor: pageParam as string } : {}),
        ...(escrowId ? { objectId: escrowId } : {}),
      });
    },
    select: (data) => data.pages.flatMap((page) => page.data),
    getNextPageParam: (lastPage) => lastPage.cursor,
  });

  return (
    <div>
      {enableSearch && (
        <Input placeholder="Search by escrow id" value={escrowId} onChange={(e) => setEscrowId(e.target.value)} />
      )}
      <InfiniteScrollArea
        loadMore={() => fetchNextPage()}
        hasNextPage={hasNextPage}
        loading={isFetchingNextPage || isLoading}
      >
        {data?.map((escrow: IEscrow) => <Escrow key={escrow.itemId} escrow={escrow} />)}
      </InfiniteScrollArea>
    </div>
  );
}
