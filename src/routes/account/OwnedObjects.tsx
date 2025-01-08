import { useSuiClientQuery } from "@mysten/dapp-kit";
import { Card, Flex } from "antd";
import { useAppModel } from "../../models/app.model";
import { useMemo } from "react";

type SuiData = {
  dataType: "moveObject" | "package";
  fields: any;
  hasPublicTransfer: boolean;
  type: string;
  disassembled: {
    [key: string]: unknown;
  };
};

export default function OwnedObjects() {
  const { address } = useAppModel();
  const { data, isPending, error } = useSuiClientQuery(
    "getOwnedObjects",
    { owner: address, options: { showContent: true } },
    { enabled: !!address },
  );

  const objects = useMemo<SuiData[]>(() => {
    if (!data?.data.length) return [];
    return data?.data?.map((i) => i.data?.content).filter(Boolean) as SuiData[];
  }, [data]);

  if (error) {
    return <Flex>Error: {error.message}</Flex>;
  }

  if (isPending || !data) {
    return <Flex>Loading...</Flex>;
  }
  return (
    <Card size="small" title="Owned Objects">
      {objects.length === 0 && <p>No objects owned by the connected wallet</p>}
      {objects.map((object) => (
        <Flex key={object.fields.id.id}>
          <p>Object ID: {object.fields.id.id}</p>
        </Flex>
      ))}
    </Card>
  );
}
