import { useAppModel } from "@/models/app-model";
import { useConfigModel } from "@/models/config-model";
import { EVENT_KEYS } from "@/routes/task/constantas";
import { Folder, Profile, ProfileCreatedData } from "@/routes/task/types";
import { useRequest } from "ahooks";
import { useEffect, useState } from "react";
import { createContainer } from "unstated-next";

const stateId = "0x9d9931ddd697b41cd3a3ca28f77facb3ab00364c434d0db58be5386ef86185e1";
const packageId = "0x07582f16664ee7ab4e62a10453c7a4526108e532924f662764c8d0bf773171eb";
const useContainer = () => {
  const { client } = useConfigModel();
  const { address } = useAppModel();
  const [folder, setFolder] = useState<Folder>();

  const {
    data: events,
    loading: isFetching,
    refresh: refetch,
  } = useRequest(async () => {
    const data = await client.queryEvents({ query: { MoveEventModule: { module: "week_two", package: packageId } } });
    return data.data.filter((j) => j.sender === address);
  });

  const { data, loading } = useRequest(
    async () => {
      if (!events?.length) return;

      const profileCreatedEvent = events.find((e) => e.type === `${packageId}::${EVENT_KEYS.ProfileCreated}`);

      if (!profileCreatedEvent) return;

      const profileCreatedData = profileCreatedEvent.parsedJson as ProfileCreatedData;
      const profileRes = await client.getObject({ id: profileCreatedData.profile, options: { showContent: true } });
      if (!profileRes.data) return;
      const profile = (profileRes.data.content as any).fields as Profile;

      if (profile.folders.length) {
        const foldersRes = await client.multiGetObjects({ ids: profile.folders, options: { showContent: true } });
        const folders = foldersRes.map((i) => (i.data?.content as any)?.fields as Folder);
        console.log(folders);
        return { profile, folders };
      }

      return { profile, folders: [] };
    },
    {
      ready: !!events?.length,
      refreshDeps: [events],
    },
  );

  useEffect(() => {
    if (!data?.folders.length || !!folder) return;
    setFolder(data.folders[0]);
  }, [data]);

  return {
    ...data,
    folder,
    loading: isFetching || loading,
    stateId,
    packageId,
    refetch,
    setFolder,
  };
};

export const TaskModel = createContainer(useContainer);
export const useTaskModel = TaskModel.useContainer;
