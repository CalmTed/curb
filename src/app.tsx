import React, { FC, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { styled }  from 'styled-components';
import { ACTION_NAME, ActionModel, AppStateModel } from './tools/models';
import { allowedVersions, STORE_NAME, VERSION } from './tools/constants';
import { reduce } from './tools/reducer';
import { TaskItem } from './components/task';
import { createState } from './tools/initaials';


const AppStyleComponent = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    padding-bottom: 5em;
    height: calc(100vh - 5em);
    .titlebar{
        height: 30px;
        width: 100%;
        -webkit-user-select: none;
        -webkit-app-region: drag;
    }
    .aboutBlock{
        h1{
            margin-bottom: 0;
        }
        small{
            ma
        }
        text-align: center;
        padding: 0 2em;
        p{
            font-size: 0.7em;
        }
    }
    .settingsRow{
        display: flex;
        margin-bottom: 1em;
        height: 4em;
        justify-content: center;
        align-items: center;
        padding: 0 2em;
        .settingsLabel{
            align-items: center;
            display: flex;
            width: 80%;
            max-width: 25em;
            height: 100%;
        }
        input{
            width: 20%;
            height: 100%;
            min-width: 3em;
            max-width: 6em;
            text-align: center;
            font-size: 1em;
            border: 0;
        }
        input:not(:focus):hover{
            background-image: repeating-linear-gradient(45deg, var(--text-second) 0, var(--text-second) 2px, transparent 0, transparent 16px);
        }
    }
    .addTask,.showSettings,.hideSettings{
        width: 100%;
        padding: 2em 0;
        justify-items: center;
        text-align: center;
        align-items: center;
        transition: all .2s;
    }
    .showSettings{
        position: fixed;
        bottom: -5em;
        background-color: var(--bg);
    }
    .addTask{
        opacity: 0;
    }
    &:hover{
        .showSettings{
            bottom: 0;
        }
        .addTask{
            opacity: 1;
        }   
    }
`

const App: FC<{initialState: AppStateModel}> = ({initialState}) => {
    const [state, setState] = useState(initialState)
    const [showSettings, setShowSettings] = useState(false)

    const handleDispatch: (action: ActionModel) => void = (action) => {
        setState((state) => reduce(state, action))
    }
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleDispatch({
                name: ACTION_NAME.RERENDER
            })
        }, 60* 1000)
        return () => {
            clearTimeout(timeoutId)
        }
    })

    useEffect(() => {
        //@ts-ignore
        window.ipc.on("import-reply", (dataString: string) => {
            try{
                const newState = JSON.parse(dataString) as AppStateModel
                if(!allowedVersions.includes(newState.version)){
                    return;
                }
                setState({
                    ...newState,
                    version: VERSION
                })
            }catch(e){
                console.error("Unable to import import")
            }
        })
    }) 

    const handleOpenSettings:(show: boolean) => void = (show) => {
        setShowSettings(show)
    }

    const handleExport:(state: AppStateModel) => void = (state) => {
        //@ts-ignore
        window.ipc.send("export", JSON.stringify(state));
    }
    const handleImport:(state: AppStateModel) => void = (state) => {
        // @ts-ignore
        window.ipc.send("import");
    }

    const validateNumber: (s: string, min: number, max: number) => boolean = (s,min,max) => {
        const n = parseInt(s);
        //check for undefined, NaN & null 
        if(typeof s === "undefined" || Number.isNaN(n) || !s){
            return false;
        }
        if(n > max || n < min){
            return false;
        }else{
            return true;
        }
    }

    const handleSetSettings:(a:{
        defaultTaskDueTo?: string
        showRedStatus?: string
        showGreenStatus?: string
    }) => void = (a) => {
        handleDispatch({
            name: ACTION_NAME.SET_SETTINGS,
            payload:{
                defaultTaskDueTo: validateNumber(a.defaultTaskDueTo,2,370) ? parseInt(a.defaultTaskDueTo) : undefined,
                showGreenStatus: validateNumber(a.showGreenStatus,2,370) ? parseInt(a.showGreenStatus) : undefined,
                showRedStatus: validateNumber(a.showRedStatus,1,370) ? parseInt(a.showRedStatus) : undefined
            }
        })
    }

    // const checkSettings = () => {
    //     if( state.settings.defaultTaskDueTo)
    // }

    return <AppStyleComponent>
        <div className="titlebar"></div>
        {!showSettings && <>
            { state.tasks.sort((ta,tb) => ta.dueToDate - tb.dueToDate).map((task) => {
                return <TaskItem key={task.id} state={state} task={task} dispatch={handleDispatch}/>
            }) }
            <div className="addTask button" onPointerUp={() => handleDispatch({name: ACTION_NAME.ADD_TASK})}>+ Додати</div>
            <div className="showSettings button" onPointerUp={() => handleOpenSettings(true)}>Налаштування</div>
        </>}
        {showSettings && <>
            <div className="aboutBlock">
                <h1>Curb</h1>
                <small>{VERSION}</small>
                <p>Цей додаток створений на прохання одного офіцера для спрощення контролю виконання наказів в певні терміни</p>
                <p>Він підсвічує задачі певним кольором в залежності від залишку часу на виконання</p>
                <p>Англійською слово "curb" як іменник означає бордюр, а як дієслово означає обмежувати або контролювати</p>
                <p>Актуальну версію програми можна знайти за посиланням: https://github.com/CalmTed/curb</p>
                
            </div>
            <label className="settingsRow">
                <span className="settingsLabel">Днів на виконання за замовчуванням</span>
                <input
                    type="number"
                    min="2"
                    max="370"
                    value={state.settings.defaultTaskDueTo}
                    onChange={(e) => handleSetSettings({defaultTaskDueTo: e.target.value})}
                />
            </label>
            <label className="settingsRow">
                <span className="settingsLabel">Днів до червоного статусу</span>
                <input
                    min="1"
                    max="370"
                    type="number"
                    value={state.settings.showRedStatus}
                    onChange={(e) => handleSetSettings({showRedStatus: e.target.value})}
                />
            </label>
            <label className="settingsRow">
                <span className="settingsLabel">Днів до зеленого статусу</span>
                <input
                    min="2"
                    max="370"
                    type="number"
                    value={state.settings.showGreenStatus}
                    onChange={(e) => handleSetSettings({showGreenStatus: e.target.value})}/>
            </label>
            <div className="settingsRow button" onPointerUp={() => handleExport(state)}>Експортувати</div>
            <div className="settingsRow button" onPointerUp={() => handleImport(state)}>Імпортувати</div>
            <div className="hideSettings button" onPointerUp={() => handleOpenSettings(false)}>Закрити</div>
            
        </>}
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
            // return defauleState;
            return stateFromLS;
        }
        
    }catch(e) {
        console.error("Unable open local state")
        localStorage.setItem(STORE_NAME,defauleStateSttring)
        return defauleState;
    }
    
}

// const handleImport: () => void = (data) => {
//     on("import", (result) => {
//         try{
//             const data = JSON.stringify(result) 
//         }catch(e){
//             console.error(e)
//         }
//     })
// }

// const handleExport: () => void = () => {
    
// }
root.render(<App initialState={getState()}/>);