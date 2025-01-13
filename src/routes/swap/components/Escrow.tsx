import { Escrow as IEscrow } from "@/escrow/store/db";
import { useAppModel } from "@/models/app.model";
import { useState } from "react";
import { useAcceptEscrowMutation, useCancelEscrowMutation, useGetObject } from "../hooks";
import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "../constants";
import { queryLocked } from "@/escrow/store/locked";
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
    queryFn: async () => queryLocked({ keyId: escrow.keyId }),
    select: (data) => data[0],
    enabled: !escrow.cancelled,
  });

  const { data: suiLockedObject } = useGetObject({
    id: lockedData.data?.objectId,
  });

  const getLabel = () => {
    if (escrow.cancelled) return "Cancelled";
    if (escrow.swapped) return "Swapped";
    if (escrow.sender === address) return "You offer this";
    if (escrow.recipient === address) return "You'll receive this";
    return undefined;
  };

  const getLabelClasses = () => {
    if (escrow.cancelled) return "text-red-500";
    if (escrow.swapped) return "text-green-500";
    if (escrow.sender === address) return "bg-blue-50 rounded px-3 py-1 text-sm text-blue-500";
    if (escrow.recipient === address) return "bg-green-50 rounded px-3 py-1 text-sm text-green-700";
    return undefined;
  };

  return (
    <SuiObjectDisplay object={suiObject.data?.data!} label={getLabel()} labelClasses={getLabelClasses()}>
      <Flex gap={3}>
        <ExplorerLink id={escrow.objectId} isAddress={false} />
        <Button
          type="primary"
          icon={isToggled ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          onClick={() => setIsToggled(!isToggled)}
        >
          Details
        </Button>
        {!escrow.cancelled && !escrow.swapped && escrow.sender === address && (
          <Button
            icon={<CloseOutlined />}
            disabled={pendingCancellation}
            onClick={() => cancelEscrowMutation({ escrow, suiObject: suiObject.data?.data! })}
          >
            Cancel request
          </Button>
        )}
        {isToggled && lockedData.data && (
          <div className="min-w-[340px] w-full justify-self-start text-left">
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
                  onClick={() => acceptEscrowMutation({ escrow, locked: lockedData.data })}
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
      </Flex>
    </SuiObjectDisplay>
  );
}
