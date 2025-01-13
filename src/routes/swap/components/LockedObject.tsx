import { useSuiClientQuery } from "@mysten/dapp-kit";
import { SuiObjectData } from "@mysten/sui/client";
import { CONSTRACT } from "../constants";
import { Locked } from "./Locked";

export function LockedObject({
  object,
  itemId,
  hideControls,
}: {
  object: SuiObjectData;
  itemId?: string;
  hideControls?: boolean;
}) {
  const owner = () => {
    if (!object.owner || typeof object.owner === "string" || !("AddressOwner" in object.owner)) return undefined;
    return object.owner.AddressOwner;
  };

  const getKeyId = (item: SuiObjectData) => {
    if (!(item.content?.dataType === "moveObject") || !("key" in item.content.fields)) return "";
    return item.content.fields.key as string;
  };

  const suiObjectId = useSuiClientQuery(
    "getDynamicFieldObject",
    {
      parentId: object.objectId,
      name: { type: CONSTRACT.lockedObjectDFKey, value: { dummy_field: false } },
    },
    {
      select: (data) => data.data,
      enabled: !itemId,
    },
  );

  return (
    <Locked
      locked={{
        itemId: itemId || suiObjectId.data?.objectId!,
        objectId: object.objectId,
        keyId: getKeyId(object),
        creator: owner(),
        deleted: false,
      }}
      hideControls={hideControls}
    />
  );
}
