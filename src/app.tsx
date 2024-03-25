import React, { FC, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { styled }  from 'styled-components';
import { ACTION_NAME, ActionModel, AppStateModel } from './tools/models';
import { STORE_NAME, VERSION } from './tools/constants';
import { reduce } from './tools/reducer';
import { TaskItem } from './components/task';
import { createState } from './tools/initaials';


const AppStyleComponent = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    .addTask{
        width: 100%;
        padding: 2em 0;
        justify-items: center;
        text-align: center;
        align-items: center;
    }
`

const App: FC<{initialState: AppStateModel}> = ({initialState}) => {
    const [state, setState] = useState(initialState)

    const handleDispatch: (action: ActionModel) => void = (action) => {
        setState((state) => reduce(state, action))
    }

    return <AppStyleComponent>
        { state.tasks.sort((ta,tb) => ta.dueToDate - tb.dueToDate).map((task) => {
            return <TaskItem key={task.id} task={task} dispatch={handleDispatch}/>
        }) }
        <div className="addTask button" onPointerUp={() => handleDispatch({name: ACTION_NAME.ADD_TASK})}>✚ Додати</div>
    </AppStyleComponent>
}

const root = createRoot(document.getElementById("root"));

const getState: () => AppStateModel = () => {
    const defauleState = createState()
    const defauleStateSttring = JSON.stringify(defauleState)
    try{
        const stateFromLS = JSON.parse(localStorage.getItem(STORE_NAME)) as AppStateModel
        if(!stateFromLS?.version || stateFromLS.version !== VERSION){
            localStorage.setItem(STORE_NAME,defauleStateSttring)
            return defauleState;
        }else{
            return stateFromLS;
        }
        
    }catch(e) {
        console.error("Unable open local state")
        localStorage.setItem(STORE_NAME,defauleStateSttring)
        return defauleState;
    }
    
}
root.render(<App initialState={getState()}/>);