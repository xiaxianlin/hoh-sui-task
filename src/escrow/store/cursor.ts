import { Cursor, db } from "./db";

export const getCursor = async (id: string) => {
  return db.cursor.get(id);
};

export const saveCursor = async (cursor: Cursor) => {
  const exist = await getCursor(cursor.id);
  if (exist) {
    await db.cursor.update(cursor.id, cursor);
  } else {
    await db.cursor.add(cursor);
  }
};
