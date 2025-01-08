import { useSuiClientQuery } from "@mysten/dapp-kit";
import { Card, Flex } from "antd";
import { useAppModel } from "../../models/app.model";
import { balance } from "../../utils/format";

export function Balance() {
  const { address } = useAppModel();
  const { data, isPending, error } = useSuiClientQuery(
    "getBalance",
    { owner: address },
    { enabled: !!address },
  );

  if (error) {
    return <Flex>Error: {error.message}</Flex>;
  }

  if (isPending || !data) {
    return <Flex>Loading...</Flex>;
  }

  return (
    <Card size="small" title="Balance">
      <p>Total: {balance(data.totalBalance)} SUI</p>
    </Card>
  );
}
