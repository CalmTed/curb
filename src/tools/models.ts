
export interface AppStateModel{
    version: string,
    tasks: TaskModel[],
    lastStateReload: number,
    settings: {
        defaultTaskDueTo: number//in days
        showRedStatus: number//in days
        showGreenStatus: number//in days
    }
}

export interface TaskModel{
    id: number,
    title: string,
    titleSecond: string,
    description: string,
    dueToDate: number,
}

export enum ACTION_NAME {
    ADD_TASK = "ADD_TASK",
    EDIT_TASK = "EDiT_TASK",
    REMOVE_TASK = "REMOVE_TASK",
    RERENDER = "RERENDER",
    SET_SETTINGS = "SET_SETTINGS"
}

export type ActionModel = {
    name: ACTION_NAME.ADD_TASK,
} | {
    name: ACTION_NAME.REMOVE_TASK,
    payload: number
} | {
    name: ACTION_NAME.EDIT_TASK,
    payload: {
        id: number
        title?: string
        titleSecond?: string
        description?: string
        dueToDate?: number
    }
} | {
    name: ACTION_NAME.RERENDER
} | {
    name: ACTION_NAME.SET_SETTINGS,
    payload: {
        defaultTaskDueTo?: number
        showRedStatus?: number
        showGreenStatus?: number
    }
}