import { SuiEvent } from "@mysten/sui/client";
import { Locked } from "../store/db";
import { saveLocked } from "../store/locked";

type LockEvent = {
  lock_id: string;
  key_id?: string;
  item_id?: string;
  creator?: string;
};

export const handleLockObjects = async (events: SuiEvent[], type: string) => {
  const updates: Record<string, Locked> = {};
  for (const event of events) {
    if (!event.type.startsWith(type)) {
      throw new Error("Invalid event module origin");
    }

    const data = event.parsedJson as LockEvent;
    const isDeletionEvent = !("key_id" in data);

    if (!updates[data.lock_id]) {
      updates[data.lock_id] = { objectId: data.lock_id };
    }

    if (isDeletionEvent) {
      updates[data.lock_id].deleted = true;
    }

    updates[data.lock_id].keyId = data.key_id;
    updates[data.lock_id].creator = data.creator;
    updates[data.lock_id].itemId = data.item_id;
  }

  await Promise.all(Object.keys(updates).map((key) => saveLocked(updates[key])));
};
