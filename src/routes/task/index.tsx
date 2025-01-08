import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { Card, Spin } from "antd";
import { useMemo } from "react";
import { TASK_SHARE_STATE_ID } from "../../constants";
import CreateProfile from "./components/create-profile";
import ProfileInfo from "./components/profile-info";

export default function Task() {
  const account = useCurrentAccount();
  const { data, isPending, refetch } = useSuiClientQuery("getObject", {
    id: TASK_SHARE_STATE_ID,
    options: {
      showContent: true,
    },
  });

  const isCreated = useMemo(() => {
    const content = data?.data?.content as any;
    const users = content?.fields?.users || [];
    return users.includes(account?.address);
  }, [data, account]);

  return (
    <Card title="Profle" style={{ width: "50%", margin: "0 auto" }}>
      {isPending ? (
        <Spin spinning />
      ) : (
        <>
          {isCreated ? (
            <ProfileInfo />
          ) : (
            <CreateProfile onCreate={() => refetch()} />
          )}
        </>
      )}
    </Card>
  );
}
