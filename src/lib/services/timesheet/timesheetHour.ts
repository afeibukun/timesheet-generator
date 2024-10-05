import { TimesheetHourInterface } from "@/lib/types/timesheetType";
import moment from "moment";

export class TimesheetHour implements TimesheetHourInterface {
    hour: number; //0 - 23
    minute: number; //0 - 59
    time: string; // '08:00'

    constructor(_timeInput: TimesheetHourInterface | String | string) {
        if (typeof _timeInput == 'string' || _timeInput instanceof String) {
            const arr = _timeInput.split(':');
            this.hour = Number.parseInt(arr[0]);
            this.minute = Number.parseInt(arr[1]);
        } else {
            if (_timeInput.hour) {
                this.hour = _timeInput.hour;
                this.minute = _timeInput.minute ? _timeInput.minute : 0;
            } else throw new Error // invalid time input
        }
        const paddedHour = String(this.hour).padStart(2, '0');
        const paddedMinute = String(this.minute).padStart(2, '0');
        this.time = `${paddedHour}:${paddedMinute}`;
    }

    isEarlierThan(secondTime: TimesheetHour) {
        const thisTimesheetTimeInMinutes = TimesheetHour.convertTimesheetHourToMinutes(this);
        const secondTimesheetTimeInMinutes = TimesheetHour.convertTimesheetHourToMinutes(secondTime);
        if (thisTimesheetTimeInMinutes < secondTimesheetTimeInMinutes) return true
        return false
    }

    isEqualTo(secondTime: TimesheetHour) {
        if (this.time === secondTime.time) return true
        return false
    }

    static sumTimesheetHours(timeA: TimesheetHour, timeB: TimesheetHour) {
        const totalMinutesA = TimesheetHour.convertTimesheetHourToMinutes(timeA);
        const totalMinutesB = TimesheetHour.convertTimesheetHourToMinutes(timeB);
        const totalMinutes = totalMinutesA + totalMinutesB;
        return TimesheetHour.convertMinutesToTimesheetHour(totalMinutes);
    }
    static convertTimesheetHourToMinutes(_time: TimesheetHour): number {
        const totalMinutes = (_time.hour * 60) + _time.minute;
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
