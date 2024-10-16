import { PrimitiveDefaultTimesheetEntry } from "../types/primitive";
import { PlainTimesheetEntryType } from "../types/timesheet";
import { LocationType } from "./constant";

export const defaultTimesheetEntryType: PlainTimesheetEntryType[] = [
    {
        id: 1,
        slug: "travel-mobilization",
        name: "Travel Mobilization"
    },
    {
        id: 2,
        slug: "travel-demobilization",
        name: "Travel Demobilization"
    },
    {
        id: 3,
        slug: "working-time",
        name: "Working Time"
    },
    {
        id: 4,
        slug: "waiting-time",
        name: "Waiting Time"
    },
    {
        id: 5,
        slug: "public-holiday-work",
        name: "Public Holiday Work"
    },
    {
        id: 6,
        slug: "travel-time-to-site",
        name: "Daily Travel Time To Site"
    }
];

export const defaultTimesheetEntryData: PrimitiveDefaultTimesheetEntry = {
    startTime: '06:00',
    finishTime: '18:00',
    locationType: LocationType.onshore,
    comment: 'Productive Work at the Office',
    weekStartDay: "monday",
    updatedAt: '',
    timesheetEntryType: defaultTimesheetEntryType.filter((entryType) => entryType.slug == "working-time")[0]
}

export const possibleWeekStartDays = [
    "monday",
    "sunday"
]