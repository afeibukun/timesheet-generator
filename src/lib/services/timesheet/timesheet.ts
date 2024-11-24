import { defaultTimesheetEntryType } from "@/lib/constants/default";
import { TimesheetDate } from "./timesheetDate";
import { TimesheetEntry } from "./timesheetEntry";
import { TimesheetCollectionByMonth, TimesheetCollection, PlainTimesheet, TimesheetOption, ExportOptions, PlainDefaultTimesheetData, PlainTimesheetCollection } from "@/lib/types/timesheet";
import { Personnel } from "../meta/personnel";
import { TimesheetEntryPeriod } from "./timesheetEntryPeriod";
import { createOrUpdateAppOption, createTimesheet, createTimesheetCollection, deleteDataInStore, getAllFromIndexInStore, getFromIndexInStore, getInStore, getTimesheetRecordsInMonth, updateDataInStore } from "../indexedDB/indexedDBService";
import { ComponentType, ErrorMessage, OptionLabel, ReportType, TemplateType } from "@/lib/constants/constant";
import { TimesheetHour } from "./timesheetHour";
import { TimesheetRecord } from "./timesheetRecord";
import { getUniqueIDBasedOnTime, slugify } from "@/lib/helpers";
import { StorageLabel, IndexName, StoreName } from "@/lib/constants/storage";
import { Customer } from "../meta/customer";
import { Site } from "../meta/site";
import { Project } from "../meta/project";
import { PlainCustomer, PlainProject, PlainSite } from "@/lib/types/meta";
import { createXlsxClassicCustomerTimesheetReport } from "../template/classic/xlsx/excelJs/customerReport";
import { createPdfWithJsPdfAutoTable } from "../template/classic/pdf/jspdfAutoTable/customerReport";
import { createXlsxClassicInternalTimesheetReport } from "../template/classic/xlsx/excelJs/internalReport";
import { ClassicTemplate } from "../template/classic/classic";
import { createInternalPdfReportWithJsPdfAutoTable } from "../template/classic/pdf/jspdfAutoTable/internalReport";

/**
 * class: Timesheet
 * An object of class Timesheet refers to a week of recorded work informatiomn
 */
export class Timesheet implements PlainTimesheet {
    id?: number;
    key: number;
    personnel: Personnel;
    /**
     * Assigned month for the timesheet
     * Since a single Timesheet cannot have entries that span different months
     */
    month: number;
    weekEndingDate: TimesheetDate;
    customer: Customer;
    site: Site;
    project: Project;
    options: TimesheetOption[];
    records: TimesheetRecord[];
    comment: string;

    constructor(plainTimesheet: PlainTimesheet) {
        this.id = plainTimesheet.id;
        this.key = plainTimesheet.key
        this.personnel = new Personnel(plainTimesheet.personnel);
        this.customer = new Customer(plainTimesheet.customer);
        this.site = new Site(plainTimesheet.site);
        this.project = new Project(plainTimesheet.project);
        this.weekEndingDate = new TimesheetDate(plainTimesheet.weekEndingDate);
        this.month = plainTimesheet.month;
        this.options = plainTimesheet.options;
        this.records = plainTimesheet.records.map((_plainRecord) => new TimesheetRecord(_plainRecord));
        this.comment = plainTimesheet.comment;
    }

    get totalHours(): TimesheetHour {
        let hours = this.records.reduce((accumulator, _record) => {
            accumulator = TimesheetHour.sumTimesheetHours(_record.totalHours, accumulator)
            return accumulator
        }, new TimesheetHour("00:00"));
        return hours;
    }

    get totalHourString(): string {
        return this.totalHours.time
    }

    get totalDays(): number {
        const entryDateInDefaultFormat = this.records.map((_record) => _record.date.defaultFormat());
        const uniqueEntryDateInDefaultFormat = new Set(entryDateInDefaultFormat);
        return uniqueEntryDateInDefaultFormat.size;
    }

    get weekNumber(): number {
        return this.weekEndingDate.weekNumber;
    }

    get monthNumber(): number {
        // A Timesheet spans a week, but never overlaps a month
        // zero index
        return this.records[0].monthNumber;
    }
    get yearNumber(): number {
        // A Timesheet spans a week, but never overlaps a month
        return this.records[0].yearNumber;
    }

