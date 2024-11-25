import { PlainTimesheetEntryPeriod } from "@/lib/types/timesheet";
import moment from "moment";
import { ErrorMessage } from "@/lib/constants/constant";
import { Time } from "@/lib/types/generalType";
import { TimesheetTime } from "./timesheetTime";

export class TimesheetEntryPeriod implements PlainTimesheetEntryPeriod {
    startTime?: Time;
    finishTime?: Time;
    breakTimeStart?: Time;
    breakTimeFinish?: Time;

    constructor(_entryPeriodInput: PlainTimesheetEntryPeriod) {
        this.startTime = _entryPeriodInput.startTime ? _entryPeriodInput.startTime : undefined;
        this.finishTime = _entryPeriodInput.finishTime ? _entryPeriodInput.finishTime : undefined;
        this.breakTimeStart = _entryPeriodInput.breakTimeStart ? _entryPeriodInput.breakTimeStart : undefined;
        this.breakTimeFinish = _entryPeriodInput.breakTimeFinish ? _entryPeriodInput.breakTimeFinish : undefined;
    }

    get totalHours(): Time {
        try {
            const actualTimeInMinutes = this.totalTimeInMinutes();
            return TimesheetTime.expandMinutesToTime(actualTimeInMinutes);
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
            if (TimesheetTime.isValid(this.finishTime) && TimesheetTime.isValid(this.startTime)) {
                if (!TimesheetTime.isEarlierThan(this.startTime, this.finishTime)) throw new Error(ErrorMessage.wrongTimeOrder); // time order is wrong

                let totalTimeInMinutes = moment(this.finishTime, 'HH:mm').diff(moment(this.startTime, 'HH:mm'), 'minutes') ?? 0;

                let totalBreakTimeInMinutes = 0;
                if (this.breakTimeFinish && this.breakTimeStart) {
                    if (TimesheetTime.isEarlierThan(this.breakTimeStart, this.startTime)) throw new Error(ErrorMessage.wrongBreakStartAndStartTimeOrder); // Break Time cannot start before Main Start Time

                    if (!TimesheetTime.isEarlierThan(this.breakTimeStart, this.breakTimeFinish) || TimesheetTime.areEqual(this.breakTimeStart, this.breakTimeFinish)) throw new Error(ErrorMessage.wrongBreakTimeOrder); // Invalid Break Time

                    totalBreakTimeInMinutes = moment(this.breakTimeFinish, 'HH:mm').diff(moment(this.breakTimeStart, 'HH:mm'), 'minutes') ?? 0;
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
        return (entryPeriod.startTime && TimesheetTime.isValid(entryPeriod.startTime) && entryPeriod.finishTime && TimesheetTime.isValid(entryPeriod.finishTime) && (TimesheetTime.isEarlierThan(entryPeriod.finishTime, entryPeriod.startTime) || TimesheetTime.areEqual(entryPeriod.finishTime, entryPeriod.startTime)))
    }

    static errorOnStartTime = (entryPeriod: TimesheetEntryPeriod) => {
        if (!entryPeriod.startTime || !TimesheetTime.isValid(entryPeriod.startTime)) return { error: true, message: "Start Time Not Found" }
        if (TimesheetEntryPeriod.isTimeOrderWrong(entryPeriod)) return { error: true, message: "Wrong Time Order" } // time order is wrong
        return { error: false, message: "" }
    }

    static errorOnFinishTime = (entryPeriod: TimesheetEntryPeriod) => {
        if (!entryPeriod.finishTime || !TimesheetTime.isValid(entryPeriod.finishTime)) return { error: true, message: "Finish Time Not Found" }
        if (TimesheetEntryPeriod.isTimeOrderWrong(entryPeriod)) return { error: true, message: "Wrong Time Order" } // time order is wrong
        return { error: false, message: "" }
    }

    static errorOnBreakStartTime = (entryPeriod: TimesheetEntryPeriod) => {
        if (entryPeriod.breakTimeStart && TimesheetTime.isValid(entryPeriod.breakTimeStart) && entryPeriod.startTime && TimesheetTime.isValid(entryPeriod.startTime) && TimesheetTime.isEarlierThan(entryPeriod.breakTimeStart, entryPeriod.startTime)) {
            return { error: true, message: "Wrong order on Break Start Time and Entry Start Time" }; // Break Time cannot start before Main Start Time
        }

        if (entryPeriod.breakTimeStart && TimesheetTime.isValid(entryPeriod.breakTimeStart) && entryPeriod.finishTime && TimesheetTime.isValid(entryPeriod.finishTime) && TimesheetTime.isEarlierThan(entryPeriod.finishTime, entryPeriod.breakTimeStart)) {
            return { error: true, message: "Wrong order with Break Start Time and Entry Finish Time" }; // Break Time cannot start after Main Finish Time
        }

        if (entryPeriod.breakTimeStart && TimesheetTime.isValid(entryPeriod.breakTimeStart) && entryPeriod.breakTimeFinish && TimesheetTime.isValid(entryPeriod.breakTimeFinish) && (TimesheetTime.isEarlierThan(entryPeriod.breakTimeFinish, entryPeriod.breakTimeStart) || TimesheetTime.areEqual(entryPeriod.breakTimeFinish, entryPeriod.breakTimeStart))) {
            return { error: true, message: "Invalid Break Time" }; // Invalid Break Time
        }

        return { error: false, message: "" };
    }

    static errorOnBreakFinishTime = (entryPeriod: TimesheetEntryPeriod) => {
        if (entryPeriod.breakTimeFinish && TimesheetTime.isValid(entryPeriod.breakTimeFinish) && entryPeriod.finishTime && TimesheetTime.isValid(entryPeriod.finishTime) && TimesheetTime.isEarlierThan(entryPeriod.finishTime, entryPeriod.breakTimeFinish)) {
            return { error: true, message: "Wrong order on Break Finish Time and Entry Finish Time" }; // Break Time cannot end after Main Finish Time
        }

        if (entryPeriod.breakTimeFinish && TimesheetTime.isValid(entryPeriod.breakTimeFinish) && entryPeriod.startTime && TimesheetTime.isValid(entryPeriod.startTime) && TimesheetTime.isEarlierThan(entryPeriod.breakTimeFinish, entryPeriod.startTime)) {
            return { error: true, message: "Wrong order with Break Finish Time and Entry Start Time" }; // Break Time cannot finish before Main Start Time
        }

        if (entryPeriod.breakTimeStart && TimesheetTime.isValid(entryPeriod.breakTimeStart) && entryPeriod.breakTimeFinish && TimesheetTime.isValid(entryPeriod.breakTimeFinish) && (TimesheetTime.isEarlierThan(entryPeriod.breakTimeFinish, entryPeriod.breakTimeStart) || TimesheetTime.areEqual(entryPeriod.breakTimeFinish, entryPeriod.breakTimeStart))) {
            return { error: true, message: "Invalid Break Time" }; // Invalid Break Time
        }

        return { error: false, message: "" };
    }

    static doesPeriodOverlap(period1: TimesheetEntryPeriod, period2: TimesheetEntryPeriod) {
        // const isTheTimeDefined = !!period1.startTime && !!period1.finishTime && !!period2.startTime && !!period2.finishTime

        if ((!!period1.startTime && !!period1.finishTime && !!period2.startTime && !!period2.finishTime) && (TimesheetTime.isValid(period1.startTime) && TimesheetTime.isValid(period1.finishTime) && TimesheetTime.isValid(period2.startTime) && TimesheetTime.isValid(period2.finishTime))) {
            if (TimesheetTime.isTimeInBetweenTimeRange(period2.startTime, period1.startTime, period1.finishTime) || TimesheetTime.isTimeInBetweenTimeRange(period2.finishTime, period1.startTime, period1.finishTime) || (TimesheetTime.areEqual(period2.startTime, period1.startTime) && TimesheetTime.areEqual(period2.finishTime, period1.finishTime))) {
                // && (period1.finishTime.isEarlierThan(period2.startTime) && period1.finishTime?.isEarlierThan(period2.finishTime))) || ((period2.startTime.isEarlierThan(period2.finishTime) && period2.startTime.isEarlierThan(period1.startTime) && period2.startTime?.isEarlierThan(period1.finishTime) && (period2.finishTime.isEarlierThan(period1.startTime) && period2.finishTime.isEarlierThan(period1.finishTime))))))
                return true
            }
        }
        return false
    }

    static convertPrimitiveToEntryPeriod(entryPeriodStartTime: string, entryPeriodFinishTime: string, breakPeriodStartTime: string, breakPeriodFinishTime: string) {
        let _breakTimeStart = !!breakPeriodStartTime ? breakPeriodStartTime as Time : undefined;
        let _breakTimeFinish = !!breakPeriodFinishTime ? breakPeriodFinishTime as Time : undefined;
        if (!_breakTimeStart || !_breakTimeFinish) {
            _breakTimeStart = undefined
            _breakTimeFinish = undefined
        }
        const _startTime = !!entryPeriodStartTime ? entryPeriodStartTime as Time : undefined;
        const _finishTime = !!entryPeriodFinishTime ? entryPeriodFinishTime as Time : undefined;

        const _entryPeriod: TimesheetEntryPeriod = new TimesheetEntryPeriod({ startTime: _startTime, finishTime: _finishTime, breakTimeStart: _breakTimeStart, breakTimeFinish: _breakTimeFinish })
        return _entryPeriod
    }

}
