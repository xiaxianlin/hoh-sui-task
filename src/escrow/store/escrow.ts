import { db, Escrow } from "./db";

export type EscrowListingQuery = {
  escrowId?: string;
  sender?: string;
  recipient?: string;
  cancelled?: string;
  swapped?: string;
  limit?: string;
};

export const saveEscrow = async (escrow: Escrow) => {
  const obj = await db.locked.get(escrow.objectId);
  if (!obj) {
    await db.escrow.add(escrow);
  } else {
    await db.escrow.update(escrow.objectId, escrow);
  }
};

export const queryEscrow = async ({}: EscrowListingQuery & { cursor?: string; objectId?: string }): Promise<{
  cursor?: string;
  data: Escrow[];
}> => {
  return { cursor: "", data: [] };
};
