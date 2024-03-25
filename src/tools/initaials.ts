import { DAY, VERSION } from "./constants";
import { formatDateToString } from "./formatDate";
import { AppStateModel, TaskModel } from "./models";

export const createState: () => AppStateModel = () => {
    return {
        version: VERSION,
        tasks: []        
    }
}

export const createTask: () => TaskModel = () => {
    const d = new Date().getTime() + (DAY * 5)
    return {
        id: Math.ceil(Math.random() * 10000000),
        title: "",
        titleSecond: "",
        description: "",
        dueToDate: d
    }
}