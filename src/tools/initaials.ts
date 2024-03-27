import { DAY, VERSION } from "./constants";
import { AppStateModel, TaskModel } from "./models";

export const defaultSettings = {
    defaultTaskDueTo: 5,
    showRedStatus: 1,
    showGreenStatus: 3,
}

export const createState: () => AppStateModel = () => {
    return {
        version: VERSION,
        tasks: [],
        lastStateReload: new Date().getTime(),
        settings: defaultSettings
    }
}

export const createTask: (dueTo: number) => TaskModel = (dueTo) => {
    const d = new Date().getTime() + DAY * dueTo;
    return {
        id: Math.ceil(Math.random() * 10000000),
        title: "",
        titleSecond: "",
        description: "",
        dueToDate: d
    }
}