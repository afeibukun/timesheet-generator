import { TimesheetEntryPeriodInterface } from "@/lib/types/timesheetType";
import moment from "moment";
import { TimesheetHour } from "./timesheetHour";

export class TimesheetEntryPeriod implements TimesheetEntryPeriodInterface {
    startTime?: TimesheetHour;
    finishTime?: TimesheetHour;
    breakTimeStart?: TimesheetHour;
    breakTimeFinish?: TimesheetHour;

    constructor(_entryPeriodInput: TimesheetEntryPeriodInterface) {
        this.startTime = _entryPeriodInput.startTime ? new TimesheetHour(_entryPeriodInput.startTime) : undefined;
        this.finishTime = _entryPeriodInput.finishTime ? new TimesheetHour(_entryPeriodInput.finishTime) : undefined;
        this.breakTimeStart = _entryPeriodInput.breakTimeStart ? new TimesheetHour(_entryPeriodInput.breakTimeStart) : undefined;
        this.breakTimeFinish = _entryPeriodInput.breakTimeFinish ? new TimesheetHour(_entryPeriodInput.breakTimeFinish) : undefined;
    }

    get totalHours(): TimesheetHour {
        try {
            const actualTimeInMinutes = this.totalTimeInMinutes();
            return TimesheetHour.convertMinutesToTimesheetHour(actualTimeInMinutes);
        } catch (e) {
        }
        return new TimesheetHour('00:00');
    }

    get totalHoursInString(): string {
        try {
            const totalTimesheetEntryHour: TimesheetHour = this.totalHours;
            const totalTimesheetEntryHourString: string = totalTimesheetEntryHour.time ? totalTimesheetEntryHour.time : '00:00';
            return totalTimesheetEntryHourString
        } catch (e) {
        }
        return '00:00';
    }

    get totalWholeHours(): number {
        const actualTimeInMinutes = this.totalTimeInMinutes();
        return Math.ceil(actualTimeInMinutes / 60);
    }

    get isValid(): boolean {
        try {
            if (this.totalTimeInMinutes() > 0) return true
        } catch (e) { }
        return false
    }

    private totalTimeInMinutes(): number {
        try {
            if (!this.finishTime || !this.startTime) throw new Error; // Time not defined
            if (!this.startTime.isEarlierThan(this.finishTime)) throw new Error; // time order is wrong

            let totalTimeInMinutes = moment(this.finishTime.time, 'HH:mm').diff(moment(this.startTime.time, 'HH:mm'), 'minutes') ?? 0;

            let totalBreakTimeInMinutes = 0;
            if (this.breakTimeFinish && this.breakTimeStart) {
                if (this.breakTimeStart.isEarlierThan(this.startTime)) throw new Error; // Break Time cannot start before Main Start Time

                if (!this.breakTimeStart.isEarlierThan(this.breakTimeFinish) || this.breakTimeStart.isEqualTo(this.breakTimeFinish)) throw new Error; // Invalid Break Time

                totalBreakTimeInMinutes = moment(this.breakTimeFinish.time, 'HH:mm').diff(moment(this.breakTimeStart.time, 'HH:mm'), 'minutes') ?? 0;
                totalBreakTimeInMinutes = !!totalBreakTimeInMinutes ? totalBreakTimeInMinutes : 0
            }

            let actualTimeInMinutes = totalTimeInMinutes - totalBreakTimeInMinutes;
            return actualTimeInMinutes;

        } catch (e) {
        }
        return 0;
    }

}
