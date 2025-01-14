import { Tabs, TabsProps } from "antd";
import { useMemo } from "react";
import { MyLockedObejcts } from "../../components/MyLockedObejcts";
import { LockOwnedObjects } from "../../components/LockOwnedObjects";

export default function Locked() {
  const items = useMemo<TabsProps["items"]>(() => {
    return [
      {
        key: "1",
        label: "My Locked Objects",
        children: <MyLockedObejcts />,
      },
      {
        key: "2",
        label: "Lock Owned objects",
        children: <LockOwnedObjects />,
      },
    ];
  }, []);
  return <Tabs defaultActiveKey="my" items={items} />;
}
