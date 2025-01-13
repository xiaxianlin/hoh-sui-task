import { startListeners, stopListeners } from "@/escrow/indexer/event-indexer";
import { useConfigModel } from "@/models/config.model";
import { Flex, Radio } from "antd";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function SwapRoot() {
  const location = useLocation();
  const navigate = useNavigate();
  const { client } = useConfigModel();

  useEffect(() => {
    startListeners(client);
    return () => stopListeners();
  }, [client]);

  return (
    <Flex vertical>
      <Flex align="center" justify="center">
        <Radio.Group value={location.pathname} size="large" onChange={(e) => navigate(e.target.value)}>
          <Radio.Button value="/swap/escrows">Escrows</Radio.Button>
          <Radio.Button value="/swap/locked">Manage Objects</Radio.Button>
        </Radio.Group>
      </Flex>
      <Outlet />
    </Flex>
  );
}
