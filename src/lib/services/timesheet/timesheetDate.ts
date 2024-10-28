import moment from "moment";
import { InvalidTimesheetDateError } from "./timesheetErrors";
import { PlainTimesheetDate } from "@/lib/types/timesheet";
import { TimesheetEntry } from "./timesheetEntry";
import { ErrorMessage } from "@/lib/constants/constant";
import { PrimitiveDefaultTimesheetEntry } from "@/lib/types/primitive";
import { defaultTimesheetEntryData } from "@/lib/constants/default";

export class TimesheetDate implements PlainTimesheetDate {
    date: string;
    _isValidTimesheetDate?: boolean;

    constructor(dateObject: PlainTimesheetDate | String | string) {
        if (typeof dateObject == 'string' || dateObject instanceof String) {
            this.date = dateObject as string;
        } else {
            this.date = dateObject.date;
        }
        let momentTimesheetDate = moment(this.date);
        this._isValidTimesheetDate = momentTimesheetDate.isValid();
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

    /**
     * Returns Day In Week
     * @returns day
     */
    get day(): number {
        return moment(this.date).day();
    }

    /**
     * Returns Day In Week (Locale aware)
     * @returns day
     */
    get weekday(): number {
        return moment(this.date).weekday();
    }

    get dayLabel(): string {
        return moment(this.date).format('dddd');
        // @returns "Sunday", "Monday" ...
    }

    get dayInMonth(): number {
        return moment(this.date).date();
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

    get yearNumber(): number {
        return moment(this.date).year();
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

    convertToPlain() {
        return { date: this.defaultFormat() };
    }

    static initializeWeekStartDay = async () => {
        // I will remove the database check for now
        let weekStartDay;
        const defaultData: PrimitiveDefaultTimesheetEntry = await TimesheetEntry.defaultInformation();
        weekStartDay = defaultData.weekStartDay
        TimesheetDate.updateWeekStartDay(weekStartDay);
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
        const _weekStartDayNumber = TimesheetDate.convertWeekdayTextToWeekdayNumber(selectedWeekStartDay);
        if (_weekStartDayNumber === 1) {
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
        } else throw Error(ErrorMessage.dateSelectionMismatch)
    }

    public static getWeekDays(referenceDate: TimesheetDate): TimesheetDate[]
    public static getWeekDays(weekNumber: number): TimesheetDate[]
    public static getWeekDays(reference: TimesheetDate | number) {
        let localReferenceDate: TimesheetDate;
        if (reference instanceof TimesheetDate) localReferenceDate = reference
        else {
            // reference is a week
            // I will assume current year anyways
            const _referenceMomentDate = moment().week(reference);
            localReferenceDate = new TimesheetDate(_referenceMomentDate.format())
        }

        let weekDays: TimesheetDate[] = [];
        const firstDayOfTheWeek = localReferenceDate.getFirstDayOfTheWeek;
        let _currentDay = firstDayOfTheWeek;
        for (var i = 0; i < 7; i++) {
            weekDays = [...weekDays, _currentDay];
            _currentDay = _currentDay.dateIncrementByDay(1);
        }
        return weekDays;
    }

    static convertPrimitiveToDate(primitiveDate: string) {
        const _date: TimesheetDate = new TimesheetDate(primitiveDate);
        return _date;
    }

    static extractWeekDataFromPrimitiveWeek(primitiveWeek: string) {
        // I expect the week number to be like 2024-W41
        try {
            const _weekDataArr = primitiveWeek.split('-');
            if (_weekDataArr.length > 1) {
                const _weekData = Number.parseInt(_weekDataArr[1].slice(1));
                const _yearData = Number.parseInt(_weekDataArr[0])
                return { year: _yearData, week: _weekData }
            }
        } catch (e) {
        }
        throw new Error("Invalid Week Number");
    }

    static getLastDayOfWeekFromWeekNumber(weekNumber: number, year: number): TimesheetDate {
        try {
            const lastDayOfTheWeek = moment().year(year).week(weekNumber).endOf('week').format();
            return new TimesheetDate({ date: lastDayOfTheWeek });
        } catch (e) {
        }
        throw new Error("Invalid Week Number or Year");
    }

    static getFirstDayOfWeekFromWeekNumber(weekNumber: number, year: number): TimesheetDate {
        try {
            const lastDayOfTheWeek = moment().year(year).week(weekNumber).startOf('week').format();
            return new TimesheetDate({ date: lastDayOfTheWeek });
        } catch (e) {
        }
        throw new Error("Invalid Week Number or Year");
    }

    static getCurrentWeekNumber() {
        const _currentWeek = moment().week()
        return Number(_currentWeek)
    }

    static getCurrentYearNumber() {
        const _currentYear = moment().year()
        return Number(_currentYear)
    }

    static getCurrentWeekYearForWeekForm() {
        const _currentWeek = TimesheetDate.getCurrentWeekNumber()
        const _currentYear = TimesheetDate.getCurrentYearNumber()
        // Something like: 2024-W41
        const _weekYear = `${_currentYear}-W${_currentWeek}`
        return _weekYear
    }

    static getMonthsInAWeek(week: number, year?: number) {
        const _date = moment();
        _date.week(week);
        if (!!year) _date.year(year);
        _date.weekday(0);
        const _monthForFirstDayOfWeek = _date.month();

        _date.weekday(6);
        const _monthForLastDayOfWeek = _date.month();

        if (_monthForFirstDayOfWeek === _monthForLastDayOfWeek) return [_monthForFirstDayOfWeek]
        return [_monthForFirstDayOfWeek, _monthForLastDayOfWeek]
    }

    static areDateStringsSameDay(date1: string, date2: string) {
        return moment(date1).isSame(moment(date2))
    }

    static monthForSelectedDay(date: string) {
        const _date = new TimesheetDate(date);
        return _date.monthNumber
    }
}