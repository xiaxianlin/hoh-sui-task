import { useState } from "react";
import { Locked as ILocked } from "@/escrow/store/db";
import { useGetObject, useUnlockMutation } from "../hooks";
import { useAppModel } from "@/models/app-model";
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
      return "You'll receive if accepted";
    }
    return undefined;
  };

  const getLabelColor = () => {
    if (locked.deleted) return "error";
    if (hideControls) {
      if (!!locked.creator && locked.creator === address) return "processing";
      return "success";
    }
    return undefined;
  };

  return (
    <SuiObjectDisplay object={suiObject?.data?.data!} label={getLabel()} color={getLabelColor()}>
      <Flex align="center" justify="space-between">
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
      </Flex>
      {isToggled && <CreateEscrow locked={locked} />}
    </SuiObjectDisplay>
  );
}
