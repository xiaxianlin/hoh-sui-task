import { SuiObjectResponse } from "@mysten/sui/client";
import { UseQueryResult } from "@tanstack/react-query";
import { Spin, Typography } from "antd";
import { ReactNode } from "react";

export default function QueryContainer({
  query,
  children,
}: {
  query: UseQueryResult<SuiObjectResponse, Error>;
  children: ReactNode;
}) {
  if (query.isFetching) {
    return <Spin spinning></Spin>;
  }

  if (query.error) {
    return <Typography.Paragraph>Error: {query.error.message}</Typography.Paragraph>;
  }

  if (!query.data?.data) {
    return <Typography.Paragraph>Not Found</Typography.Paragraph>;
  }

  return children;
}
