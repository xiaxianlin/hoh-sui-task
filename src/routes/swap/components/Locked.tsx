import { useState } from "react";
import { Locked as ILocked } from "@/escrow/store/db";
import { useGetObject, useUnlockMutation } from "../hooks";
import { useAppModel } from "@/models/app.model";
import { ExplorerLink, SuiObjectDisplay } from "@/components";
import { Button, Flex } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined, UnlockOutlined } from "@ant-design/icons";
import { CreateEscrow } from "./CreateEscrow";

export function Locked({ locked, hideControls }: { locked: ILocked; hideControls?: boolean }) {
  const [isToggled, setIsToggled] = useState(false);
  const { address } = useAppModel();
  const { mutate: unlockMutation, isPending } = useUnlockMutation();

  const suiObject = useGetObject({ id: locked.itemId! });

  const isOwner = () => {
    return !!locked.creator && address === locked.creator;
  };

  const getLabel = () => {
    if (locked.deleted) return "Deleted";
    if (hideControls) {
      if (locked.creator === address) return "You offer this";
      return "You'll receive this if accepted";
    }
    return undefined;
  };

  const getLabelClasses = () => {
    if (locked.deleted) return "bg-red-50 rounded px-3 py-1 text-sm text-red-500";
    if (hideControls) {
      if (!!locked.creator && locked.creator === address) return "bg-blue-50 rounded px-3 py-1 text-sm text-blue-500";
      return "bg-green-50 rounded px-3 py-1 text-sm text-green-700";
    }
    return undefined;
  };

  return (
    <SuiObjectDisplay object={suiObject?.data?.data!} label={getLabel()} labelClasses={getLabelClasses()}>
      <Flex align="center" justify="space-between" className="pb-1">
        <ExplorerLink id={locked.objectId} isAddress={false} />
        {!hideControls && isOwner() && (
          <Button
            type="primary"
            icon={<UnlockOutlined />}
            disabled={isPending}
            onClick={() => {
              unlockMutation({
                lockedId: locked.objectId,
                keyId: locked.keyId!,
                suiObject: suiObject?.data?.data!,
              });
            }}
          >
            Unlock
          </Button>
        )}
        {!hideControls && !isOwner() && (
          <Button
            type="primary"
            icon={isToggled ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            disabled={!address}
            onClick={() => setIsToggled(!isToggled)}
          >
            Start Escrow
          </Button>
        )}
        {isToggled && (
          <div className="min-w-[340px] w-full justify-self-start text-left">
            <CreateEscrow locked={locked} />
          </div>
        )}
      </Flex>
    </SuiObjectDisplay>
  );
}