    get monthLabel(): string {
        try {
            return this.records[0].month;
        } catch (e) { }
        return ''
    }

    get isNull(): Boolean {
        if (this == null || this == undefined || !('entries' in this) || !('personnel' in this)) return true;
        return false;
    }

    get hasRecords(): Boolean {
        if (this && this.records && this.records.length > 0) return true
        return false
    }

    hasEntryOnDate(date: TimesheetDate): Boolean {
        return this.records.some((_record) => _record.date.isEqual(date) && _record.hasEntry())
    }

    getTotalHoursOnADay(date: TimesheetDate) {
        const nullHour = new TimesheetHour("00:00");

        if (!this.hasEntryOnDate(date)) return nullHour
        let _totalHoursForDay = nullHour;
        const _recordForDay = this.records.filter(_record => date.isEqual(_record.date))[0];
        if (_recordForDay) _totalHoursForDay = _recordForDay.totalHours;
        return _totalHoursForDay
    }

    convertToPlain() {
        let _plainTimesheet: PlainTimesheet = { id: this.id, key: this.key, personnel: this.personnel.convertToPlain(), personnelSlug: this.personnel.slug, project: this.project.convertToPlain(), customer: this.customer.convertToPlain(), site: this.site.convertToPlain(), records: this.records.map((_record) => _record.convertToPlain()), options: this.options, weekEndingDate: this.weekEndingDate.convertToPlain(), month: this.month, comment: this.comment }
        return _plainTimesheet;
    }

    get mobilizationDate() {
        try {
            return new TimesheetDate(this.options.filter((_option) => _option.key === OptionLabel.mobilizationDate)[0].value)
        } catch (e) {
        }
        return undefined
    }

    get demobilizationDate() {
        try {
            return new TimesheetDate(this.options.filter((_option) => _option.key === OptionLabel.demobilizationDate)[0].value)
        } catch (e) {
        }
        return undefined
    }

    async updateTimesheetInDb() {
        if (!this.id) throw Error(ErrorMessage.invalidTimesheet) //Invalid-Timesheet (We can't update what's not existing)
        let _plainTimesheet: PlainTimesheet = this.convertToPlain();
        const newTimesheet = await updateDataInStore(_plainTimesheet, this.id, StoreName.timesheet);
        return newTimesheet;
    }

    async exportXlsxTimesheet(reportType: ReportType, templateType: TemplateType, exportOption: ExportOptions) {
        await TimesheetDate.initializeWeekStartDay();
        if (reportType == ReportType.customer && templateType === TemplateType.classic) {
            createXlsxClassicCustomerTimesheetReport([this], exportOption);
        }
    }

    exportPdfTimesheet(reportType: ReportType, templateType: TemplateType, exportOption: ExportOptions) {
        if (reportType == ReportType.customer && templateType === TemplateType.classic) {
            createPdfWithJsPdfAutoTable([this], exportOption)
        }
    }

    static async createTimesheetId() {
        let _key = getUniqueIDBasedOnTime();
        while (!await Timesheet.isKeyUnique(_key)) _key = getUniqueIDBasedOnTime();
        return _key
    }

    static async createTimesheetCollectionId() {
        let _timesheetCollectionKey = getUniqueIDBasedOnTime();
        while (!await Timesheet.isKeyUniqueForCollection(_timesheetCollectionKey)) _timesheetCollectionKey = getUniqueIDBasedOnTime();
        return _timesheetCollectionKey
    }

