import { useState } from "react";
import { useSuiClientInfiniteQuery } from "@mysten/dapp-kit";
import { formatAddress } from "@mysten/sui/utils";
import { useCreateEscrowMutation } from "../hooks";
import { Locked } from "@/escrow/store/db";
import { ExplorerLink } from "@/components";
import { Avatar, Button, Flex, Select, Typography } from "antd";
import { useAppModel } from "@/models/app.model";

export function CreateEscrow({ locked }: { locked: Locked }) {
  const { address } = useAppModel();
  const [objectId, setObjectId] = useState<string | undefined>(undefined);

  const { mutate: createEscrowMutation, isPending } = useCreateEscrowMutation();

  const { data, refetch } = useSuiClientInfiniteQuery(
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

  const getObject = () => {
    const object = data?.find((x) => x.data?.objectId === objectId);

    if (!object || !object.data) {
      return;
    }
    return object.data;
  };

  return (
    <div className="grid grid-cols-1 gap-2 pt-3 mt-3 border-t-[1px] border-slate-500">
      <Flex gap={4}>
        <label className="text-xs">The recipient will be:</label>
        <ExplorerLink id={locked.creator!} isAddress />
      </Flex>
      <Flex vertical gap={8}>
        <label className="text-xs">Select which object to put on escrow:</label>
        <Select
          allowClear
          placeholder="Select an Object"
          value={objectId}
          onChange={setObjectId}
          labelRender={({ value }) => value}
        >
          {data?.map((object) => {
            return (
              <Select.Option key={object.data?.objectId!} value={object.data?.objectId!}>
                <Flex gap={10} align="center">
                  <Avatar size="large" src={object.data?.display?.data?.image_url!} />
                  <Flex vertical gap={2}>
                    <Typography.Text ellipsis>
                      {(object.data?.display?.data?.name || "-").substring(0, 100)}
                    </Typography.Text>
                    <div className="text-gray-600">{formatAddress(object.data?.objectId!)}</div>
                  </Flex>
                </Flex>
              </Select.Option>
            );
          })}
        </Select>
      </Flex>
      {objectId && (
        <div>
          <label className="text-xs">You'll be offering:</label>
          <ExplorerLink id={objectId} />
        </div>
      )}
      <div className="text-right">
        <Button
          disabled={isPending || !objectId}
          onClick={() => {
            createEscrowMutation(
              { locked, object: getObject()! },
              {
                onSuccess: () => {
                  refetch();
                  setObjectId(undefined);
                },
              },
            );
          }}
        >
          Create Escrow
        </Button>
      </div>
    </div>
  );
}
