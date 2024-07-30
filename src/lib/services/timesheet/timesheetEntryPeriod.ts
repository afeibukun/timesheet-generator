import moment from "moment";

interface TimesheetEntryPeriodInterface {
    startTime: string | null,
    finishTime: string | null,
}

export class TimesheetEntryPeriod implements TimesheetEntryPeriodInterface {
    startTime: string | null;
    finishTime: string | null;

    constructor(_entryPeriodInput: TimesheetEntryPeriodInterface | TimesheetEntryPeriod) {
        this.startTime = _entryPeriodInput.startTime;
        this.finishTime = _entryPeriodInput.finishTime;
    }

    get totalHours(): number {
        try {
            let totalTimeInMinutes = moment(this.finishTime, 'HH:mm').diff(moment(this.startTime, 'HH:mm'), 'minutes');
            let totalHours = Math.ceil(totalTimeInMinutes / 60); // any extra minute spent is counted as a full hour.
            // let minutesRemaining = totalTimeInMinutes - (totalWholeHours * 60);   
            if (!Number.isNaN(totalHours)) return totalHours;
        } catch (e) {
        }
        return 0;
    }

    get isValid(): boolean {
        try {
            if (this.totalHours > 0) return true
        } catch (e) { }
        return false
    }

}
