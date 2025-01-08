import { Typography } from "antd";
import { TASK_PACKAGE_ID } from "../../../constants";
import { useAppModel } from "../../../models/app.model";

export default function ProfileInfo() {
  const { objects } = useAppModel();
  const profile = objects.find(
    (i) => i.type === `${TASK_PACKAGE_ID}::week_one::Profile`,
  );
  return (
    <>
      <Typography.Paragraph>name: {profile?.fields.name}</Typography.Paragraph>
      <Typography.Paragraph>
        description: {profile?.fields.description}
      </Typography.Paragraph>
    </>
  );
}
