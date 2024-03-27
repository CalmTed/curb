import { STORE_NAME } from "./constants";
import { createTask, defaultSettings } from "./initaials";
import { ACTION_NAME, ActionModel, AppStateModel } from "./models";


export const reduce: (state: AppStateModel, action: ActionModel) => AppStateModel = (state, action) => {
    let newState: AppStateModel | undefined;
    
    switch(action.name){
        case ACTION_NAME.ADD_TASK:
            newState = {
                ...state,
                tasks: [...state.tasks, createTask(state.settings.defaultTaskDueTo)]
            }
        break;
        case ACTION_NAME.EDIT_TASK:
            if(typeof action?.payload !== "object" 
            || typeof action?.payload?.id !== "number"){
                break;
            } 
            newState = {
                ...state,
                tasks: state.tasks.map(t => {
                    if(t.id === action.payload.id){
                        return {
                            ...t,
                            title: action.payload?.title ?? t.title,
                            titleSecond: action.payload?.titleSecond ?? t.titleSecond,
                            description: action.payload?.description ?? t.description,
                            dueToDate: action.payload?.dueToDate ?? t.dueToDate,
                        }
                    }else{
                        return t;
                    }                        
                })
            }
        break;
        case ACTION_NAME.REMOVE_TASK:
            if(typeof action?.payload !== "number"){
                break;
            }
            newState = {
                ...state,
                lastStateReload: new Date().getTime(),
                tasks: state.tasks.filter(t => t.id !== action.payload)
            }
        break;
        case ACTION_NAME.RERENDER:
            newState = {
                ...state,
                lastStateReload: new Date().getTime()
            }
        break;
        case ACTION_NAME.SET_SETTINGS:
            if(typeof action?.payload !== "object"){
                break;
            }
            newState = {
                ...state,
                settings: {
                            ...state.settings,
                            defaultTaskDueTo: action.payload?.defaultTaskDueTo ?? state.settings.defaultTaskDueTo ?? defaultSettings.defaultTaskDueTo,
                            showGreenStatus: action.payload?.showGreenStatus ?? state.settings.showGreenStatus ?? defaultSettings.showGreenStatus,
                            showRedStatus: action.payload?.showRedStatus ?? state.settings.showRedStatus ?? defaultSettings.showRedStatus,
                        }                    
            }
        break; 
        default: console.error(action)
    }

    if(newState){
        localStorage.setItem(STORE_NAME, JSON.stringify(newState))
        return newState;
    }else{
        return state;
    }
}