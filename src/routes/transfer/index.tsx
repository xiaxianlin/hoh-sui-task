import { Alert, Button, Card, Form, Input, InputNumber, Spin } from "antd";
import { FieldType, useSendTokens } from "./hooks";
import { usdc_balance } from "../../utils/format";

export default function Transfer() {
  const { loading, coin, send, form, txStatus } = useSendTokens();
  const error = !loading && !coin;
  return (
    <Card title="Sui USDC Sender" style={{ width: "50%", margin: "0 auto" }}>
      <Spin spinning={loading}>
        <Alert
          message={
            error ? "No usdc" : `USDC balance: ${usdc_balance(coin?.balance)}`
          }
          type={error ? "error" : "success"}
          style={{ marginBottom: 20 }}
        />
      </Spin>
      <Form
        form={form}
        size="large"
        layout="vertical"
        autoComplete="off"
        disabled={loading || error}
        onFinish={send}
      >
        <Form.Item<FieldType>
          label="Amount"
          name="amount"
          rules={[{ required: true, message: "Please input amount!" }]}
        >
          <InputNumber
            placeholder="Amount (in USDC)"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item<FieldType>
          label="Recipient"
          name="recipient"
          rules={[{ required: true, message: "Please input recipient!" }]}
        >
          <Input placeholder="Recipient Address" />
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Send USDC
          </Button>
        </Form.Item>
      </Form>
      {txStatus && <Alert message={txStatus} type="info" />}
    </Card>
  );
}
