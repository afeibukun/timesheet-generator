import { ErrorMessageEnum } from "@/lib/constants/enum";
import { TimesheetHourInterface } from "@/lib/types/timesheetType";
import moment from "moment";

export class TimesheetHour implements TimesheetHourInterface {
    hour: number; //0 - 23
    minute: number; //0 - 59
    time: string; // '08:00'
    _isValidTime?: boolean;

    constructor(_timeInput: TimesheetHourInterface | String | string) {
        if (typeof _timeInput == 'string' || _timeInput instanceof String) {
            const arr = _timeInput.split(':');
            this.hour = Number.parseInt(arr[0]);
            this.minute = Number.parseInt(arr[1]);
            this._isValidTime = true
        } else {
            if (_timeInput.hour !== undefined && !Number.isNaN(_timeInput.hour)) {
                this.hour = _timeInput.hour;
                this.minute = _timeInput.minute ? _timeInput.minute : 0;
                this._isValidTime = true
            } else {
                this.hour = 0
                this.minute = 0
                this._isValidTime = false
                // throw new Error(ErrorMessageEnum.timeInputNotFound) // invalid time input
            }
        }
        const paddedHour = String(this.hour).padStart(2, '0');
        const paddedMinute = String(this.minute).padStart(2, '0');
        this.time = `${paddedHour}:${paddedMinute}`;
    }

    isEarlierThan(secondTime: TimesheetHour) {
        if (!this._isValidTime || !secondTime._isValidTime) throw new Error(ErrorMessageEnum.timeInvalid);
        const thisTimesheetTimeInMinutes = TimesheetHour.convertTimesheetHourToMinutes(this);
        const secondTimesheetTimeInMinutes = TimesheetHour.convertTimesheetHourToMinutes(secondTime);
        if (thisTimesheetTimeInMinutes < secondTimesheetTimeInMinutes) return true
        return false
    }

    isEqualTo(secondTime: TimesheetHour) {
        if (!this._isValidTime || !secondTime._isValidTime) throw new Error(ErrorMessageEnum.timeInvalid);
        if (this.time === secondTime.time) return true
        return false
    }

    isInBetweenTimeRange(timeRangeStart: TimesheetHour, timeRangeFinish: TimesheetHour) {
        if (!this._isValidTime || !timeRangeStart._isValidTime || !timeRangeFinish._isValidTime) throw new Error(ErrorMessageEnum.timeInvalid)
        if (timeRangeStart.isEarlierThan(this) && this.isEarlierThan(timeRangeFinish)) {
            //  && period1.startTime?.isEarlierThan(period2.finishTime) && (period1.finishTime.isEarlierThan(period2.startTime) && period1.finishTime?.isEarlierThan(period2.finishTime))) || ((period2.startTime.isEarlierThan(period2.finishTime) && period2.startTime.isEarlierThan(period1.startTime) && period2.startTime?.isEarlierThan(period1.finishTime) && (period2.finishTime.isEarlierThan(period1.startTime) && period2.finishTime.isEarlierThan(period1.finishTime))) ))
            return true
        }
        return false
    }

    static sumTimesheetHours(timeA: TimesheetHour, timeB: TimesheetHour) {
        if (!timeA._isValidTime || !timeB._isValidTime) throw new Error(ErrorMessageEnum.timeInvalid)
        const totalMinutesA = TimesheetHour.convertTimesheetHourToMinutes(timeA);
        const totalMinutesB = TimesheetHour.convertTimesheetHourToMinutes(timeB);
        const totalMinutes = totalMinutesA + totalMinutesB;
        return TimesheetHour.convertMinutesToTimesheetHour(totalMinutes);
    }

    static convertTimesheetHourToMinutes(_time: TimesheetHour): number {
        let totalMinutes = 0;
        if (_time._isValidTime) totalMinutes = (_time.hour * 60) + _time.minute;
        return totalMinutes;
    }

    static convertMinutesToTimesheetHour(minutes: number): TimesheetHour {
        const totalExactHours = Math.floor(minutes / 60);
        const totalRemainingTimeInMinutes = minutes % 60;
        return new TimesheetHour({ hour: totalExactHours, minute: totalRemainingTimeInMinutes });
    }

    static createTimeArray(step?: number): string[] {
        let timeArray = [];
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60;) {
                timeArray.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
                if (step) m += step
                else m++
            }

        }
        return timeArray;
    }
}
