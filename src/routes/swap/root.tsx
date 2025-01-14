import { startListeners, stopListeners } from "@/escrow/indexer/event-indexer";
import { useConfigModel } from "@/models/config.model";
import { Button, Flex, Radio } from "antd";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useGenerateDemoData } from "./hooks/demo";

export default function SwapRoot() {
  const location = useLocation();
  const navigate = useNavigate();
  const { client } = useConfigModel();
  const { mutate: demoBearMutation, isPending } = useGenerateDemoData();

  useEffect(() => {
    console.log("startListeners");
    startListeners(client);
    return () => stopListeners();
  }, []);

  return (
    <Flex vertical>
      <Flex align="center" justify="center" gap={24}>
        <Radio.Group value={location.pathname} onChange={(e) => navigate(e.target.value)}>
          <Radio.Button value="/swap/escrows">Escrows</Radio.Button>
          <Radio.Button value="/swap/locked">Manage Objects</Radio.Button>
        </Radio.Group>
        <Button type="primary" disabled={isPending} onClick={() => demoBearMutation()}>
          New Demo Bear
        </Button>
      </Flex>
      <Outlet />
    </Flex>
  );
}
