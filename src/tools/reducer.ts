import { STORE_NAME } from "./constants";
import { createTask } from "./initaials";
import { ACTION_NAME, ActionModel, AppStateModel } from "./models";


export const reduce: (state: AppStateModel, action: ActionModel) => AppStateModel = (state, action) => {
    let newState: AppStateModel | undefined;
    
    switch(action.name){
        case ACTION_NAME.ADD_TASK:
            newState = {
                ...state,
                tasks: [...state.tasks, createTask()]
            }
        break;
        case ACTION_NAME.EDIT_TASK:
            if(typeof action?.payload !== "object" 
            || typeof action?.payload?.id !== "number"){
                break;
            } 
            console.log(state.tasks.map(t => {
                if(t.id === action.payload.id){
                    console.log(t.id, action.payload?.description ?? t.description);
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
            }))
            newState = {
                ...state,
                tasks: state.tasks.map(t => {
                    if(t.id === action.payload.id){
                        console.log(t.id, action.payload?.description ?? t.description);
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
                tasks: state.tasks.filter(t => t.id !== action.payload)
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