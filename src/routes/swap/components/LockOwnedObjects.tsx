import { useSuiClientInfiniteQuery } from "@mysten/dapp-kit";
import { useLockObjectMutation } from "../hooks";
import { InfiniteScrollArea, SuiObjectDisplay } from "@/components";
import { Button, Flex } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useAppModel } from "@/models/app.model";

export function LockOwnedObjects() {
  const { address } = useAppModel();

  const { mutate: lockObjectMutation, isPending } = useLockObjectMutation();

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, refetch } = useSuiClientInfiniteQuery(
    "getOwnedObjects",
    {
      owner: address!,
      options: { showDisplay: true, showType: true },
    },
    {
      enabled: !!address,
      select: (data) =>
        data.pages.flatMap((page) => page.data).filter((x) => !!x.data?.display && !!x.data?.display?.data?.image_url),
    },
  );

  return (
    <InfiniteScrollArea loadMore={() => fetchNextPage()} hasNextPage={hasNextPage} loading={isFetchingNextPage}>
      {data?.map((obj, i) => (
        <SuiObjectDisplay key={i} object={obj.data!}>
          <Flex align="center" justify="center" gap={12} className="pb-1">
            <p className="text-xs">Lock the item so it can be used for escrows.</p>
            <Button
              type="primary"
              icon={<LockOutlined />}
              disabled={isPending}
              onClick={() => {
                lockObjectMutation({ object: obj.data! }, { onSuccess: () => refetch() });
              }}
            >
              Lock Item
            </Button>
          </Flex>
        </SuiObjectDisplay>
      ))}
    </InfiniteScrollArea>
  );
}
