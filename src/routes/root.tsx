import { ConnectButton } from "@mysten/dapp-kit";
import { Flex, Layout, Select, theme } from "antd";
import { Outlet } from "react-router-dom";
import { useAppModel } from "../models/app.model";
import { useConfigModel } from "../models/config.model";
import Aside from "../components/aside";

export default function Root() {
  const { account } = useAppModel();
  const { env, setEnv } = useConfigModel();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout className="Root" key={env}>
      <Aside />
      <Layout style={{ height: "100vh" }}>
        <Layout.Header
          style={{
            background: colorBgContainer,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Select
            value={env}
            onChange={setEnv}
            size="large"
            style={{ marginRight: 12 }}
          >
            <Select.Option value="devnet">devnet</Select.Option>
            <Select.Option value="testnet">testnet</Select.Option>
            <Select.Option value="mainnet">mainnet</Select.Option>
          </Select>
          <div className="custom-connect-button">
            <ConnectButton />
          </div>
        </Layout.Header>
        <Layout.Content style={{ margin: 16 }}>
          <div
            style={{
              padding: 24,
              height: "calc(100vh - 96px)",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {account ? (
              <Outlet />
            ) : (
              <Flex align="center" justify="center">
                Wallet not connected
              </Flex>
            )}
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