    static async createTimesheet(personnel: Personnel, customer: Customer, site: Site, project: Project, shouldPopulateEntry: boolean = false, timesheetOptions: TimesheetOption[] = [], week?: number, year?: number, month?: number) {
        let defaultData: PlainDefaultTimesheetData = await TimesheetEntry.defaultInformation();
        TimesheetDate.updateWeekStartDay(defaultData.weekStartDay); // to keep the week start day as monday.

        const _currentWeek = TimesheetDate.getCurrentWeekNumber();
        const _week = week !== undefined ? week : _currentWeek;

        const _currentYear = TimesheetDate.getCurrentYearNumber();
        const _year = year !== undefined ? year : _currentYear;

        const _possibleMonths = TimesheetDate.getMonthsInAWeek(_week, _year);
        const _month = month !== undefined && _possibleMonths.includes(month) ? month : _possibleMonths[0];

        const _lastDayOfTheSelectedWeek = TimesheetDate.getLastDayOfWeekFromWeekNumber(_week, _year)

        const _defaultEntryTypeSlug = "working-time";
        const getDefaultEntryType = () => defaultTimesheetEntryType.filter((entryType) => entryType.slug == _defaultEntryTypeSlug)[0];

        const getDefaultEntryPeriod = () => new TimesheetEntryPeriod({ startTime: new TimesheetHour(defaultData.startTime), finishTime: new TimesheetHour(defaultData.finishTime) })

        let _records: TimesheetRecord[] = []
        if (shouldPopulateEntry) {
            const _weekDays = TimesheetDate.getWeekDays(_lastDayOfTheSelectedWeek)
            _records = _weekDays.reduce((_recordsAccumulator, _date, index) => {
                if (_date.monthNumber === _month) {
                    const _newEntry = new TimesheetEntry({
                        id: TimesheetEntry.createTimesheetEntryId(), date: _date, entryType: getDefaultEntryType(), entryPeriod: getDefaultEntryPeriod(), locationType: defaultData.locationType, comment: defaultData.comment
                    });
                    let _timesheetRecordKey = ''
                    while (_recordsAccumulator.some((_record) => _record.key === _timesheetRecordKey) || _timesheetRecordKey == '') {
                        _timesheetRecordKey = TimesheetRecord.createTimesheetRecordId(_date, index);
                    }
                    const _newRecord = new TimesheetRecord({ key: _timesheetRecordKey, date: _date, entries: [_newEntry], customer: customer, project: project });
                    return [..._recordsAccumulator, _newRecord]
                } else {
                    return _recordsAccumulator
                }
            }, _records);
        }
        let _key = await Timesheet.createTimesheetId()
        const _newTimesheet: Timesheet = new Timesheet({ key: _key, personnel: personnel, weekEndingDate: _lastDayOfTheSelectedWeek, month: _month, customer: customer, site: site, project: project, options: timesheetOptions, records: _records, comment: '' });
        let _plainTimesheet: PlainTimesheet = _newTimesheet.convertToPlain();

        const _stringifiedTimesheet = JSON.stringify(_plainTimesheet)
        const _returnedTimesheet: PlainTimesheet = await createTimesheet(JSON.parse(_stringifiedTimesheet));

        if (_returnedTimesheet.id) {
            await createOrUpdateAppOption(StorageLabel.activeTimesheetIdLabel, _returnedTimesheet.id);
            await createOrUpdateAppOption(StorageLabel.activeComponentType, ComponentType.timesheet);
        }
        return new Timesheet(_returnedTimesheet);
    }

