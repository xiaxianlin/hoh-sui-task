import { useAppModel } from "../../models/app.model";

export const useSendTokens = () => {
  const { account } = useAppModel();
};
