import { ESCROW_PACKAGE_ID } from "@/constants";

export enum QueryKey {
  Locked = "locked",
  Escrow = "escrow",
  GetOwnedObjects = "getOwnedObjects",
}

export const CONSTRACT = {
  lockedType: `${ESCROW_PACKAGE_ID}::lock::Locked`,
  lockedKeyType: `${ESCROW_PACKAGE_ID}::lock::Key`,
  lockedObjectDFKey: `${ESCROW_PACKAGE_ID}::lock::LockedObjectKey`,
};
