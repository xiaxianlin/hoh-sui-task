import { Tabs, TabsProps } from "antd";
import { useMemo } from "react";

export default function Locked() {
  const items = useMemo<TabsProps["items"]>(() => {
    return [
      {
        key: "my",
        label: "My Locked Objects",
        children: <>123</>,
      },
      {
        key: "owned",
        label: "Lock Owned objects",
        children: <>456</>,
      },
    ];
  }, []);
  return <Tabs defaultActiveKey="my" items={items} />;
}
