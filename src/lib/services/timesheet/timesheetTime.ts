import { ErrorMessage } from "@/lib/constants/constant";
import { Time } from "@/lib/types/generalType";

export class TimesheetTime {
    static getHour(time: Time): number {
        const _timeSplit = time.split(':');
        const _hour = Number.parseInt(_timeSplit[0]);
        return _hour
    }

    static getMinute(time: Time): number {
        const _timeSplit = time.split(':');
        const _minute = Number.parseInt(_timeSplit[1]);
        return _minute
    }

    static isValid(time: Time): boolean {
        try {
            const _timeSplit = time.split(':');
            if (_timeSplit.length != 2) return false
            const _hour = this.getHour(time);
            const _minute = this.getMinute(time);
            if ((_hour >= 0 && _hour <= 23) && (_minute >= 0 && _minute <= 59)) return true
            else return false
        } catch (error) { }
        return false
    }

    static isEarlierThan(earlierTime: Time, laterTime: Time) {
        if (!this.isValid(earlierTime) || !this.isValid(laterTime)) throw new Error(ErrorMessage.timeInvalid);
        const earlierTimeInMinutes = this.reduceTimeToMinutes(earlierTime);
        const laterTimeInMinutes = this.reduceTimeToMinutes(laterTime);
        if (earlierTimeInMinutes < laterTimeInMinutes) return true
        return false
    }

    static reduceTimeToMinutes(time: Time): number {
        let totalMinutes = 0;
        if (this.isValid(time)) totalMinutes = (this.getHour(time) * 60) + this.getMinute(time);
        return totalMinutes;
    }

    static expandMinutesToTime(minutes: number): Time {
        const totalExactHours = Math.floor(minutes / 60);
        const totalRemainingTimeInMinutes = minutes % 60;
        return `${totalExactHours}:${totalRemainingTimeInMinutes}`;
    }

    static areEqual(firstTime: Time, secondTime: Time) {
        if (!this.isValid(firstTime) || !this.isValid(secondTime)) throw new Error(ErrorMessage.timeInvalid);
        if (firstTime === secondTime) return true
        return false
    }

    static isTimeInBetweenTimeRange(referenceTime: Time, timeRangeStart: Time, timeRangeFinish: Time) {
        if (!this.isValid(referenceTime) || !this.isValid(timeRangeStart) || !this.isValid(timeRangeFinish)) throw new Error(ErrorMessage.timeInvalid)
        if (this.isEarlierThan(timeRangeStart, referenceTime) && this.isEarlierThan(referenceTime, timeRangeFinish)) {
            return true
        }
        return false
    }

    static sumTime(firstTime: Time, secondTime: Time) {
        if (!this.isValid(firstTime) || !this.isValid(secondTime)) throw new Error(ErrorMessage.timeInvalid)
        const firstTimeInMinutes = this.reduceTimeToMinutes(firstTime);
        const secondTimeInMinutes = this.reduceTimeToMinutes(secondTime);
        const totalMinutes = firstTimeInMinutes + secondTimeInMinutes;
        return this.expandMinutesToTime(totalMinutes);
    }

    static subtractTime(firstTime: Time, secondTime: Time) {
        if (!this.isValid(firstTime) || !this.isValid(secondTime)) throw new Error(ErrorMessage.timeInvalid);
        if (this.isEarlierThan(firstTime, secondTime)) throw new Error(ErrorMessage.timeInvalid);
        if (this.areEqual(firstTime, secondTime)) return "00:00";
        const firstTimeInMinutes = TimesheetTime.reduceTimeToMinutes(firstTime);
        const secondTimeInMinutes = TimesheetTime.reduceTimeToMinutes(secondTime);
        const timeDifference = firstTimeInMinutes - secondTimeInMinutes;
        return this.expandMinutesToTime(timeDifference);
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