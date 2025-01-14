import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Button, Form, FormProps, Input, message } from "antd";
import { Transaction } from "@mysten/sui/transactions";
import { useTaskModel } from "@/routes/task/model";

type FieldType = {
  name: string;
  description: string;
};

export default function ProfileForm({ onCreate }: { onCreate?: (digest?: string) => void }) {
  const { packageId, stateId } = useTaskModel();
  const { mutate, isPending } = useSignAndExecuteTransaction({
    onSuccess: () => {
      onCreate?.();
      message.success(`create success.`);
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${packageId}::week_two::create_profile`,
      arguments: [tx.pure.string(values.name!), tx.pure.string(values.description!), tx.object(stateId)],
    });
    mutate({ transaction: tx });
  };

  return (
    <Form layout="vertical" onFinish={onFinish} autoComplete="off" disabled={isPending}>
      <Form.Item<FieldType> label="name" name="name" className="mt-4" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item<FieldType> label="description" name="description" rules={[{ required: true }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item label={null} className="flex justify-center mb-1">
        <Button type="primary" htmlType="submit" loading={isPending}>
          Create
        </Button>
      </Form.Item>
    </Form>
  );
}
