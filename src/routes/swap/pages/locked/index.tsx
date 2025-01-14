import { Tabs, TabsProps } from "antd";
import { useMemo } from "react";
import { OwnedLockedList } from "../../components/OwnedLockedList";
import { LockOwnedObjects } from "../../components/LockOwnedObjects";

export default function Locked() {
  const items = useMemo<TabsProps["items"]>(() => {
    return [
      {
        key: "my",
        label: "My Locked Objects",
        children: <OwnedLockedList />,
      },
      {
        key: "owned",
        label: "Lock Owned objects",
        children: <LockOwnedObjects />,
      },
    ];
  }, []);
  return <Tabs defaultActiveKey="my" items={items} />;
}
