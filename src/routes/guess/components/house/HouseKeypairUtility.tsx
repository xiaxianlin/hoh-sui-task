import { bytesToHex } from "@noble/curves/abstract/utils";
import { bls12_381 } from "@noble/curves/bls12-381";
import { Button, Card, Form, Typography } from "antd";
import { useState } from "react";

export function HouseKeypairUtility() {
  const [housePriv, setHousePriv] = useState<Uint8Array | null>(null);
  return (
    <Card title="House Keypair">
      {housePriv && (
        <Form layout="vertical">
          <Form.Item label="Private Key">
            <Typography.Paragraph copyable>{bytesToHex(housePriv)}</Typography.Paragraph>
          </Form.Item>

          <Form.Item label="Public Key">
            <Typography.Paragraph copyable>{bytesToHex(bls12_381.getPublicKey(housePriv))}</Typography.Paragraph>
          </Form.Item>
        </Form>
      )}
      <Button
        type="primary"
        onClick={() => {
          setHousePriv(bls12_381.utils.randomPrivateKey());
        }}
      >
        生成
      </Button>
    </Card>
  );
}
