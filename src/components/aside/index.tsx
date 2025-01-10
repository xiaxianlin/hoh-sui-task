import "./index.less";
import { Layout, Menu, MenuProps } from "antd";
import { useConfigModel } from "../../models/config.model";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import {
  AccountBookOutlined,
  ControlOutlined,
  FieldNumberOutlined,
  GiftOutlined,
  HomeOutlined,
  SnippetsOutlined,
  TransactionOutlined,
} from "@ant-design/icons";

type MenuItem = Required<MenuProps>["items"][number];
const items: MenuItem[] = [
  { key: "/", label: "Home", icon: <HomeOutlined /> },
  { key: "/account", label: "Account", icon: <AccountBookOutlined /> },
  { key: "/task", label: "Task", icon: <SnippetsOutlined /> },
  { key: "/faucet", label: "Faucet", icon: <ControlOutlined /> },
  { key: "/transfer", label: "Transfer", icon: <TransactionOutlined /> },
  {
    key: "/examples",
    label: "Examples",
    icon: <GiftOutlined />,
    children: [
      { key: "/counter", label: "Counter", icon: <FieldNumberOutlined /> },
    ],
  },
];

export default function Aside() {
  const navigate = useNavigate();
  const { env } = useConfigModel();
  const options = useMemo(
    () =>
      items.filter((i) => (env === "mainnet" ? i?.key !== "/faucet" : true)),
    [env],
  );
  return (
    <Layout.Sider>
      <h1 className="logo">HOH-SUI</h1>
      <Menu
        theme="dark"
        items={options}
        mode="inline"
        defaultOpenKeys={["/examples"]}
        selectedKeys={[location.pathname]}
        style={{ flex: 1, minWidth: 0 }}
        onSelect={({ key }) => navigate(key)}
      />
    </Layout.Sider>
  );
}