import "./index.less";
import { Layout, Menu, MenuProps } from "antd";
import { useConfigModel } from "../../models/config-model";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import {
  AccountBookOutlined,
  ControlOutlined,
  FieldNumberOutlined,
  SnippetsOutlined,
  StrikethroughOutlined,
  SwapOutlined,
  TransactionOutlined,
} from "@ant-design/icons";

type MenuItem = Required<MenuProps>["items"][number];
const items: MenuItem[] = [
  { key: "/", label: "Home", icon: <AccountBookOutlined /> },
  { key: "/task", label: "Task", icon: <SnippetsOutlined /> },
  {
    key: "/demos",
    label: "Demos",
    type: "group",
    children: [
      { key: "/faucet", label: "Faucet", icon: <ControlOutlined /> },
      { key: "/transfer", label: "Transfer", icon: <TransactionOutlined /> },
    ],
  },
  {
    key: "/examples",
    label: "Examples",
    type: "group",
    children: [
      { key: "/counter", label: "Counter", icon: <FieldNumberOutlined /> },
      { key: "/swap", label: "Swap", icon: <SwapOutlined /> },
      { key: "/guess", label: "Guess", icon: <StrikethroughOutlined /> },
    ],
  },
];

export function Aside() {
  const navigate = useNavigate();
  const location = useLocation();
  const { env } = useConfigModel();
  const options = useMemo(() => items.filter((i) => (env === "mainnet" ? i?.key !== "/faucet" : true)), [env]);
  const selectKey = location.pathname.split("/")[1];
  return (
    <Layout.Sider>
      <h1 className="logo">HOH-SUI</h1>
      <Menu
        theme="dark"
        items={options}
        mode="inline"
        selectedKeys={["/" + selectKey]}
        style={{ flex: 1, minWidth: 0 }}
        onSelect={({ key }) => navigate(key)}
      />
    </Layout.Sider>
  );
}
