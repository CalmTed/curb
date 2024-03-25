export const formatDateToString: (timestamp: number) => string = (timestamp) => {
    const date = new Date(timestamp);
    const y = date.getFullYear()
    const m = (date.getMonth()+1).toString().padStart(2,"0")
    const d = date.getDate().toString().padStart(2,"0")
    return `${d}-${m}-${y}`;
}

export const formatDateToTimestamp: (dateString: string) => number | undefined = (dateString) => {
    const regex = /^(((((0[1-9])|(1\d)|(2[0-8]))-((0[1-9])|(1[0-2])))|((31-((0[13578])|(1[02])))|((29|30)-((0[1,3-9])|(1[0-2])))))-((20[0-9][0-9]))|(29-02-20(([02468][048])|([13579][26]))))$/
    console.log("before testing",dateString)
    if(!regex.test(dateString)){
        console.log("aborings")
        return;
    }
    const y = dateString.substring(6,10)
    const m = dateString.substring(3,5)
    const d = dateString.substring(0,2)
    const returningDate = new Date(`${y}-${m}-${d}`)
    return returningDate.getTime()
    // const d = dateString.substring(0,2);
    // const m = dateString.substring(3,5);
    // const y = dateString.substring(6,10);
}