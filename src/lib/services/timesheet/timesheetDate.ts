import moment from "moment";
import { InvalidTimesheetDateError } from "./timesheetErrors";
import { Timesheet } from "./timesheet";
import { DefaultPrimitiveTimesheetEntryDataInterface, TimesheetDateInterface } from "@/lib/types/timesheetType";
import { TimesheetEntry } from "./timesheetEntry";
import { ErrorMessageEnum } from "@/lib/constants/enum";

export class TimesheetDate implements TimesheetDateInterface {
    date: string;
    _isValidTimesheetDate?: boolean;

    constructor(dateObject: TimesheetDateInterface | String | string) {
        if (typeof dateObject == 'string' || dateObject instanceof String) {
            this.date = dateObject as string;
        } else {
            this.date = dateObject.date;
        }
        let momentTimesheetDate = moment(this.date);
        this._isValidTimesheetDate = momentTimesheetDate.isValid();
        this.initializeWeekStartDay()

    }

    private initializeWeekStartDay = async () => {
        const defaultData: DefaultPrimitiveTimesheetEntryDataInterface = await TimesheetEntry.defaultInformation();
        TimesheetDate.updateWeekStartDay(defaultData.weekStartDay);
    }

    get getFirstDayOfTheWeek(): TimesheetDate {
        if (this._isValidTimesheetDate) {
            const dateReference = moment(this.date);
            let firstDayOfTheWeek = moment(dateReference.startOf('week').format());
            return new TimesheetDate({ date: firstDayOfTheWeek.format() });
        }
        throw InvalidTimesheetDateError;
    }

    get getLastDayOfTheWeek(): TimesheetDate {
        const dateReference = moment(this.date);
        let lastDayOfTheWeek = moment(dateReference.endOf('week').format());
        return new TimesheetDate({ date: lastDayOfTheWeek.format() });
    }

    get dayLabel(): string {
        return moment(this.date).format('dddd');
        // @returns "Sunday", "Monday" ...
    }

    get dateInDayMonthFormat(): string {
        return moment(this.date).format('Do-MMM');
        // output sample - 1st-Jul
    }

    get dateInMonthYearFormat(): string {
        return moment(this.date).format('MM-YYYY');
        // output sample - 08-2024
    }

    get weekNumber(): number {
        return moment(this.date).week();
    }

    get monthNumber(): number {
        return moment(this.date).month();
    }

    get month(): string {
        return moment(this.date).format("MMMM").toLowerCase();
    }

    isDateSameOrBefore(secondDate: TimesheetDate): boolean {
        return moment(this.date).isSameOrBefore(moment(secondDate.date))
    }

    isDateAfter(secondDate: TimesheetDate): boolean {
        return moment(this.date).isAfter(moment(secondDate.date))
    }

    isDateBefore(secondDate: TimesheetDate): boolean {
        return moment(this.date).isBefore(moment(secondDate.date))
    }

    isDateBetween(startDate: TimesheetDate, finishDate: TimesheetDate): boolean {
        return moment(this.date).isBetween(moment(startDate.date), moment(finishDate.date), 'day', '[]');
    }

    isDateSame(secondDate: TimesheetDate): boolean {
        return moment(this.date).isSame(secondDate.date);
    }

    defaultFormat(): string {
        return moment(this.date).format();
        // Sample Outcome - 2017-03-06T00:00:00+01:00
    }

    basicFormat(): string {
        return moment(this.date).format('yyyy-MM-DD');
        // Sample Outcome - 
    }

    simpleFormat(includeTime?: boolean): string {
        if (includeTime) {
            return moment(this.date).format('ddd, DD MMM YYYY HH:mm:ss');
            // Sample Outcome - Mon, 06 Mar 2017 23:45:09   
        }
        return moment(this.date).format('ddd, DD MMM YYYY');
        // Sample Outcome - Mon, 06 Mar 2017
    }

    longFormat(): string {
        return moment(this.date).format('dddd, DD MMMM YYYY');
        // Sample Outcome - Monday, 06 March 2017
    }

    dateInputNaturalFormat(): string {
        return moment(this.date).format('YYYY-MM-DD');
        // Sample Outcome - 2017-03-13
    }

    toJavascriptDate(): Date {
        return moment(this.date).toDate();
    }

    dateDecrementByDay(numberOfDays: number): TimesheetDate {
        return new TimesheetDate({ date: moment(this.date).subtract(numberOfDays, 'day').format() });
    }

    dateIncrementByDay(numberOfDays: number): TimesheetDate {
        return new TimesheetDate({ date: moment(this.date).add(numberOfDays, 'day').format() });
    }

    incrementHoursForDate(hours: number): TimesheetDate {
        return new TimesheetDate({ date: moment(this.date).add(hours, 'hours').format() });
    }

    isEqual(date: TimesheetDate): Boolean {
        return this.date === date.date
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

    static basicNowDateFormatted(): string {
        const presentDate = moment().format("yyyy-MM-DD");
        return presentDate;
    }


    static simpleNowDateTimeFormat(): string {
        const presentDate = moment().format("MMMM DD YYYY HH:mm:ss");
        return presentDate;
    }

    static daysOfTheWeek: string[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

    static dayDifference(earlierDate: TimesheetDate, laterDate: TimesheetDate): number {
        let dayDiff = moment(laterDate.date).diff(moment(earlierDate.date), 'days');
        return dayDiff;
    }

    static convertWeekdayTextToWeekdayNumber(weekdayText: string): number {
        switch (weekdayText?.toLowerCase()) {
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

    static monthsInYear: string[] = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    static monthsInYearShort: string[] = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

    static addTimezoneOffsetToJavascriptDate(javascriptDate: Date) {
        return new Date(javascriptDate.getTime() - (javascriptDate.getTimezoneOffset() * 60 * 1000));
    }

    static removeTimezoneOffsetFromJavascriptDate(javascriptDate: Date) {
        return new Date(javascriptDate.getTime() + (javascriptDate.getTimezoneOffset() * 60 * 1000));
    }

    static getMonthsWithinATimePeriod(startDate: TimesheetDate, finishDate: TimesheetDate) {
        if (startDate.isDateSameOrBefore(finishDate)) {
            const monthForStartDate = moment(startDate.date).month();
            const monthForFinishDate = moment(finishDate.date).month();
            let monthArray = [];
            let count = monthForStartDate
            while (count <= monthForFinishDate) {
                monthArray.push(count);
                count++;
            }
            return monthArray;
        } else throw Error(ErrorMessageEnum.dateSelectionMismatch)
    }

    static getWeekDaysCollection(referenceDate: TimesheetDate) {
        let weekDays: TimesheetDate[] = [];
        const firstDayOfTheWeek = referenceDate.getFirstDayOfTheWeek;
        let _currentDay = firstDayOfTheWeek;
        for (var i = 0; i < 7; i++) {
            weekDays = [...weekDays, _currentDay];
            _currentDay = _currentDay.dateIncrementByDay(1);
        }
        return weekDays;
    }
}