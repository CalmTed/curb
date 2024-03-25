import React, { FC, useState } from "react"
import { TaskModel, ActionModel, ACTION_NAME } from "../tools/models"
import { styled } from "styled-components"
import { formatDateToString, formatDateToTimestamp } from "../tools/formatDate"

interface TaskComponentModel{
    task: TaskModel,
    dispatch: (action: ActionModel) => void
}

const TaskStyle = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    height: 4em;
    min-height: 4em;
    justify-content: stretch;
    & .confirmWrapper{
        width: 100%;
        height: 100%;
        display: flex;
        & span{
            width: 50%;
            height: 100%;
            justify-content: center;
            align-items: center;
            display: flex;
        }
        & .button.confirmConfirm:hover{
            --button-color: var(--state-red);
        }
    }
    &>*{
        flex: 1;
        height: 100%;   
        overflow: hidden;
        border: none;
        transation: border 0.5s;
        border: 0pt solid transparent;
        text-align:center;
        *{
            text-align:center;
            border: 0pt solid transparent;
        }
    }
    &>*:not(.removeButton){
        
        & input:not(:focus):hover{
            background-image: repeating-linear-gradient(45deg, var(--text-second) 0, var(--text-second) 2px, transparent 0, transparent 16px);
        }
    }
    textarea:not(:focus):hover{
        background-image: repeating-linear-gradient(45deg, var(--text-second) 0, var(--text-second) 2px, transparent 0, transparent 16px);
    }
    & .name{
        max-width: 30%;
        display: flex;
        flex-direction: column;
        & .title{
           font-size: 1.5em;
           width: 100%;
           height: 1.3em;
           font-weight: 900;
        }
        & .titleSecond{
            font-size: 0.8em;
            width: 100%;
            height: 1em;
            color: var(--text-second);
         }
    }
    & .description{
        max-width: 40%;
        font-size: 0.9em;
        height: 2.2em;
    }
    & .dueToDate{
        &.invalid{
            background-image: repeating-linear-gradient(45deg, var(--state-red) 0, var(--state-red) 2px, transparent 0, transparent 16px);
        }
        font-size: 1.1em;
        max-width: 6em;
    }
    & .removeButton{
        opacity: 0;
        transition: opacity 0.1s;
        max-width: 3em;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    &:hover .removeButton{   
        opacity: 1;
    }

`

export const TaskItem: FC<TaskComponentModel> = ({task, dispatch}) => {
    const [isRemovalConfirmationShown, showConfirmation] = useState(false)
    const [dateString, setDateString] = useState(formatDateToString(task.dueToDate))


    const handleRemovalAnswer:(a: boolean) => void = (a) => {
        showConfirmation(false);
        if(a)
        dispatch({
            name: ACTION_NAME.REMOVE_TASK,
            payload: task.id
        })
    }

    const handleRemove = () => {
        showConfirmation(true)
    }

    const handleEdit:(a: {
        title?: string
        titleSecond?: string
        description?: string
    }) => void = ({title, titleSecond, description}) => {
        dispatch({
            name: ACTION_NAME.EDIT_TASK,
            payload: {
                id: task.id,
                title,
                titleSecond,
                description
            }
        })
    }
    const handleDateChange:(newVal: string) => void = (newVal) => {
        setDateString(newVal)
        const convertedDate = formatDateToTimestamp(newVal)
        if(!convertedDate){
            return;
        }
        console.log("setting date", convertedDate, newVal)
        dispatch({
            name: ACTION_NAME.EDIT_TASK,
            payload: {
                id: task.id,
                dueToDate: convertedDate
            }
        })
    }

    const isDateValid = typeof formatDateToTimestamp(dateString) !== "undefined"
    return <TaskStyle>
        {
        !isRemovalConfirmationShown && <>
            <div className="name">
                <input
                    className="title"
                    placeholder="Номер наказу"
                    value={task.title}
                    onChange={(e) => handleEdit({title: e.target.value})}
                />
                <input
                    className="titleSecond"
                    placeholder="дата наказу"
                    value={task.titleSecond}
                    onChange={(e) => handleEdit({titleSecond: e.target.value})}
                />
            </div>
            <textarea
                className="description"
                placeholder="опис"
                value={task.description}
                onChange={(e) => handleEdit({description: e.target.value})}
            />
            <input
                type="text"
                placeholder="дд-мм-рррр"
                className={`dueToDate ${isDateValid ? "valid" : "invalid"}`}
                value={dateString}
                onChange={(e) => handleDateChange(e.target.value)}
            />
            <div className="removeButton button" onPointerUp={handleRemove}>✖</div>
        </>
        }
        {
        isRemovalConfirmationShown && <>
            <div className="confirmWrapper">
                <span className="confirmConfirm button" onPointerUp={() => handleRemovalAnswer(true)}>Видалити</span>
                <span className="confirmCencel button" onPointerUp={() => handleRemovalAnswer(false)}>Відмінити</span>
            </div>
        </>
        }
    </TaskStyle>
}