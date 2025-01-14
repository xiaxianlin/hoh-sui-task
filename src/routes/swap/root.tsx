import { Button, Flex, Radio } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useGenerateDemoData } from "./hooks/demo";
import { useState } from "react";

export default function SwapRoot() {
  const [id, setId] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  const { mutate: demoBearMutation, isPending } = useGenerateDemoData({ onSuccess: () => setId(Math.random()) });

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
      <Outlet key={id} />
    </Flex>
  );
}
