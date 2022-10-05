import * as React from "react";
import { Text, Grid, Card, Row } from "@nextui-org/react";
import UserList from "./UserList";
import { useAppSelector } from "../state/hooks";

export default () => {
    const [mainItems, setMainItems] = React.useState([]);
    const allElos = useAppSelector(state => state.game.elo)
    const rankedUsers = React.useMemo(()=>{
        var values: number[] = Object.values(allElos)
        var keys: string[] = Object.keys(allElos)
        var tempValues = [...values]
        var tempKeys = [...keys]
        var done = false;
        while (!done) {
            done = true;
            for (var i = 1; i < tempValues.length; i += 1) {
                if (tempValues[i - 1] > tempValues[i]) {
                    done = false;
                    var tmp = tempValues[i - 1];
                    var tmpKeys = tempKeys[i - 1];
                    tempValues[i - 1] = tempValues[i];
                    tempKeys[i - 1] = tempKeys[i]
                    tempValues[i] = tmp;
                    tempKeys[i] = tmpKeys
                }
            }
        }
        return tempKeys.reverse()
    }, [allElos])
    return (
        <div className="body">
            <div className="content">
                <Text h1>Rankings</Text>
                <Card css={{ height:"700px", width: "1000px", paddingLeft:"50px", paddingRight:"50px", paddingTop:"50px"}}>
                    <Card.Header>
                        <Row justify="center">
                            
                        </Row>
                    </Card.Header>
                    <UserList users={rankedUsers}/>
                </Card>
            </div>
        </div>    
    );
}