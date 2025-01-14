import { Col, Flex, Row, Spin } from "antd";
import { CoinList } from "@/routes/task/views/coin-list";
import { Folder } from "@/routes/task/views/folder";
import { Profile } from "@/routes/task/views/profile";
import { TaskModel, useTaskModel } from "./model";
function TaskContent() {
  const { loading } = useTaskModel();

  return (
    <Spin spinning={loading}>
      <Flex vertical gap={20}>
        <Row gutter={20}>
          <Col span={12}>
            <Profile />
          </Col>
          <Col span={12}>
            <Folder />
          </Col>
        </Row>
        <CoinList />
      </Flex>
    </Spin>
  );
}

export default function Task() {
  return (
    <TaskModel.Provider>
      <TaskContent />
    </TaskModel.Provider>
  );
}
