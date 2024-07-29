import moment from "moment";
import { TimesheetEntry } from "../types/timesheetType";
import { dateDifferenceInDays } from "./timeService";

// knowing the start date and the finish date, 
// create an array of timesheet entries with the appropriate day information, using the default data to fill up (starttime, finishtime, locationType, comment)
export function createTimesheetSample() {
    let timesheet = [];
    let startDate = moment("2024-07-01");
    let dateOnCursor = moment(startDate);
    let finishDate = moment("2024-07-08");
    let count = 0;
    while (dateDifferenceInDays(dateOnCursor, finishDate) > 0) {
        count++;
        let timesheetEntry = {
            id: count,
            date: dateOnCursor.format(),
            startTime: '06:00',
            finishTime: '18:00',
            locationType: 'onshore',
            comment: 'support',
            weekNumber: dateOnCursor.week()
        }
        console.log(timesheetEntry);
        timesheet.push(timesheetEntry);
        dateOnCursor.add(1, 'day');
    }

}

let timesheetEntry: TimesheetEntry = {
    id: 1,
    day: "Monday",
    date: "29 Apr 2024",
    startTime: "06:00",
    finishTime: "18:00",
    totalHours: 12,
    locationType: "onshore",
    comment: "Technical Support"
};

let timesheetGroup: TimesheetEntry[] = [
    {
        id: 1,
        day: "Monday",
        date: "29 Apr 2024",
        startTime: "06:00",
        finishTime: "18:00",
        totalHours: 12,
        locationType: "onshore",
        comment: "Technical Support"
    },
    {
        id: 2,
        day: "Tuesday",
        date: "30 Apr 2024",
        startTime: "06:00",
        finishTime: "18:00",
        totalHours: 12,
        locationType: "onshore",
        comment: "Technical Support"
    },
    {
        id: 3,
        day: "Wednesday",
        date: "01 May 2024",
        startTime: "06:00",
        finishTime: "18:00",
        totalHours: 12,
        locationType: "onshore",
        comment: "Technical Support"
    },
    {
        id: 4,
        day: "Thursday",
        date: "02 May 2024",
        startTime: "06:00",
        finishTime: "18:00",
        totalHours: 12,
        locationType: "onshore",
        comment: "Technical Support"
    },
    {
        id: 5,
        day: "Friday",
        date: "03 May 2024",
        startTime: "06:00",
        finishTime: "18:00",
        totalHours: 12,
        locationType: "onshore",
        comment: "Technical Support"
    },
    {
        id: 6,
        day: "Saturday",
        date: "04 May 2024",
        startTime: "06:00",
        finishTime: "18:00",
        totalHours: 12,
        locationType: "onshore",
        comment: "Technical Support"
    },
    {
        id: 7,
        day: "Sunday",
        date: "05 May 2024",
        startTime: "06:00",
        finishTime: "18:00",
        totalHours: 12,
        locationType: "onshore",
        comment: "Technical Support"
    }
]