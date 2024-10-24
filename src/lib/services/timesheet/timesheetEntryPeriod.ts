import { PlainTimesheetEntryPeriod } from "@/lib/types/timesheet";
import moment from "moment";
import { TimesheetHour } from "./timesheetHour";
import { ErrorMessage } from "@/lib/constants/constant";
import { Timesheet } from "./timesheet";

export class TimesheetEntryPeriod implements PlainTimesheetEntryPeriod {
    startTime?: TimesheetHour;
    finishTime?: TimesheetHour;
    breakTimeStart?: TimesheetHour;
    breakTimeFinish?: TimesheetHour;

    constructor(_entryPeriodInput: PlainTimesheetEntryPeriod) {
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
            if (!this.finishTime || !this.startTime) throw new Error(ErrorMessage.timeNotDefined); // Time not defined
            if (this.finishTime._isValidTime && this.startTime._isValidTime) {
                if (!this.startTime.isEarlierThan(this.finishTime)) throw new Error(ErrorMessage.wrongTimeOrder); // time order is wrong

                let totalTimeInMinutes = moment(this.finishTime.time, 'HH:mm').diff(moment(this.startTime.time, 'HH:mm'), 'minutes') ?? 0;

                let totalBreakTimeInMinutes = 0;
                if (this.breakTimeFinish && this.breakTimeStart) {
                    if (this.breakTimeStart.isEarlierThan(this.startTime)) throw new Error(ErrorMessage.wrongBreakStartAndStartTimeOrder); // Break Time cannot start before Main Start Time

                    if (!this.breakTimeStart.isEarlierThan(this.breakTimeFinish) || this.breakTimeStart.isEqualTo(this.breakTimeFinish)) throw new Error(ErrorMessage.wrongBreakTimeOrder); // Invalid Break Time

                    totalBreakTimeInMinutes = moment(this.breakTimeFinish.time, 'HH:mm').diff(moment(this.breakTimeStart.time, 'HH:mm'), 'minutes') ?? 0;
                    totalBreakTimeInMinutes = !!totalBreakTimeInMinutes ? totalBreakTimeInMinutes : 0
                }
                let actualTimeInMinutes = totalTimeInMinutes - totalBreakTimeInMinutes;
                return actualTimeInMinutes;
            }
        } catch (e) {
        }
        return 0;
    }

    static isTimeOrderWrong = (entryPeriod: TimesheetEntryPeriod) => {
        // only applies to entry period not break period
        return (entryPeriod.startTime && entryPeriod.startTime._isValidTime && entryPeriod.finishTime && entryPeriod.finishTime._isValidTime && (entryPeriod.finishTime.isEarlierThan(entryPeriod.startTime) || entryPeriod.finishTime.isEqualTo(entryPeriod.startTime)))
    }

    static errorOnStartTime = (entryPeriod: TimesheetEntryPeriod) => {
        if (!entryPeriod.startTime || !entryPeriod.startTime._isValidTime) return { error: true, message: "Start Time Not Found" }
        if (TimesheetEntryPeriod.isTimeOrderWrong(entryPeriod)) return { error: true, message: "Wrong Time Order" } // time order is wrong
        return { error: false, message: "" }
    }

    static errorOnFinishTime = (entryPeriod: TimesheetEntryPeriod) => {
        if (!entryPeriod.finishTime || !entryPeriod.finishTime._isValidTime) return { error: true, message: "Finish Time Not Found" }
        if (TimesheetEntryPeriod.isTimeOrderWrong(entryPeriod)) return { error: true, message: "Wrong Time Order" } // time order is wrong
        return { error: false, message: "" }
    }

    static errorOnBreakStartTime = (entryPeriod: TimesheetEntryPeriod) => {
        if (entryPeriod.breakTimeStart && entryPeriod.breakTimeStart._isValidTime && entryPeriod.startTime && entryPeriod.startTime._isValidTime && entryPeriod.breakTimeStart.isEarlierThan(entryPeriod.startTime)) {
            return { error: true, message: "Wrong order on Break Start Time and Entry Start Time" }; // Break Time cannot start before Main Start Time
        }

        if (entryPeriod.breakTimeStart && entryPeriod.breakTimeStart._isValidTime && entryPeriod.finishTime && entryPeriod.finishTime._isValidTime && entryPeriod.finishTime.isEarlierThan(entryPeriod.breakTimeStart)) {
            return { error: true, message: "Wrong order with Break Start Time and Entry Finish Time" }; // Break Time cannot start after Main Finish Time
        }

        if (entryPeriod.breakTimeStart && entryPeriod.breakTimeStart._isValidTime && entryPeriod.breakTimeFinish && entryPeriod.breakTimeFinish._isValidTime && (entryPeriod.breakTimeFinish.isEarlierThan(entryPeriod.breakTimeStart) || entryPeriod.breakTimeFinish.isEqualTo(entryPeriod.breakTimeStart))) {
            return { error: true, message: "Invalid Break Time" }; // Invalid Break Time
        }

        return { error: false, message: "" };
    }

    static errorOnBreakFinishTime = (entryPeriod: TimesheetEntryPeriod) => {
        if (entryPeriod.breakTimeFinish && entryPeriod.breakTimeFinish._isValidTime && entryPeriod.finishTime && entryPeriod.finishTime._isValidTime && entryPeriod.finishTime.isEarlierThan(entryPeriod.breakTimeFinish)) {
            return { error: true, message: "Wrong order on Break Finish Time and Entry Finish Time" }; // Break Time cannot end after Main Finish Time
        }

        if (entryPeriod.breakTimeFinish && entryPeriod.breakTimeFinish._isValidTime && entryPeriod.startTime && entryPeriod.startTime._isValidTime && entryPeriod.breakTimeFinish.isEarlierThan(entryPeriod.startTime)) {
            return { error: true, message: "Wrong order with Break Finish Time and Entry Start Time" }; // Break Time cannot finish before Main Start Time
        }

        if (entryPeriod.breakTimeStart && entryPeriod.breakTimeStart._isValidTime && entryPeriod.breakTimeFinish && entryPeriod.breakTimeFinish._isValidTime && (entryPeriod.breakTimeFinish.isEarlierThan(entryPeriod.breakTimeStart) || entryPeriod.breakTimeFinish.isEqualTo(entryPeriod.breakTimeStart))) {
            return { error: true, message: "Invalid Break Time" }; // Invalid Break Time
        }

        return { error: false, message: "" };
    }

    static doesPeriodOverlap(period1: TimesheetEntryPeriod, period2: TimesheetEntryPeriod) {
        // const isTheTimeDefined = !!period1.startTime && !!period1.finishTime && !!period2.startTime && !!period2.finishTime

        if ((!!period1.startTime && !!period1.finishTime && !!period2.startTime && !!period2.finishTime) && (period1.startTime._isValidTime && period1.finishTime._isValidTime && period2.startTime._isValidTime && period2.finishTime._isValidTime)) {
            if (period2.startTime.isInBetweenTimeRange(period1.startTime, period1.finishTime) || period2.finishTime.isInBetweenTimeRange(period1.startTime, period1.finishTime) || (period2.startTime.isEqualTo(period1.startTime) && period2.finishTime.isEqualTo(period1.finishTime))) {
                // && (period1.finishTime.isEarlierThan(period2.startTime) && period1.finishTime?.isEarlierThan(period2.finishTime))) || ((period2.startTime.isEarlierThan(period2.finishTime) && period2.startTime.isEarlierThan(period1.startTime) && period2.startTime?.isEarlierThan(period1.finishTime) && (period2.finishTime.isEarlierThan(period1.startTime) && period2.finishTime.isEarlierThan(period1.finishTime))))))
                return true
            }
        }
        return false
    }

    static convertPrimitiveToEntryPeriod(entryPeriodStartTime: string, entryPeriodFinishTime: string, breakPeriodStartTime: string, breakPeriodFinishTime: string) {
        let _breakTimeStart = !!breakPeriodStartTime ? new TimesheetHour(breakPeriodStartTime) : undefined;
        let _breakTimeFinish = !!breakPeriodFinishTime ? new TimesheetHour(breakPeriodFinishTime) : undefined;
        if (!_breakTimeStart || !_breakTimeFinish) {
            _breakTimeStart = undefined
            _breakTimeFinish = undefined
        }
        const _startTime = !!entryPeriodStartTime ? new TimesheetHour(entryPeriodStartTime) : undefined;
        const _finishTime = !!entryPeriodFinishTime ? new TimesheetHour(entryPeriodFinishTime) : undefined;

        const _entryPeriod: TimesheetEntryPeriod = new TimesheetEntryPeriod({ startTime: _startTime, finishTime: _finishTime, breakTimeStart: _breakTimeStart, breakTimeFinish: _breakTimeFinish })
        return _entryPeriod
    }

}
