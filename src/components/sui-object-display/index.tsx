import { SuiObjectData } from "@mysten/sui/client";
import { ReactNode } from "react";
import { Avatar, Card, Divider, Flex } from "antd";
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
    <Card size="small" title={label ? <div className={labelClasses}>{label}</div> : undefined}>
      <Flex gap={12} align="center">
        <Avatar shape="square" size={64} src={display?.image_url} />
        <Flex vertical>
          <h2 className="text-lg font-bold">{display?.name || display?.title || "-"}</h2>
          <div className="text-xs text-slate-400">{display?.description || "No description for this object."}</div>
          <ExplorerLink id={object?.objectId || ""} isAddress={false} />
        </Flex>
      </Flex>
      <Divider style={{ marginBlock: 12 }} />
      {children}
    </Card>
  );
}
