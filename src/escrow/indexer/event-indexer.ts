import { EventId, SuiClient, SuiEvent, SuiEventFilter } from "@mysten/sui/client";
import { ESCROW_PACKAGE_ID } from "../../constants";
import { handleLockObjects } from "./locked-handler";
import { handleEscrowObjects } from "./escrow-handler";
import { getCursor, saveCursor } from "../store/cursor";

const status = {
  start: false,
};

type SuiEventsCursor = EventId | null | undefined;

type EventExecutionResult = {
  cursor: SuiEventsCursor;
  hasNextPage: boolean;
};

type EventTracker = {
  type: string;
  filter: SuiEventFilter;
  callback: (events: SuiEvent[], type: string) => any;
};

const EVENTS_TO_TRACK: EventTracker[] = [
  {
    type: `${ESCROW_PACKAGE_ID}::lock`,
    filter: {
      MoveEventModule: {
        module: "lock",
        package: ESCROW_PACKAGE_ID,
      },
    },
    callback: handleLockObjects,
  },
  {
    type: `${ESCROW_PACKAGE_ID}::shared`,
    filter: {
      MoveEventModule: {
        module: "shared",
        package: ESCROW_PACKAGE_ID,
      },
    },
    callback: handleEscrowObjects,
  },
];

const executeEventJob = async (
  client: SuiClient,
  tracker: EventTracker,
  cursor: SuiEventsCursor,
): Promise<EventExecutionResult> => {
  try {
    const { data, hasNextPage, nextCursor } = await client.queryEvents({
      query: tracker.filter,
      cursor,
      order: "ascending",
    });

    await tracker.callback(data, tracker.type);

    if (nextCursor && data.length > 0) {
      await saveCursor({ id: tracker.type, ...nextCursor });

      return {
        cursor: nextCursor,
        hasNextPage,
      };
    }
  } catch (e) {
    console.error(e);
  }
  return {
    cursor,
    hasNextPage: false,
  };
};

const runEventJob = async (client: SuiClient, tracker: EventTracker, cursor: SuiEventsCursor) => {
  if (!status.start) return;
  const result = await executeEventJob(client, tracker, cursor);
  setTimeout(() => runEventJob(client, tracker, cursor), result.hasNextPage ? 0 : 1000);
};

export const startListeners = async (client: SuiClient) => {
  status.start = true;
  for (const event of EVENTS_TO_TRACK) {
    runEventJob(client, event, await getCursor(event.type));
  }
};

export const stopListeners = () => {
  status.start = false;
};
