import { SuiObjectData } from "@mysten/sui/client";
import { ReactNode } from "react";
import { Avatar, Card, Flex } from "antd";
import { ExplorerLink } from "../explorer-link";

export function SuiObjectDisplay({
  object,
  children,
  label,
  labelClasses,
}: {
  object?: SuiObjectData;
  children?: ReactNode | ReactNode[];
  label?: string;
  labelClasses?: string;
}) {
  const display = object?.display?.data;
  return (
    <Card title={<div className={labelClasses}>{label}</div>}>
      <Flex gap="3" align="center">
        <Avatar src={display?.image_url} />
        <Flex vertical>
          <div className="text-xs">
            <ExplorerLink id={object?.objectId || ""} isAddress={false} />
          </div>
          <div>{display?.name || display?.title || "-"}</div>
          <div>{display?.description || "No description for this object."}</div>
        </Flex>
      </Flex>
      {children}
    </Card>
  );
}
