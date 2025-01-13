import { db, Locked } from "./db";

export type LockedListingQuery = {
  deleted?: string;
  keyId?: string;
  limit?: string;
};

export const saveLocked = async (locked: Locked) => {
  const obj = await db.locked.get(locked.objectId);
  if (!obj) {
    await db.locked.add(locked);
  } else {
    await db.locked.update(locked.objectId, locked);
  }
};

export const queryLocked = async ({}: LockedListingQuery): Promise<Locked[]> => {
  return [];
};