    static async createTimesheetCollectionFromMobilizationPeriod(mobilizationDate: TimesheetDate, demobilizationDate: TimesheetDate, personnel: Personnel, customer: Customer, site: Site, project: Project) {
        let defaultData: PlainDefaultTimesheetData = await TimesheetEntry.defaultInformation();
        TimesheetDate.updateWeekStartDay(defaultData.weekStartDay); // to keep the week start day as monday.
        const _mobDate = mobilizationDate; // the date you got to the site
        const _demobDate = demobilizationDate; // the date you left the site
        const _preMobTravelDate = _mobDate.dateDecrementByDay(1); // the date you left your house
        const _postDemobTravelDate = _demobDate.dateIncrementByDay(1); // the date you got back to your house

        const monthCollection = TimesheetDate.getMonthsWithinATimePeriod(_preMobTravelDate, _postDemobTravelDate);
        const timesheetCollectionByMonth: Array<Timesheet[]> = new Array(monthCollection.length).fill([]);

        let _timesheetCollectionKey = await Timesheet.createTimesheetCollectionId()
        let timesheetCollection: TimesheetCollection = { key: _timesheetCollectionKey, timesheets: [] };

        let _cursorDate = _preMobTravelDate;
        let _dateCount = 0;
        let _monthCount = 0;

        const isDateSameOrBeforeAnotherDate = (firstDate: TimesheetDate, secondDate: TimesheetDate) => firstDate.isDateSameOrBefore(secondDate);
        const isDateWithinWeek = (date: TimesheetDate, weekNumber: number) => date.weekNumber == weekNumber;
        const isDateWithinMonth = (date: TimesheetDate, monthNumber: number) => date.monthNumber == monthNumber;
        const getEntryTypeSlug = (currentDate: TimesheetDate) => {
            let res = "working-time"
            if (currentDate.isDateSame(_preMobTravelDate)) res = "travel-mobilization"
            else if (currentDate.isDateSame(_postDemobTravelDate)) res = "travel-demobilization"
            return res
        }

        const getEntryType = (date: TimesheetDate) => defaultTimesheetEntryType.filter((entryType) => entryType.slug == getEntryTypeSlug(date))[0];

        const getEntryPeriod = (currentDate: TimesheetDate) => {
            if (currentDate.isDateSame(_preMobTravelDate) || currentDate.isDateSame(_postDemobTravelDate)) return new TimesheetEntryPeriod({ startTime: new TimesheetHour("06:00"), finishTime: new TimesheetHour("14:00") })
            else return new TimesheetEntryPeriod({ startTime: new TimesheetHour(defaultData.startTime), finishTime: new TimesheetHour(defaultData.finishTime) })
        }

        let _timesheetCount = 0;
        let _recordCount = 0;
        let _cursorWeekNumber = _cursorDate.weekNumber;
        let _cursorWeekEndingDate = _cursorDate.getLastDayOfTheWeek;
        let _cursorMonthNumber = _cursorDate.monthNumber;
        let _cursorTimesheet;
        let _startNewTimesheet = true;


        while (isDateSameOrBeforeAnotherDate(_cursorDate, _postDemobTravelDate)) {
            // if (!timesheetCollection[_monthCount][_timesheetCount]) {
            if (_startNewTimesheet) {
                let _timesheetKey = await Timesheet.createTimesheetId();
                _cursorTimesheet = new Timesheet({ key: _timesheetKey, personnel: personnel, weekEndingDate: _cursorWeekEndingDate, month: _cursorMonthNumber, customer: customer, site: site, project: project, options: [{ key: OptionLabel.mobilizationDate, value: _mobDate }, { key: OptionLabel.demobilizationDate, value: _demobDate }, { key: OptionLabel.timesheetCollectionKey, value: _timesheetCollectionKey }], records: [], comment: '' });
                timesheetCollectionByMonth[_monthCount] = [...timesheetCollectionByMonth[_monthCount], _cursorTimesheet];
                _startNewTimesheet = false;
            } else {
                _cursorTimesheet = timesheetCollectionByMonth[_monthCount][_timesheetCount];
            }

            const _entryForCurrentDate = new TimesheetEntry({
                id: TimesheetEntry.createTimesheetEntryId(), date: _cursorDate, entryType: getEntryType(_cursorDate), entryPeriod: getEntryPeriod(_cursorDate), locationType: defaultData.locationType, comment: defaultData.comment
            });
            let _timesheetRecordKey = ''
            while (_cursorTimesheet.records.some((_record) => _record.key === _timesheetRecordKey) || _timesheetRecordKey == '') {
                _timesheetRecordKey = TimesheetRecord.createTimesheetRecordId(_cursorDate, _recordCount);
            }
            const _entryRecordForCurrentDate = new TimesheetRecord({ key: _timesheetRecordKey, date: _cursorDate, entries: [_entryForCurrentDate], customer: customer, project: project });
            _cursorTimesheet.records = [..._cursorTimesheet.records, _entryRecordForCurrentDate]
            timesheetCollectionByMonth[_monthCount][_timesheetCount].records = _cursorTimesheet.records;

            _recordCount += 1;

            _cursorDate = _cursorDate.dateIncrementByDay(1);
            _dateCount += 1;

            if (!isDateWithinWeek(_cursorDate, _cursorWeekNumber)) {
                _timesheetCount += 1;
                _recordCount = 0;
                _startNewTimesheet = true
            }

            if (!isDateWithinMonth(_cursorDate, _cursorMonthNumber)) {
                _monthCount += 1;
                _timesheetCount = 0;
                _recordCount = 0;
                _startNewTimesheet = true
            }

            if (_startNewTimesheet) {
                // PERSIST IN INDEX DB before starting a new timesheet
                let _timesheetKey = getUniqueIDBasedOnTime();
                while (!await Timesheet.isKeyUnique(_timesheetKey)) _timesheetKey = getUniqueIDBasedOnTime();

                let _plainTimesheet: PlainTimesheet = { key: _timesheetKey, customer: customer, personnel: personnel.convertToPlain(), personnelSlug: personnel.slug, project: project, site: site, records: _cursorTimesheet.records, options: _cursorTimesheet.options, weekEndingDate: _cursorTimesheet.weekEndingDate.convertToPlain(), month: _cursorMonthNumber, comment: _cursorTimesheet.comment }

                const stringifiedTimesheet = JSON.stringify(_plainTimesheet)
                const timesheet = await createTimesheet(JSON.parse(stringifiedTimesheet));
                timesheetCollection.timesheets = [...timesheetCollection.timesheets, timesheet];
            }

            _cursorWeekNumber = _cursorDate.weekNumber;
            _cursorMonthNumber = _cursorDate.monthNumber;
            _cursorWeekEndingDate = _cursorDate.getLastDayOfTheWeek;
        }

        const timesheetIdCollection = timesheetCollection.timesheets.map((timesheet) => timesheet.id).filter(t => t != undefined)
        const timesheetCollectionFromDb: TimesheetCollection = await createTimesheetCollection({ key: timesheetCollection.key, timesheetIds: timesheetIdCollection });

        if (timesheetCollectionFromDb.id) {
            await createOrUpdateAppOption(StorageLabel.activeTimesheetCollectionIdLabel, timesheetCollectionFromDb.id);
            await createOrUpdateAppOption(StorageLabel.activeComponentType, ComponentType.timesheetCollection);
        }

        return { timesheetCollection: timesheetCollectionFromDb, timesheetCollectionByMonth: timesheetCollectionByMonth };
    }

