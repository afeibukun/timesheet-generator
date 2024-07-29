interface TimesheetEntryPeriodInterface {
    startTime: string,
    finishTime: string,
}

export class TimesheetEntryPeriod implements TimesheetEntryPeriodInterface {
    startTime: string;
    finishTime: string;

    constructor(startTime: string, finishTime: string) {
        this.startTime = startTime;
        this.finishTime = finishTime;
    }

}
