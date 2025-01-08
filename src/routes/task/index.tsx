import { useSuiClientQuery } from "@mysten/dapp-kit";
import { Alert, Card, Spin } from "antd";
import { TASK_SHARE_STATE_ID } from "../../constants";
import CreateProfile from "./components/create-profile";

export default function Task() {
  const { data, isPending, refetch, error } = useSuiClientQuery("getObject", {
    id: TASK_SHARE_STATE_ID,
    options: {
      showContent: true,
    },
  });

  console.log(data);

  if (isPending) {
    return (
      <Card title="Profle" style={{ width: "50%", margin: "0 auto" }}>
        <Spin spinning />
      </Card>
    );
  }

  const isError = !!error || !!data.error;

  return (
    <Card title="Profle" style={{ width: "50%", margin: "0 auto" }}>
      {isError && (
        <Alert
          showIcon
          type="error"
          message={TASK_SHARE_STATE_ID + " " + data?.error?.code}
          style={{ marginBottom: 20 }}
        />
      )}
      <CreateProfile
        onCreate={() => refetch()}
        disabled={isPending || isError}
      />
    </Card>
  );
}
