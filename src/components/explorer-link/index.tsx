import { CheckCircleOutlined, CopyOutlined } from "@ant-design/icons";
import { useSuiClientContext } from "@mysten/dapp-kit";
import { formatAddress } from "@mysten/sui/utils";
import { Flex, message } from "antd";
import { useState } from "react";

export function ExplorerLink({ id, isAddress }: { id: string; isAddress?: boolean }) {
  const [copied, setCopied] = useState(false);
  const { network } = useSuiClientContext();

  const link = `https://suiexplorer.com/${isAddress ? "address" : "object"}/${id}?network=${network}`;

  const copy = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
    message.success("Copied link success!");
  };

  return (
    <Flex gap={8}>
      {copied ? <CheckCircleOutlined /> : <CopyOutlined onClick={copy} style={{ cursor: "pointer" }} />}
      <a href={link} target="_blank" rel="noreferrer">
        {formatAddress(id)}
      </a>
    </Flex>
  );
}
