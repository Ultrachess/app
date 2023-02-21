import { Text } from "./Text";
const DateDisplay = ({current}: {current: number}) => {
    const date = new Date(current)
    const options = { weekday: "long", year: 'numeric', month: 'long', day: 'numeric' };
    return (
        <Text faded>
            {date.toLocaleDateString("en-US", options)}
        </Text>
    );
}

export default DateDisplay;