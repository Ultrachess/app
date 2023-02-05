import { Text } from "./Text";

export default ({accept}: {accept: boolean}) => {
    return (
        <Text>
            {accept ? 'Accept' : 'Decline'}
        </Text>
    );
}