    static async deleteTimesheet(timesheet: Timesheet) {
        if (timesheet.id) {
            await deleteDataInStore(timesheet.id, StoreName.timesheet)
        }
        return true
    }

    static async hasUpdatedDefaultInformation() {
        let defaultData = await TimesheetEntry.defaultInformation();
        if (defaultData.updatedAt == '' || defaultData.updatedAt == undefined || defaultData.updatedAt == null) return false;
        return true
    }

    static async getTimesheetFromId(id: number) {
        const _plainTimesheet: PlainTimesheet = await getInStore(id, StoreName.timesheet);
        if (!_plainTimesheet) throw new Error("Timesheet Not Found");
        const _timesheet = new Timesheet(_plainTimesheet);
        if (_timesheet) return _timesheet;
        throw Error(ErrorMessage.timesheetNotFound) // timesheet not found
    }

    static async getTimesheetFromKey(key: number) {
        try {
            const _plainTimesheet: PlainTimesheet = await getFromIndexInStore(StoreName.timesheet, IndexName.keyIndex, key);
            if (!_plainTimesheet) throw new Error("Timesheet Data Not Found using key");
            const _timesheet = new Timesheet(_plainTimesheet);
            if (_timesheet) return _timesheet;
        } catch (e) {
            throw Error(ErrorMessage.timesheetNotFound) // timesheet not found
        }
    }

    static async getTimesheetCollectionFromId(id: number) {
        try {
            const _plainTimesheetCollection: PlainTimesheetCollection = await getInStore(id, StoreName.timesheetCollection);
            let _timesheetCollection: TimesheetCollection = { id: _plainTimesheetCollection.id, key: _plainTimesheetCollection.key, timesheets: [] }
            if (!_plainTimesheetCollection.timesheetIds) throw new Error("Timesheet Collection Not Found", { cause: "timesheet Ids not found" })
            await Promise.all(_plainTimesheetCollection.timesheetIds.map(async (id) => {
                const timesheetDbData: PlainTimesheet = (await getInStore(id, StoreName.timesheet)) || undefined;
                const timesheet = new Timesheet(timesheetDbData);
                if (timesheet) _timesheetCollection.timesheets = [..._timesheetCollection.timesheets, timesheet];
            }));
            return _timesheetCollection
        } catch (e) {
            throw new Error("Timesheet Collection Not Found")
        }
    }

