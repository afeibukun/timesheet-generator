import { defaultTimesheetEntryType } from "@/lib/constants/default";
import { TimesheetDate } from "./timesheetDate";
import { TimesheetEntry } from "./timesheetEntry";
import { TimesheetCollectionByMonth, TimesheetCollection, PlainTimesheet, TimesheetOption } from "@/lib/types/timesheet";
import { Personnel } from "../meta/personnel";
import { TimesheetEntryPeriod } from "./timesheetEntryPeriod";
import { createOrUpdateAppOption, createTimesheet, createTimesheetCollection, getAllFromIndexInStore, getFromIndexInStore, getInStore, updateDataInStore } from "../indexedDB/indexedDBService";
import { CustomerSchema, PersonnelSchema, ProjectSchema, TimesheetCollectionSchema, TimesheetSchema } from "@/lib/types/schema";
import { ComponentType, ErrorMessage, OptionLabel, ReportType, TemplateType } from "@/lib/constants/constant";
import { TimesheetHour } from "./timesheetHour";
import { TimesheetRecord } from "./timesheetRecord";
import { getUniqueIDBasedOnTime, slugify } from "@/lib/helpers";
import { StorageLabel, IndexName, StoreName } from "@/lib/constants/storage";
import { Customer } from "../meta/customer";
import { Site } from "../meta/site";
import { Project } from "../meta/project";
import { PrimitiveDefaultTimesheetEntry, PrimitiveTimesheet, PrimitiveTimesheetEntryError, PrimitiveTimesheetOption } from "@/lib/types/primitive";
import { PlainCustomer, PlainProject, PlainSite } from "@/lib/types/meta";
import { createXlsxTimesheetClassicTemplate } from "../xlsx/excelJsService";
import { createPdfWithJsPdfAutoTable } from "../pdf/jsPdfAutoTableService";

/**
 * class: Timesheet
 * An object of class Timesheet refers to a week of recorded work informatiomn
 */
