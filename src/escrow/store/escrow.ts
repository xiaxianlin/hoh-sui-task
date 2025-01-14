import { db, Escrow } from "./db";

export type EscrowListingQuery = {
  sender?: string;
  recipient?: string;
};

export const saveEscrow = async (escrow: Escrow) => {
  const obj = await db.locked.get(escrow.objectId);
  if (!obj) {
    await db.escrow.add(escrow);
  } else {
    await db.escrow.update(escrow.objectId, escrow);
  }
};

export const queryRequestedEscrows = async (address: string) => {
  return db.escrow.filter((e) => !e.cancelled && !!e.swapped && e.recipient === address).toArray();
};

export const queryPendingEscrows = async (address: string) => {
  return db.escrow.filter((e) => !e.cancelled && !e.swapped && e.sender === address).toArray();
};