    static async getTimesheetCollectionFromKey(key: number) {
        const _plainTimesheetCollection: PlainTimesheetCollection = await getFromIndexInStore(StoreName.timesheetCollection, IndexName.keyIndex, key);
        if (!_plainTimesheetCollection) throw new Error("Timesheet Collection Not Found Using Key");
        let _timesheetCollection: TimesheetCollection = { id: _plainTimesheetCollection.id, key: _plainTimesheetCollection.key, timesheets: [] }

        if (!_plainTimesheetCollection.timesheetIds) throw new Error("Timesheet Collection Not Found", { cause: "timesheet Ids not found" })

        await Promise.all(_plainTimesheetCollection.timesheetIds.map(async (id) => {
            const timesheetDbData: PlainTimesheet = (await getInStore(id, StoreName.timesheet)) || undefined;
            const timesheet = new Timesheet(timesheetDbData);
            if (timesheet) _timesheetCollection.timesheets = [..._timesheetCollection.timesheets, timesheet];
        }));
        return _timesheetCollection
    }

    static async getTimesheetCollectionGroupedMonthlyFromId(timesheetCollectionId: number) {
        const timesheetCollectionFromDb: PlainTimesheetCollection = await getInStore(timesheetCollectionId, StoreName.timesheetCollection);
        let _timesheetCollectionByMonth: TimesheetCollectionByMonth = { id: timesheetCollectionFromDb.id, collection: [[]] }

        let _monthCount = 0;
        let _currentMonthNumber: number;
        let _newMonth = true;

        if (!timesheetCollectionFromDb.timesheetIds) throw new Error("Timesheet Collection Not Found", { cause: "timesheet Ids not found" })

        await Promise.all(timesheetCollectionFromDb.timesheetIds.map(async (id) => {
            const timesheetDbData: PlainTimesheet = await getInStore(id, StoreName.timesheet);
            const timesheet = new Timesheet(timesheetDbData);

            if (_currentMonthNumber && timesheet.monthNumber > _currentMonthNumber) _newMonth = true;
            else _newMonth = false;

            if (_newMonth) {
                _monthCount += 1
                _timesheetCollectionByMonth.collection = [..._timesheetCollectionByMonth.collection, []];
            }

            _timesheetCollectionByMonth.collection[_monthCount] = [..._timesheetCollectionByMonth.collection[_monthCount], timesheet];
            _newMonth = false;
            _currentMonthNumber = timesheet.monthNumber;
        }));

        return _timesheetCollectionByMonth
    }

    static async getPlainTimesheetFromPersonnel(personnel: Personnel) {
        const _plainTimesheetsByPersonnel: PlainTimesheet[] = await getAllFromIndexInStore(StoreName.timesheet, IndexName.personnelSlugIndex, personnel.slug);
        return _plainTimesheetsByPersonnel
    }

    static async getTimesheetsFromPersonnel(personnel: Personnel) {
        const _plainTimesheets = await Timesheet.getPlainTimesheetFromPersonnel(personnel);
        let _timesheets: Timesheet[] = [];
        for (let i = 0; i < _plainTimesheets.length; i++) {
            const _timesheet = new Timesheet(_plainTimesheets[i]);
            _timesheets = [..._timesheets, _timesheet];
        }
        return _timesheets
    }

    static async isKeyUnique(key: number) {
        const _timesheetWithCurrentIndex = await getAllFromIndexInStore(StoreName.timesheet, IndexName.keyIndex, key);
        if (_timesheetWithCurrentIndex.length > 0) return false
        return true
    }

    static async isKeyUniqueForCollection(key: number) {
        const _timesheetCollectionWithCurrentIndex = await getAllFromIndexInStore(StoreName.timesheetCollection, IndexName.keyIndex, key);
        if (_timesheetCollectionWithCurrentIndex.length > 0) return false
        return true
    }

    static timesheetHasRecords(timesheet: Timesheet) {
        if (timesheet.records && timesheet.records.length > 0) return true
        return false
    }

    static async exportXlsxTimesheets(reportType: ReportType, templateType: TemplateType, exportOption: ExportOptions, timesheets: Timesheet[]): Promise<void>;

    static async exportXlsxTimesheets(reportType: ReportType, templateType: TemplateType, exportOption: ExportOptions, month: number, year: number, cutOffDay: number, personnel: Personnel): Promise<void>;

