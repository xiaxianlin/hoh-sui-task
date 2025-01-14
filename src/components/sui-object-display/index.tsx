import { SuiObjectData } from "@mysten/sui/client";
import { ReactNode } from "react";
import { Avatar, Card, Flex, Tag } from "antd";
import { ExplorerLink } from "../explorer-link";

export function SuiObjectDisplay({
  object,
  children,
  label,
  color,
}: {
  object?: SuiObjectData;
  children?: ReactNode | ReactNode[];
  label?: string;
  color?: string;
}) {
  const display = object?.display?.data;
  return (
    <Card size="small">
      {label ? (
        <Tag className="absolute top-3 right-0" color={color}>
          {label}
        </Tag>
      ) : undefined}
      <Flex gap={12} align="center">
        <Avatar shape="square" size={64} src={display?.image_url} />
        <Flex vertical>
          <h2 className="text-lg font-bold">{display?.name || display?.title || "-"}</h2>
          <div className="text-xs text-slate-400">{display?.description || "No description for this object."}</div>
          <ExplorerLink id={object?.objectId || ""} isAddress={false} />
        </Flex>
      </Flex>
      <div className="bg-gray-800 mt-2 p-3 rounded">{children}</div>
    </Card>
  );
}
