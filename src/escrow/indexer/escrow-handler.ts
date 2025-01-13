import { SuiEvent } from "@mysten/sui/client";
import { Escrow } from "../store/db";
import { saveEscrow } from "../store/escrow";

type EscrowEvent = {
  escrow_id: string;
  key_id?: string;
  item_id?: string;
  sender?: string;
  recipient?: string;
};

export const handleEscrowObjects = async (events: SuiEvent[], type: string) => {
  const updates: Record<string, Escrow> = {};
  for (const event of events) {
    if (!event.type.startsWith(type)) {
      throw new Error("Invalid event module origin");
    }

    const data = event.parsedJson as EscrowEvent;

    if (!updates[data.escrow_id]) {
      updates[data.escrow_id] = { objectId: data.escrow_id };
    }

    if (event.type.endsWith("::EscrowCancelled")) {
      updates[data.escrow_id].cancelled = true;
      continue;
    }

    if (event.type.endsWith("::EscrowSwapped")) {
      updates[data.escrow_id].swapped = true;
      continue;
    }

    const creationData = event.parsedJson as EscrowEvent;

    updates[data.escrow_id].sender = creationData.sender;
    updates[data.escrow_id].recipient = creationData.recipient;
    updates[data.escrow_id].keyId = creationData.key_id;
    updates[data.escrow_id].itemId = creationData.item_id;
  }

  await Promise.all(Object.keys(updates).map((key) => saveEscrow(updates[key])));
};
