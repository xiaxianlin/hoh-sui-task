import { useState } from "react";
import { useCurrentAccount, useSuiClientInfiniteQuery } from "@mysten/dapp-kit";
import { formatAddress } from "@mysten/sui/utils";
import { useCreateEscrowMutation } from "../hooks";
import { Locked } from "@/escrow/store/db";
import { ExplorerLink } from "@/components";
import { Avatar, Button, Select, Typography } from "antd";

export function CreateEscrow({ locked }: { locked: Locked }) {
  const [objectId, setObjectId] = useState<string | undefined>(undefined);
  const account = useCurrentAccount();

  const { mutate: createEscrowMutation, isPending } = useCreateEscrowMutation();

  const { data, refetch } = useSuiClientInfiniteQuery(
    "getOwnedObjects",
    {
      owner: account?.address!,
      options: {
        showDisplay: true,
        showType: true,
      },
    },
    {
      enabled: !!account,
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
    <div className="px-3 py-3 grid grid-cols-1 gap-5 mt-3 rounded">
      <div>
        <label className="text-xs">The recipient will be:</label>
        <ExplorerLink id={locked.creator!} isAddress />
      </div>
      <div>
        <label className="text-xs">Select which object to put on escrow:</label>
        <Select placeholder="Select an Object" value={objectId} onChange={setObjectId}>
          {data?.map((object) => {
            return (
              <Select.Option key={object.data?.objectId!} value={object.data?.objectId!}>
                <Avatar src={object.data?.display?.data?.image_url!} />
                <Typography.Paragraph ellipsis>
                  {(object.data?.display?.data?.name || "-").substring(0, 100)}
                  <p className="text-gray-600">{formatAddress(object.data?.objectId!)}</p>
                </Typography.Paragraph>
              </Select.Option>
            );
          })}
        </Select>
      </div>
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
