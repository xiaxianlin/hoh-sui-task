import { PlusOutlined } from "@ant-design/icons";
import { useBoolean } from "ahooks";
import { Button, Card, Empty, Modal } from "antd";

export function Folder() {
  const [visible, { setTrue, setFalse }] = useBoolean(false);
  return (
    <>
      <Card title="Folder" className="h-full">
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="You have no folder">
          <Button size="small" icon={<PlusOutlined />} type="primary" onClick={setTrue}>
            Create
          </Button>
        </Empty>
      </Card>
      <Modal centered title="Create Folder" open={visible} onCancel={setFalse} footer={null}>
        Folder Form
      </Modal>
    </>
  );
}
