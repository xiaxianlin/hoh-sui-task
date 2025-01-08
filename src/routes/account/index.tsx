import { Balance } from "./Balance";
import { getFullnodeUrl } from "@mysten/sui/client";
import { Card, Flex } from "antd";
import { useAppModel } from "../../models/app.model";
import OwnedObjects from "./OwnedObjects";
import { useConfigModel } from "../../models/config.model";

export default function Account() {
  const { env } = useConfigModel();
  const { account } = useAppModel();
  return (
    <Flex vertical gap={16} style={{ width: "80%", margin: "0 auto" }}>
      <Card size="small" title="Network">
        <p>Env: {env}</p>
        <p>Url: {getFullnodeUrl(env)}</p>
      </Card>
      <Card size="small" title="Wallet">
        <p>Status: connected</p>
        <p>Address: {account?.address}</p>
      </Card>
      <Balance />
      <OwnedObjects />
    </Flex>
  );
}
