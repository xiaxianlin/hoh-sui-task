import { Flex } from "antd";
import { HouseInitialize, HouseKeypairUtility } from "../components";

export function HouseSesh() {
  return (
    <Flex vertical gap={20}>
      <HouseKeypairUtility />
      <HouseInitialize />
    </Flex>
  );
}
