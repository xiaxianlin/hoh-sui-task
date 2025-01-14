import { Escrow as IEscrow } from "@/escrow/store/db";
import { useAppModel } from "@/models/app.model";
import { useState } from "react";
import { useAcceptEscrowMutation, useCancelEscrowMutation, useGetObject } from "../hooks";
import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "../constants";
import { getLockedByKeyId } from "@/escrow/store/locked";
import { ExplorerLink, SuiObjectDisplay } from "@/components";
import { Button, Flex } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined, CheckCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { LockedObject } from "./LockedObject";

export function Escrow({ escrow }: { escrow: IEscrow }) {
  const { address } = useAppModel();
  const [isToggled, setIsToggled] = useState(true);
  const { mutate: acceptEscrowMutation, isPending } = useAcceptEscrowMutation();
  const { mutate: cancelEscrowMutation, isPending: pendingCancellation } = useCancelEscrowMutation();

  const suiObject = useGetObject({ id: escrow.itemId! });

  const lockedData = useQuery({
    queryKey: [QueryKey.Locked, escrow.keyId],
    queryFn: async () => getLockedByKeyId(escrow.keyId!),
    enabled: !escrow.cancelled,
  });

  const { data: suiLockedObject } = useGetObject({
    id: lockedData.data?.objectId,
  });

  const getLabel = () => {
    if (escrow.sender === address) return "You offer this";
    if (escrow.recipient === address) return "You'll receive this";
    return undefined;
  };

  const getLabelColor = () => {
    if (escrow.sender === address) return "processing";
    if (escrow.recipient === address) return "success";
    return undefined;
  };

  return (
    <SuiObjectDisplay object={suiObject.data?.data!} label={getLabel()} color={getLabelColor()}>
      <Flex align="center" justify="space-between">
        <ExplorerLink id={escrow.objectId} isAddress={false} />
        <Flex gap={4}>
          {lockedData.data && (
            <Button
              type="text"
              icon={isToggled ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              onClick={() => setIsToggled(!isToggled)}
            >
              Details
            </Button>
          )}
          {!escrow.cancelled && !escrow.swapped && escrow.sender === address && (
            <Button
              type="primary"
              icon={<CloseOutlined />}
              disabled={pendingCancellation}
              onClick={() => cancelEscrowMutation({ escrow, suiObject: suiObject.data?.data! })}
            >
              Cancel
            </Button>
          )}
        </Flex>
      </Flex>
      {isToggled && lockedData.data && (
        <div className="grid grid-cols-1 gap-2 pt-3 mt-3 border-t-[1px] border-slate-500">
          {suiLockedObject?.data && (
            <LockedObject object={suiLockedObject.data} itemId={lockedData.data.itemId} hideControls />
          )}
          {!lockedData.data.deleted && escrow.recipient === address && (
            <div className="text-right mt-5">
              <p className="text-xs pb-3">
                When accepting the exchange, the escrowed item will be transferred to you and your locked item will be
                transferred to the sender.
              </p>
              <Button
                icon={<CheckCircleOutlined />}
                disabled={isPending}
                onClick={() => acceptEscrowMutation({ escrow, locked: lockedData.data! })}
              >
                Accept exchange
              </Button>
            </div>
          )}
          {lockedData.data.deleted && !escrow.swapped && escrow.recipient === address && (
            <div>
              <p className="text-red-500 text-sm py-2 flex items-center gap-3">
                <CloseOutlined />
                The locked object has been deleted so you can't accept this anymore.
              </p>
            </div>
          )}
        </div>
      )}
    </SuiObjectDisplay>
  );
}
