import { useAppModel } from "@/models/app-model";
import { useConfigModel } from "@/models/config-model";
import { EVENT_KEYS } from "@/routes/task/constantas";
import { Profile, ProfileCreatedData } from "@/routes/task/types";
import { useSuiClientInfiniteQuery } from "@mysten/dapp-kit";
import { useRequest } from "ahooks";
import { createContainer } from "unstated-next";

const stateId = "0x9d9931ddd697b41cd3a3ca28f77facb3ab00364c434d0db58be5386ef86185e1";
const packageId = "0x07582f16664ee7ab4e62a10453c7a4526108e532924f662764c8d0bf773171eb";
const useContainer = () => {
  const { client } = useConfigModel();
  const { address } = useAppModel();
  const { data: events, isFetching } = useSuiClientInfiniteQuery(
    "queryEvents",
    { query: { MoveEventModule: { module: "week_two", package: packageId } } },
    { select: (data) => data.pages.flatMap((i) => i.data.filter((j) => j.sender === address)) },
  );

  const { data: profile, loading } = useRequest(
    async () => {
      if (!events?.length) return;

      const profileCreatedEvent = events.find((e) => e.type === `${packageId}::${EVENT_KEYS.ProfileCreated}`);

      if (!profileCreatedEvent) return;

      const profileCreatedData = profileCreatedEvent.parsedJson as ProfileCreatedData;
      const profileRes = await client.getObject({ id: profileCreatedData.profile, options: { showContent: true } });
      if (!profileRes.data) return;

      const content = profileRes.data.content as any;

      return content.fields as Profile;
    },
    {
      ready: !!events?.length,
      refreshDeps: [events],
    },
  );

  return {
    profile,
    loading: isFetching || loading,
    stateId,
    packageId,
  };
};

export const TaskModel = createContainer(useContainer);
export const useTaskModel = TaskModel.useContainer;
