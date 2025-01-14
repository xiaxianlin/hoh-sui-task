import { Button, Card, Flex } from "antd";
import { useState } from "react";
import { useSignAndExecuteTransaction, useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import { QueryContainer } from "@/components";
import { Transaction } from "@mysten/sui/transactions";
import { getCounterFields } from "@/utils/format";
import { useAppModel } from "@/models/app-model";

const STORAGE_KEY = "HOH_SUI_COUNTER_ID";
const PACKAGE_ID = "0xd9ea21ae028ed8ec6fee48c96780272dfa1dfe7cea8803038b0c4e9b2ad31ea4";

type Counter = { value: number; owner: string };

function CraeteCounter({ onCreated }: { onCreated?: (id: string) => void }) {
  const client = useSuiClient();
  const { mutate, isPending } = useSignAndExecuteTransaction({
    onSuccess: async ({ digest }) => {
      const { effects } = await client.waitForTransaction({
        digest: digest,
        options: { showEffects: true },
      });
      onCreated?.(effects?.created?.[0]?.reference?.objectId!);
    },
  });
  const handleCreate = async () => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::counter::create`,
      arguments: [],
    });
    mutate({ transaction: tx });
  };
  return (
    <Button loading={isPending} type="primary" size="large" onClick={handleCreate}>
      Create Counter
    </Button>
  );
}

function HandleCounter({ id }: { id: string }) {
  const client = useSuiClient();
  const { address } = useAppModel();

  const query = useSuiClientQuery("getObject", {
    id,
    options: { showContent: true, showOwner: true },
  });
  const { mutate, isPending } = useSignAndExecuteTransaction({
    onSuccess: async (tx) => {
      await client.waitForTransaction({ digest: tx.digest });
      await query.refetch();
    },
  });

  const fields = getCounterFields<Counter>(query.data?.data);

  const ownedByCurrentAccount = fields?.owner === address;

  const executeMoveCall = (method: "increment" | "reset") => {
    const tx = new Transaction();

    if (method === "reset") {
      tx.moveCall({
        arguments: [tx.object(id), tx.pure.u64(0)],
        target: `${PACKAGE_ID}::counter::set_value`,
      });
    } else {
      tx.moveCall({
        arguments: [tx.object(id)],
        target: `${PACKAGE_ID}::counter::increment`,
      });
    }
    mutate({ transaction: tx });
  };

  return (
    <QueryContainer query={query}>
      <Flex vertical gap={12}>
        <p>Count: {fields?.value}</p>
        <Flex gap={12}>
          <Button type="primary" loading={isPending} onClick={() => executeMoveCall("increment")}>
            Increment
          </Button>
          {ownedByCurrentAccount && (
            <Button loading={isPending} onClick={() => executeMoveCall("reset")}>
              Reset
            </Button>
          )}
        </Flex>
      </Flex>
    </QueryContainer>
  );
}

export default function Counter() {
  const [counterId, setCounterId] = useState(localStorage.getItem(STORAGE_KEY));

  return (
    <Card title={`Counter ${counterId || ""}`}>
      {counterId ? (
        <HandleCounter id={counterId} />
      ) : (
        <CraeteCounter
          onCreated={(id) => {
            localStorage.setItem(STORAGE_KEY, id);
            setCounterId(id);
          }}
        />
      )}
    </Card>
  );
}