export class Timesheet implements PlainTimesheet {
    id?: number;
    key: number;
    personnel: Personnel;
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
        return this.records[0].weekNumber;
    }

    get monthNumber(): number {
        // A Timesheet spans a week, but never overlaps a month
        return this.records[0].monthNumber;
    }
    get yearNumber(): number {
        // A Timesheet spans a week, but never overlaps a month
        return this.records[0].yearNumber;
    }

    get month(): string {
        return this.records[0].month;
    }

    get isNull(): Boolean {
        if (this == null || this == undefined || !('entries' in this) || !('personnel' in this)) return true;
        return false;
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

    getEntriesWithOverlappingPeriodInDay(date: TimesheetDate) {
        if (!this.hasEntryOnDate(date)) throw Error(ErrorMessage.entryOnDateNotFound);
        const _recordForDay = this.records.filter(_record => date.isEqual(_record.date))[0];
        const _overlappingEntries = _recordForDay.getEntriesWithOverlappingPeriod();
        return _overlappingEntries
    }

    doesDayHaveOverlappingTimeEntries(date: TimesheetDate) {
        const _recordForDay = this.records.filter(_record => date.isEqual(_record.date))[0];
        return _recordForDay.hasEntriesWithOverlappingPeriod();
    }

    convertToSchema() {
        let _timesheetSchema: TimesheetSchema = { id: this.id, key: this.key, personnel: this.personnel.convertToSchema(), personnelSlug: this.personnel.slug, project: this.project.convertToPlain(), customer: this.customer.convertToPlain(), site: this.site.convertToPlain(), records: this.records.map((_record) => _record.convertToPlain()), options: this.options, weekEndingDate: this.weekEndingDate.date, comment: this.comment }
        return _timesheetSchema;
    }

    convertToPrimitive() {
        if (!this.project.id) throw Error(ErrorMessage.projectNotFound);
        const _projectId = this.project.id
        const _primitiveTimesheet: PrimitiveTimesheet = {
            id: this.id,
            key: this.key,
            customerSlug: this.customer.slug,
            siteSlug: this.site.slug,
            projectId: _projectId,
            options: this.options as PrimitiveTimesheetOption[], // they have the same structure
            comment: this.comment,
            records: this.records.map((_record: TimesheetRecord) => {
                const _primitiveRecord = _record.convertToPrimitive();
                return _primitiveRecord
            })
        }
        return _primitiveTimesheet;
    }

    generateTimesheetErrors = (existingEntryErrors: PrimitiveTimesheetEntryError[]) => {
        const defaultErrorObject = { error: false, message: "" }
        let entryErrors: PrimitiveTimesheetEntryError[] = [];
        this.records.forEach((_records) => {
            const _entriesInRecord = _records.entries.map((_entry) => {
                let _entryTypeError = defaultErrorObject
                if (!_entry.entryType) _entryTypeError = { error: true, message: "Entry Type Not Selected" }

                let startTimeError = Timesheet.errorOnEntryTime(_entry, this, 'start');
                let _entryStartTimeError = defaultErrorObject
                if (startTimeError.error) _entryStartTimeError = startTimeError

                let finishTimeError = Timesheet.errorOnEntryTime(_entry, this, 'finish');
                let _entryFinishTimeError = defaultErrorObject
                if (finishTimeError.error) _entryFinishTimeError = finishTimeError

                let breakStartTimeError = _entry.entryPeriod.errorOnBreakStartTime()
                let _entryBreakStartTimeError = defaultErrorObject
                if (breakStartTimeError.error) _entryBreakStartTimeError = breakStartTimeError

                let breakFinishTimeError = _entry.entryPeriod.errorOnBreakFinishTime()
                let _entryBreakFinishTimeError = defaultErrorObject
                if (breakFinishTimeError.error) _entryBreakFinishTimeError = breakFinishTimeError

                let entryError: PrimitiveTimesheetEntryError = existingEntryErrors.filter((e) => e.id === _entry.id)[0];
                if (entryError) entryError = { ...entryError, entryType: _entryTypeError, entryPeriodStartTime: _entryStartTimeError, entryPeriodFinishTime: _entryFinishTimeError, breakPeriodStartTime: _entryBreakStartTimeError, breakPeriodFinishTime: _entryBreakFinishTimeError }
                else entryError = { id: _entry.id, entryType: _entryTypeError, entryPeriodStartTime: _entryStartTimeError, entryPeriodFinishTime: _entryFinishTimeError, breakPeriodStartTime: _entryBreakStartTimeError, breakPeriodFinishTime: _entryBreakFinishTimeError, locationType: defaultErrorObject }
                return entryError
            })
            entryErrors = [...entryErrors, ..._entriesInRecord]
        })
        return entryErrors
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
        let _timesheetSchema: TimesheetSchema = this.convertToSchema();
        const newTimesheet = await updateDataInStore(_timesheetSchema, this.id, StoreName.timesheet);
        return newTimesheet;
    }

    exportXlsxTimesheet(reportType: ReportType, templateType: TemplateType) {
        if (reportType == ReportType.customer && templateType === TemplateType.classic) {
            createXlsxTimesheetClassicTemplate([this]);
        }
    }

    exportPdfTimesheet(reportType: ReportType, templateType: TemplateType) {
        if (reportType == ReportType.customer && templateType === TemplateType.classic) {
            createPdfWithJsPdfAutoTable([this])
        }
    }

    static async createTimesheet(weekData: string, personnel: Personnel, customer: Customer, site: Site, project: Project, shouldPopulateEntry: boolean = false, timesheetOptions: TimesheetOption[] = []) {
        let defaultData: PrimitiveDefaultTimesheetEntry = await TimesheetEntry.defaultInformation();
        TimesheetDate.updateWeekStartDay(defaultData.weekStartDay); // to keep the week start day as monday.

        const { year, week } = TimesheetDate.extractWeekDataFromPrimitiveWeek(weekData);
        const _lastDayOfTheSelectedWeek = TimesheetDate.getLastDayOfWeekFromWeekNumber(week, year)

        let _dateCount = 0;
        let _monthCount = 0;

        const _defaultEntryTypeSlug = "working-time";
        const getDefaultEntryType = () => defaultTimesheetEntryType.filter((entryType) => entryType.slug == _defaultEntryTypeSlug)[0];

        const getDefaultEntryPeriod = () => new TimesheetEntryPeriod({ startTime: new TimesheetHour(defaultData.startTime), finishTime: new TimesheetHour(defaultData.finishTime) })

        let _records: TimesheetRecord[] = []
        if (shouldPopulateEntry) {
            const _weekDays = await TimesheetDate.getWeekDays(_lastDayOfTheSelectedWeek)
            _records = _weekDays.map(_date => {
                const _newEntry = new TimesheetEntry({
                    id: TimesheetEntry.createId(), date: _date, entryType: getDefaultEntryType(), entryPeriod: getDefaultEntryPeriod(), locationType: defaultData.locationType, comment: defaultData.comment
                });
                const _newRecord = new TimesheetRecord({ id: TimesheetRecord.createId(), date: _date, entries: [_newEntry] });
                return _newRecord
            });
        }

        let _key = getUniqueIDBasedOnTime();
        while (!await Timesheet.isKeyUnique(_key)) _key = getUniqueIDBasedOnTime();

        const _newTimesheet: Timesheet = new Timesheet({ key: _key, personnel: personnel, weekEndingDate: _lastDayOfTheSelectedWeek, customer: customer, site: site, project: project, options: [], records: _records, comment: '' });

        let _timesheetSchema: TimesheetSchema = { key: _key, customer: customer, personnel: personnel.convertToSchema(), personnelSlug: personnel.slug, project: project, site: site, records: _newTimesheet.records, options: _newTimesheet.options, weekEndingDate: _newTimesheet.weekEndingDate.date, comment: _newTimesheet.comment }
        const _stringifiedTimesheet = JSON.stringify(_timesheetSchema)
        const _returnedTimesheet = await createTimesheet(JSON.parse(_stringifiedTimesheet));

        if (_returnedTimesheet.id) {
            await createOrUpdateAppOption(StorageLabel.activeTimesheetIdLabel, _returnedTimesheet.id);
            await createOrUpdateAppOption(StorageLabel.activeComponentType, ComponentType.timesheet);
        }
        return _returnedTimesheet;
    }

    static async createTimesheetCollectionFromMobilizationPeriod(mobilizationDate: TimesheetDate, demobilizationDate: TimesheetDate, personnel: Personnel, customer: Customer, site: Site, project: Project) {
        let defaultData: PrimitiveDefaultTimesheetEntry = await TimesheetEntry.defaultInformation();
        TimesheetDate.updateWeekStartDay(defaultData.weekStartDay); // to keep the week start day as monday.
        const _mobDate = mobilizationDate; // the date you got to the site
        const _demobDate = demobilizationDate; // the date you left the site
        const _preMobTravelDate = _mobDate.dateDecrementByDay(1); // the date you left your house
        const _postDemobTravelDate = _demobDate.dateIncrementByDay(1); // the date you got back to your house

        const monthCollection = TimesheetDate.getMonthsWithinATimePeriod(_preMobTravelDate, _postDemobTravelDate);
        const timesheetCollectionByMonth: Array<Timesheet[]> = new Array(monthCollection.length).fill([]);
        let _timesheetCollectionKey = getUniqueIDBasedOnTime();
        while (!await Timesheet.isKeyUniqueForCollection(_timesheetCollectionKey)) _timesheetCollectionKey = getUniqueIDBasedOnTime();
        let timesheetCollection: TimesheetCollection = { key: _timesheetCollectionKey, collection: [] };

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

        const getEntryPeriod = () => new TimesheetEntryPeriod({ startTime: new TimesheetHour(defaultData.startTime), finishTime: new TimesheetHour(defaultData.finishTime) })

        let _timesheetCount = 0;
        let _entriesCount = 0;
        let _cursorWeekNumber = _cursorDate.weekNumber;
        let _cursorWeekEndingDate = _cursorDate.getLastDayOfTheWeek;
        let _cursorMonthNumber = _cursorDate.monthNumber;
        let _cursorTimesheet;
        let _startNewTimesheet = true;


        while (isDateSameOrBeforeAnotherDate(_cursorDate, _postDemobTravelDate)) {
            // if (!timesheetCollection[_monthCount][_timesheetCount]) {
            if (_startNewTimesheet) {
                let _timesheetKey = getUniqueIDBasedOnTime();
                while (!await Timesheet.isKeyUnique(_timesheetKey)) _timesheetKey = getUniqueIDBasedOnTime();
                _cursorTimesheet = new Timesheet({ key: _timesheetKey, personnel: personnel, weekEndingDate: _cursorWeekEndingDate, customer: customer, site: site, project: project, options: [{ key: OptionLabel.mobilizationDate, value: _mobDate }, { key: OptionLabel.demobilizationDate, value: _demobDate }, { key: OptionLabel.timesheetCollectionKey, value: _timesheetCollectionKey }], records: [], comment: '' });
                timesheetCollectionByMonth[_monthCount] = [...timesheetCollectionByMonth[_monthCount], _cursorTimesheet];
                _startNewTimesheet = false;
            } else {
                _cursorTimesheet = timesheetCollectionByMonth[_monthCount][_timesheetCount];
            }

            const _entryForCurrentDate = new TimesheetEntry({
                id: TimesheetEntry.createId(), date: _cursorDate, entryType: getEntryType(_cursorDate), entryPeriod: getEntryPeriod(), locationType: defaultData.locationType, comment: defaultData.comment
            });
            const _entryGroupForCurrentDate = new TimesheetRecord({ id: TimesheetRecord.createId(), date: _cursorDate, entries: [_entryForCurrentDate] });
            _cursorTimesheet.records = [..._cursorTimesheet.records, _entryGroupForCurrentDate]
            timesheetCollectionByMonth[_monthCount][_timesheetCount].records = _cursorTimesheet.records;

            _entriesCount += 1;

            _cursorDate = _cursorDate.dateIncrementByDay(1);
            _dateCount += 1;

            if (!isDateWithinWeek(_cursorDate, _cursorWeekNumber)) {
                _timesheetCount += 1;
                _entriesCount = 0;
                _startNewTimesheet = true
            }

            if (!isDateWithinMonth(_cursorDate, _cursorMonthNumber)) {
                _monthCount += 1;
                _timesheetCount = 0;
                _entriesCount = 0;
                _startNewTimesheet = true
            }

            if (_startNewTimesheet) {
                // PERSIST IN INDEX DB before starting a new timesheet
                let _timesheetKey = getUniqueIDBasedOnTime();
                while (!await Timesheet.isKeyUnique(_timesheetKey)) _timesheetKey = getUniqueIDBasedOnTime();

                let _timesheetSchema: TimesheetSchema = { key: _timesheetKey, customer: customer, personnel: personnel.convertToSchema(), personnelSlug: personnel.slug, project: project, site: site, records: _cursorTimesheet.records, options: _cursorTimesheet.options, weekEndingDate: _cursorTimesheet.weekEndingDate.date, comment: _cursorTimesheet.comment }

                const stringifiedTimesheet = JSON.stringify(_timesheetSchema)
                const timesheet = await createTimesheet(JSON.parse(stringifiedTimesheet));
                timesheetCollection.collection = [...timesheetCollection.collection, timesheet];
            }

            _cursorWeekNumber = _cursorDate.weekNumber;
            _cursorMonthNumber = _cursorDate.monthNumber;
            _cursorWeekEndingDate = _cursorDate.getLastDayOfTheWeek;
        }

        const timesheetIdCollection = timesheetCollection.collection.map((timesheet) => timesheet.id).filter(t => t != undefined)
        const timesheetCollectionFromDb: TimesheetCollection = await createTimesheetCollection({ key: timesheetCollection.key, timesheetIdCollection: timesheetIdCollection });

        if (timesheetCollectionFromDb.id) {
            await createOrUpdateAppOption(StorageLabel.activeTimesheetCollectionIdLabel, timesheetCollectionFromDb.id);
            await createOrUpdateAppOption(StorageLabel.activeComponentType, ComponentType.timesheetCollection);
        }

        return { timesheetCollection: timesheetCollectionFromDb, timesheetCollectionByMonth: timesheetCollectionByMonth };
    }

    static doesPrimitiveTimesheetHaveEntryOnPrimitiveDate(primitiveTimesheet: PrimitiveTimesheet, primitiveDate: string) {
        return primitiveTimesheet.records.some((_primitiveRecord) => _primitiveRecord.date === primitiveDate)
    }

    static async hasUpdatedDefaultInformation() {
        let defaultData = await TimesheetEntry.defaultInformation();
        if (defaultData.updatedAt == '' || defaultData.updatedAt == undefined || defaultData.updatedAt == null) return false;
        return true
    }

    static async convertSchemaToTimesheet(timesheetSchema: TimesheetSchema) {
        const _personnelSchema: PersonnelSchema = await getFromIndexInStore(StoreName.personnel, IndexName.slugIndex, timesheetSchema.personnelSlug);
        const _personnel = Personnel.convertPersonnelSchemaToPersonnel(_personnelSchema);

        const _customerInterface: PlainCustomer = timesheetSchema.customer;
        const _customer = new Customer(_customerInterface)

        const _siteInterface: PlainSite = timesheetSchema.site;
        const _site: Site = new Site(_siteInterface);

        const _projectInterface: PlainProject = timesheetSchema.project;
        const _project: Project = new Project(_projectInterface);

        const _weekEndingDate = new TimesheetDate(timesheetSchema.weekEndingDate);

        let _options: TimesheetOption[] = [];
        if (timesheetSchema.options) _options = timesheetSchema.options

        if (!timesheetSchema.records) throw Error(ErrorMessage.timesheetEntriesNotFound) //entry is undefined or null, bad situation.
        const _timesheetRecord = timesheetSchema.records.map((_recordAsInterface) => {
            return new TimesheetRecord(_recordAsInterface)
        });

        if (!timesheetSchema.id) throw new Error("Cannot Change Timesheet Schema to Timesheet Object");
        const timesheet = new Timesheet({
            id: timesheetSchema.id, key: timesheetSchema.key, personnel: _personnel, customer: _customer, site: _site, project: _project, weekEndingDate: _weekEndingDate, options: _options, records: _timesheetRecord, comment: timesheetSchema.comment
        });
        return timesheet
    }

    static async convertPrimitiveToTimesheet(primitiveTimesheet: PrimitiveTimesheet, personnel: Personnel, weekEndingDate: TimesheetDate) {
        const _customer: Customer = await Customer.getCustomerBySlug(primitiveTimesheet.customerSlug);

        if (!_customer.sites) throw new Error("Sites Not Found");
        const _site: Site = Site.getSite(_customer.sites, primitiveTimesheet.siteSlug);


        const _project: Project = await Project.getProjectById(primitiveTimesheet.projectId);

        let _options: TimesheetOption[] = [];
        if (primitiveTimesheet.options) _options = primitiveTimesheet.options

        if (!primitiveTimesheet.records) throw Error(ErrorMessage.timesheetEntriesNotFound) //entry is undefined or null, bad situation.
        const _records = primitiveTimesheet.records.map((_primitiveRecord) => TimesheetRecord.convertPrimitiveToRecord(_primitiveRecord));

        // before storing _customer on timesheet list, we don't need the sites here
        _customer.removeSites();

        const _timesheet: Timesheet = new Timesheet({
            id: primitiveTimesheet.id, key: primitiveTimesheet.key, personnel: personnel, customer: _customer, site: _site, project: _project, options: _options, records: _records, comment: primitiveTimesheet.comment,
            weekEndingDate: weekEndingDate
        });
        return _timesheet
    }

    static async getTimesheetFromId(id: number) {
        const _timesheetSchema: TimesheetSchema = await getInStore(id, StoreName.timesheet);
        if (!_timesheetSchema) throw new Error("Timesheet Not Found");
        const _timesheet = await Timesheet.convertSchemaToTimesheet(_timesheetSchema);
        if (_timesheet) return _timesheet;
        throw Error(ErrorMessage.timesheetNotFound) // timesheet not found
    }

    static async getTimesheetFromKey(key: number) {
        try {
            const _timesheetSchema: TimesheetSchema = await getFromIndexInStore(StoreName.timesheet, IndexName.keyIndex, key);
            if (!_timesheetSchema) throw new Error("Timesheet Data Not Found using key");
            const _timesheet = await Timesheet.convertSchemaToTimesheet(_timesheetSchema);
            if (_timesheet) return _timesheet;
        } catch (e) {
            throw Error(ErrorMessage.timesheetNotFound) // timesheet not found
        }
    }

    static async getTimesheetCollectionFromId(id: number) {
        try {
            const _timesheetCollectionSchema: TimesheetCollectionSchema = await getInStore(id, StoreName.timesheetCollection);
            let _timesheetCollection: TimesheetCollection = { id: _timesheetCollectionSchema.id, key: _timesheetCollectionSchema.key, collection: [] }
            await Promise.all(_timesheetCollectionSchema.timesheetIdCollection.map(async (id) => {
                const timesheetDbData: TimesheetSchema = (await getInStore(id, StoreName.timesheet)) || undefined;
                const timesheet = await Timesheet.convertSchemaToTimesheet(timesheetDbData);
                if (timesheet) _timesheetCollection.collection = [..._timesheetCollection.collection, timesheet];
            }));
            return _timesheetCollection
        } catch (e) {
            throw new Error("Timesheet Collection Not Found")
        }
    }

    static async getTimesheetCollectionFromKey(key: number) {
        const _timesheetCollectionSchema: TimesheetCollectionSchema = await getFromIndexInStore(StoreName.timesheetCollection, IndexName.keyIndex, key);
        if (!_timesheetCollectionSchema) throw new Error("Timesheet Collection Not Found Using Key");
        let _timesheetCollection: TimesheetCollection = { id: _timesheetCollectionSchema.id, key: _timesheetCollectionSchema.key, collection: [] }
        await Promise.all(_timesheetCollectionSchema.timesheetIdCollection.map(async (id) => {
            const timesheetDbData: TimesheetSchema = (await getInStore(id, StoreName.timesheet)) || undefined;
            const timesheet = await Timesheet.convertSchemaToTimesheet(timesheetDbData);
            if (timesheet) _timesheetCollection.collection = [..._timesheetCollection.collection, timesheet];
        }));
        return _timesheetCollection
    }

    static async getTimesheetCollectionGroupedMonthlyFromId(timesheetCollectionId: number) {
        const timesheetCollectionFromDb: TimesheetCollectionSchema = await getInStore(timesheetCollectionId, StoreName.timesheetCollection);
        let _timesheetCollectionByMonth: TimesheetCollectionByMonth = { id: timesheetCollectionFromDb.id, collection: [[]] }

        let _monthCount = 0;
        let _currentMonthNumber: number;
        let _newMonth = true;

        await Promise.all(timesheetCollectionFromDb.timesheetIdCollection.map(async (id) => {
            const timesheetDbData: TimesheetSchema = await getInStore(id, StoreName.timesheet);
            const timesheet = await Timesheet.convertSchemaToTimesheet(timesheetDbData);

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

    static errorOnEntryTime = (entry: TimesheetEntry, timesheet: Timesheet, timeType: string = 'finish',) => {
        let errorData = timeType === 'start' ? entry.entryPeriod.errorOnStartTime() : entry.entryPeriod.errorOnFinishTime()
        if (errorData.error) return errorData

        if (entry) {
            if (timesheet.doesDayHaveOverlappingTimeEntries(entry.date) && timesheet.getEntriesWithOverlappingPeriodInDay(entry.date).some(e => e.id === entry.id)) return { error: true, message: "Entry Period Overlaps with other entries." }
        }
        return { error: false, message: "" }
    }

    static async getTimesheetSchemasFromPersonnel(personnel: Personnel) {
        const _timesheetSchemasByPersonnel: TimesheetSchema[] = await getAllFromIndexInStore(StoreName.timesheet, IndexName.personnelSlugIndex, personnel.slug);
        return _timesheetSchemasByPersonnel
    }

    static async getTimesheetsFromPersonnel(personnel: Personnel) {
        const _timesheetSchemas = await Timesheet.getTimesheetSchemasFromPersonnel(personnel);
        let _timesheets: Timesheet[] = [];
        for (let i = 0; i < _timesheetSchemas.length; i++) {
            const _timesheet = await Timesheet.convertSchemaToTimesheet(_timesheetSchemas[i]);
            _timesheets = [..._timesheets, _timesheet];
        }
        return _timesheets
    }

    static convertCustomerSchemaToInterface(customerSchema: CustomerSchema) {
        if (customerSchema.id) {
            let _iCustomer = { id: customerSchema.id, slug: customerSchema.slug, name: customerSchema.name }
            return _iCustomer;
        }
        throw new Error("Cannot Convert Customer Schema To Interface - Id is undefined");
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
}

