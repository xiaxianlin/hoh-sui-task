import { InfoCircleOutlined } from "@ant-design/icons";
import { Flex, Tabs, TabsProps, Tooltip } from "antd";
import { FC, useMemo } from "react";
import { EscrowList } from "../../components/EscrowList";
import { useAppModel } from "@/models/app.model";

const TabeLabel: FC<{ label: string; tooltip?: string }> = ({ label, tooltip }) => {
  return (
    <Flex gap={8} align="center">
      <span>{label}</span>
      {tooltip && (
        <Tooltip title={tooltip}>
          <InfoCircleOutlined />
        </Tooltip>
      )}
    </Flex>
  );
};

export default function Escrows() {
  const { address } = useAppModel();
  const items = useMemo<TabsProps["items"]>(() => {
    return [
      {
        key: "1",
        label: <TabeLabel label="Requested Escrows" tooltip="Escrows requested for your locked objects." />,
        children: (
          <EscrowList
            params={{
              recipient: address,
              swapped: "false",
              cancelled: "false",
            }}
          />
        ),
      },
      {
        key: "2",
        label: <TabeLabel label="Browse Locked Objects" tooltip="Browse locked objects you can trade for." />,
        children: <>111</>,
      },
      {
        key: "3",
        label: (
          <TabeLabel label="My Pending Requests" tooltip="Escrows you have initiated for third party locked objects." />
        ),
        children: <>111</>,
      },
    ];
  }, [address]);
  return <Tabs defaultActiveKey="my" items={items} />;
}
