import { Alert, Button, Card, Form, InputNumber, Typography } from "antd";
import { useHouseInitialize } from "../../hooks";

export function HouseInitialize() {
  const { houseId, isPending, init } = useHouseInitialize();
  return (
    <Card title="House">
      {houseId && <Alert showIcon message="Info Text" type="info" />}
      <Form initialValues={{ stake: 1 }} disabled={isPending} onFinish={(values) => init(values.stake)}>
        <Form.Item label="房间号">
          {houseId ? (
            <Typography.Paragraph copyable={{ text: houseId }}>请保存好房间号（{houseId}）</Typography.Paragraph>
          ) : (
            "-"
          )}
        </Form.Item>
        <Form.Item<{ stake: number }> label="押注" name="stake" rules={[{ required: true }]}>
          <InputNumber min={1} max={2} precision={0} placeholder="1 ~ 50" className="w-full" />
        </Form.Item>
        <Form.Item label={null} className="flex justify-center mb-1">
          <Button type="primary" htmlType="submit" loading={isPending}>
            创建房间
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
