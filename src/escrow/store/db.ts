import Dexie, { EntityTable } from "dexie";
export interface Locked {
  objectId: string;
  id?: number;
  keyId?: string;
  creator?: string;
  itemId?: string;
  deleted?: boolean;
}

export interface Escrow {
  objectId: string;
  id?: number;
  sender?: string;
  recipient?: string;
  keyId?: string;
  itemId?: string;
  swapped?: boolean;
  cancelled?: boolean;
}

export interface Cursor {
  id: string;
  eventSeq: string;
  txDigest: string;
}

export const db = new Dexie("escrow") as Dexie & {
  locked: EntityTable<Locked, "objectId">;
  escrow: EntityTable<Escrow, "objectId">;
  cursor: EntityTable<Cursor, "id">;
};

db.version(2).stores({
  locked: "++id, objectId, deleted",
  escrow: "++id, objectId",
  cursor: "id",
});
