import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Button, Form, FormProps, Input, message } from "antd";
import { Transaction } from "@mysten/sui/transactions";
import { TASK_PACKAGE_ID, TASK_SHARE_STATE_ID } from "../../../constants";

type FieldType = {
  name?: string;
  description?: string;
};

export default function CreateProfile({
  onCreate,
  disabled,
}: {
  disabled?: boolean;
  onCreate?: (digest?: string) => void;
}) {
  const { mutate } = useSignAndExecuteTransaction();
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${TASK_PACKAGE_ID}::week_one::create_profile`,
      arguments: [
        tx.pure.string(values.name!),
        tx.pure.string(values.description!),
        tx.object(TASK_SHARE_STATE_ID),
      ],
    });
    mutate(
      { transaction: tx },
      {
        onSuccess: (result) => {
          console.log("executed transaction", result.digest);
          onCreate?.(result.digest);
        },
        onError: (error) => {
          message.error(error.message);
          console.log(error.message);
        },
      },
    );
  };
  return (
    <Form
      size="large"
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
      disabled={disabled}
    >
      <Form.Item<FieldType>
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please input name!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Description"
        name="description"
        rules={[{ required: true, message: "Please input description!" }]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Create
        </Button>
      </Form.Item>
    </Form>
  );
}
