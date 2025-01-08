import { getFaucetHost, requestSuiFromFaucetV0 } from "@mysten/sui/faucet";
import { Button, Card, Form, Input, message } from "antd";
import { useConfigModel } from "../../models/config.model";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Faucet() {
  const navigate = useNavigate();
  const { env } = useConfigModel();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const airdrop = async (values: any) => {
    try {
      setLoading(true);
      await requestSuiFromFaucetV0({
        host: getFaucetHost(env as "devnet" | "testnet"),
        recipient: values.recipient,
      });
      message.success("Get success.");
    } catch (error: any) {
      console.log(error);
      message.error(error?.message ?? "Get error.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (env === "mainnet") {
      navigate("/");
    }
  }, [env]);

  return (
    <Card
      title="Water Faucet"
      style={{ width: "50%", minWidth: 700, margin: "0 auto" }}
    >
      <Form
        form={form}
        size="large"
        layout="vertical"
        autoComplete="off"
        onFinish={airdrop}
        disabled={loading}
      >
        <Form.Item
          label="Recipient"
          name="recipient"
          rules={[{ required: true, message: "Please input recipient!" }]}
        >
          <Input placeholder="Recipient Address" />
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Get
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
