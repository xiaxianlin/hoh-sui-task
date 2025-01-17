import { Card, Col, Flex, Row } from "antd";
import { GUESS_HOUSE_CAP_ID, GUESS_PACKAGE_ID } from "./constants";
import { HouseSesh } from "./views/HouseSesh";
import { PlayerSesh } from "./views/PlayerSesh";
import { GuessModel } from "./models/guess";

function GuessContainer() {
  return (
    <Card title="猜硬币正反面游戏">
      <Flex vertical gap={12}>
        <div>Package ID: {GUESS_PACKAGE_ID}</div>
        <div>HouseCap ID: {GUESS_HOUSE_CAP_ID}</div>
      </Flex>
      <Row gutter={16} className="mt-4">
        <Col span={12}>
          <HouseSesh />
        </Col>
        <Col span={12}>
          <PlayerSesh />
        </Col>
      </Row>
    </Card>
  );
}

export default function Guess() {
  return (
    <GuessModel.Provider>
      <GuessContainer />
    </GuessModel.Provider>
  );
}
