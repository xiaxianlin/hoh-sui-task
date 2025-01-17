import { message } from "antd";

export const copy = (text: string) => {
  navigator.clipboard.writeText(text);
  message.success("复制成功");
};
