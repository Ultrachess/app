import { useActions } from '../state/game/hooks';
import ToastContainer from 'react-bootstrap/ToastContainer';
import ActionView from './ActionView';
import { useMemo } from "react"

export default () => {
  const actions = useActions()
  const actionList = useMemo(()=>
    Object.values(actions)
      .map(action => <ActionView key={action.id} action = {action}/>)
  , [actions])

  return (
    <div>
      <ToastContainer containerPosition='absolute' position='top-start'>
      </ToastContainer>      
    </div>
  );
};