import { db, Locked } from "./db";

export type LockedListingQuery = {
  keyId?: string;
  deleted?: boolean;
};

export const saveLocked = async (locked: Locked) => {
  const obj = await db.locked.get(locked.objectId);
  if (!obj) {
    await db.locked.add(locked);
  } else {
    await db.locked.update(locked.objectId, locked);
  }
};

export const queryLocked = async ({ deleted }: LockedListingQuery) => {
  return db.locked.filter((obj) => obj.deleted === deleted).toArray();
};

export const getLockedByKeyId = async (keyId: string) => {
  return db.locked.where("keyId").equals(keyId).first();
};
