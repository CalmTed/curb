
export interface AppStateModel{
    version: string,
    tasks: TaskModel[]
}

export interface TaskModel{
    id: number,
    title: string,
    titleSecond: string,
    description: string,
    dueToDate: number
}

export enum ACTION_NAME {
    "ADD_TASK" = "ADD_TASK",
    "EDIT_TASK" = "EDiT_TASK",
    "REMOVE_TASK" = "REMOVE_TASK",
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
}