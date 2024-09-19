import moment from "moment";
import { InvalidTimesheetDateError } from "./timesheetErrors";
import { Timesheet, TimesheetDefaultInformation } from "./timesheet";

interface TimesheetDateInterface {
    dateInput: string,
}

export class TimesheetDate implements TimesheetDateInterface {
    dateInput: string;
    _isValidTimesheetDate: boolean;

    constructor(timesheetDateInput: TimesheetDate | TimesheetDateInterface) {
        this.dateInput = timesheetDateInput.dateInput;
        let momentTimesheetDate = moment(this.dateInput);
        this._isValidTimesheetDate = momentTimesheetDate.isValid();

        let defaultData: TimesheetDefaultInformation = Timesheet.defaultInformation()
        TimesheetDate.updateWeekStartDay(defaultData.weekStartDay);
    }

    get getFirstDayOfTheWeek(): TimesheetDate {
        if (this._isValidTimesheetDate) {
            const dateReference = moment(this.dateInput);
            let firstDayOfTheWeek = moment(dateReference.startOf('week').format());
            return new TimesheetDate({ dateInput: firstDayOfTheWeek.format() });
        }
        throw InvalidTimesheetDateError;
    }

    get getLastDayOfTheWeek(): TimesheetDate {
        const dateReference = moment(this.dateInput);
        let lastDayOfTheWeek = moment(dateReference.endOf('week').format());
        return new TimesheetDate({ dateInput: lastDayOfTheWeek.format() });
    }

    get dayLabel(): string {
        return moment(this.dateInput).format('dddd');
        // @returns "Sunday", "Monday" ...
    }

    get dateInDayMonthFormat(): string {
        return moment(this.dateInput).format('Do-MMM');
        // output sample - 1st-Jul
    }

    get dateInMonthYearFormat(): string {
        return moment(this.dateInput).format('MM-YYYY');
        // output sample - 08-2024
    }

    isDateSameOrBefore(secondDate: TimesheetDate): boolean {
        return moment(this.dateInput).isSameOrBefore(moment(secondDate.dateInput))
    }

    isDateBetween(startDate: TimesheetDate, finishDate: TimesheetDate): boolean {
        return moment(this.dateInput).isBetween(moment(startDate.dateInput), moment(finishDate.dateInput), 'day', '[]');
    }

    isDateSame(secondDate: TimesheetDate): boolean {
        return moment(this.dateInput).isSame(secondDate.dateInput);
    }

    defaultFormat(): string {
        return moment(this.dateInput).format();
        // Sample Outcome - 2017-03-06T00:00:00+01:00
    }

    simpleFormat(): string {
        return moment(this.dateInput).format('ddd, DD MMM YYYY');
        // Sample Outcome - Mon, 06 Mar 2017
    }

    longFormat(): string {
        return moment(this.dateInput).format('dddd, DD MMMM YYYY');
        // Sample Outcome - Monday, 06 March 2017
    }

    dateInputNaturalFormat(): string {
        return moment(this.dateInput).format('YYYY-MM-DD');
        // Sample Outcome - 2017-03-13
    }

    toJavascriptDate(): Date {
        return moment(this.dateInput).toDate();
    }

    get weekNumber(): number {
        return moment(this.dateInput).week();
    }

    dateIncrementByDay(numberOfDays: number): TimesheetDate {
        return new TimesheetDate({ dateInput: moment(this.dateInput).add(numberOfDays, 'day').format() });
    }

    incrementHoursForDate(hours: number): TimesheetDate {
        return new TimesheetDate({ dateInput: moment(this.dateInput).add(hours, 'hours').format() });
    }

    static setWeekStartDayAsMonday() {
        moment.updateLocale("en", {
            week: {
                dow: 1, // First day of week is Monday
                doy: 4  // First week of year must contain 4 January (7 + 1 - 4)
            }
        });
    }

    static setWeekStartDayAsSunday() {
        moment.updateLocale("en", {
            week: {
                dow: 0, // First day of week is Sunday
                doy: 4  // First week of year must contain 4 January (7 + 1 - 4)
            }
        });
    }

    static updateWeekStartDay(selectedWeekStartDay: string) {
        let weekStartDayNumber = TimesheetDate.convertWeekdayTextToWeekdayNumber(selectedWeekStartDay);
        if (weekStartDayNumber == 1) {
            TimesheetDate.setWeekStartDayAsMonday();
        } else {
            TimesheetDate.setWeekStartDayAsSunday();
        }
        // I don't think it is necessary to give room for other days to be the first day of the week. sorry to whoever will need this feature.
    }


    static simpleNowDateTimeFormat(): string {
        const presentDate = moment().format("MMMM DD YYYY HH:mm:ss");
        return presentDate;
    }

    static daysOfTheWeek: string[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

    static dayDifference(earlierDate: TimesheetDate, laterDate: TimesheetDate): number {
        let dayDiff = moment(laterDate.dateInput).diff(moment(earlierDate.dateInput), 'days');
        return dayDiff;
    }

    static convertWeekdayTextToWeekdayNumber(weekdayText: String): Number {
        switch (weekdayText.toLowerCase()) {
            case "sunday":
            case "sun":
                return 0;
            case "monday":
            case "mon":
                return 1;
            case "tuesday":
            case "tue":
            case "tues":
                return 2;
            case "wednesday":
            case "wed":
                return 3;
            case "thursday":
            case "thur":
            case "thurs":
                return 4;
            case "friday":
            case "fri":
                return 5;
            case "saturday":
            case "sat":
                return 6;
            default:
                return -1;
        }
    }

    static addTimezoneOffsetToJavascriptDate(javascriptDate: Date) {
        return new Date(javascriptDate.getTime() - (javascriptDate.getTimezoneOffset() * 60 * 1000));
    }

    static removeTimezoneOffsetFromJavascriptDate(javascriptDate: Date) {
        return new Date(javascriptDate.getTime() + (javascriptDate.getTimezoneOffset() * 60 * 1000));
    }
}