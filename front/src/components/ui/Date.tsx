import { Text } from "./Text";
//current must be in seconds

const DateDisplay = ({ current }: { current: number }) => {
  const date = new Date(current);
  const options: any = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  return <Text faded>{date.toLocaleDateString("en-US", options)}</Text>;
};

export default DateDisplay;