    static async exportXlsxTimesheets(reportType: ReportType, templateType: TemplateType, exportOption: ExportOptions, timesheetReference?: Timesheet[] | number, year?: number, cutOffDay?: number, personnel?: Personnel) {
        await TimesheetDate.initializeWeekStartDay();
        if (reportType == ReportType.customer && templateType === TemplateType.classic && timesheetReference && Array.isArray(timesheetReference)) {
            createXlsxClassicCustomerTimesheetReport(timesheetReference, exportOption);
        } else if (reportType == ReportType.internal && templateType === TemplateType.classic && timesheetReference && typeof timesheetReference == "number" && year && personnel) {
            const month = timesheetReference
            let includePreviousMonth = false
            if (cutOffDay) includePreviousMonth = true
            const _internalReportTimesheet = await ClassicTemplate.generateInternalTimesheetReportCollection(month, year, personnel, cutOffDay, includePreviousMonth)
            createXlsxClassicInternalTimesheetReport(_internalReportTimesheet, exportOption);
        }
    }

    static async exportPdfTimesheets(reportType: ReportType, templateType: TemplateType, exportOption: ExportOptions, timesheetReference?: Timesheet[] | number, year?: number, cutOffDay?: number, personnel?: Personnel) {
        if (reportType == ReportType.customer && templateType === TemplateType.classic && timesheetReference && Array.isArray(timesheetReference)) {
            createPdfWithJsPdfAutoTable(timesheetReference, exportOption)
        } else if (reportType == ReportType.internal && templateType === TemplateType.classic && timesheetReference && typeof timesheetReference == "number" && year && personnel) {
            const month = timesheetReference
            let includePreviousMonth = false
            if (cutOffDay) includePreviousMonth = true
            const _internalReportTimesheet = await ClassicTemplate.generateInternalTimesheetReportCollection(month, year, personnel, cutOffDay, includePreviousMonth)
            createInternalPdfReportWithJsPdfAutoTable(_internalReportTimesheet, exportOption);
        }
    }

    static async getTimesheetAnnualReport(personnel: Personnel, year?: number) {
        const _selectedYear = year ? year : TimesheetDate.getCurrentYearNumber();
        let monthlyReports: TimesheetMonthlyReport[] = []

        const _monthsInYear = TimesheetDate.monthsInYear
        for (let i = 0; i < _monthsInYear.length; i++) {
            const _monthName = _monthsInYear[i]
            const _timesheetRecordInMonth = await getTimesheetRecordsInMonth(i, _selectedYear)
            let _dailyReports: TimesheetDailyReport[] = _timesheetRecordInMonth.reduce((accumulator, record) => {
                const recordObject = new TimesheetRecord(record)
                const _day = recordObject.date.dayInMonth
                const _totalHours = recordObject.totalHoursInString
                if (accumulator.some(acc => acc.day == _day)) {
                    return accumulator.map((acc) => {
                        if (acc.day == _day) {
                            const _recalculatedHours = TimesheetHour.sumTimesheetHours(new TimesheetHour(acc.totalHoursInDay), new TimesheetHour(_totalHours)).time
                            return { ...acc, totalHoursInDay: _recalculatedHours }
                        } else return acc
                    })
                } else {
                    const _report: TimesheetDailyReport = { day: _day, totalHoursInDay: _totalHours }
                    return [...accumulator, _report]
                }
            }, [] as TimesheetDailyReport[])

            let _totalHoursInMonth = _dailyReports.reduce((acc, _dayReport) => {
                return TimesheetHour.sumTimesheetHours(acc, new TimesheetHour(_dayReport.totalHoursInDay))
            }, new TimesheetHour('00:00')).time
            const _monthReport: TimesheetMonthlyReport = { monthName: _monthName, totalHoursInMonth: _totalHoursInMonth, dailyReports: _dailyReports }
            monthlyReports = [...monthlyReports, _monthReport];
        }

        let _annualReport: TimesheetAnnualReport = { year: _selectedYear, personnel: personnel, monthlyReports: monthlyReports }
        return _annualReport
    }

    /**
     * Timesheet Rules
     * - a timesheet with blank records or with no records should not be printed, don't waste the ink
     * - 
     */
}

export type TimesheetAnnualReport = {
    year: number, //2024
    personnel: Personnel
    monthlyReports: TimesheetMonthlyReport[]
}

type TimesheetMonthlyReport = {
    monthName: string,
    totalHoursInMonth: string,
    dailyReports: TimesheetDailyReport[]
}

type TimesheetDailyReport = {
    day: number,
    totalHoursInDay: string
}