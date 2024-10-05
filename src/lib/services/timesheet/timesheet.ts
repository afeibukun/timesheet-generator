import { defaultTimesheetEntryType } from "@/lib/constants/defaultData";
import { TimesheetDate } from "./timesheetDate";
import { TimesheetEntry } from "./timesheetEntry";
import { CustomerInterface, DefaultPrimitiveTimesheetEntryDataInterface, PrimitiveTimesheetEntryInterface, PrimitiveTimesheetInterface, ProjectInterface, SiteInterface, TimesheetCollectionByMonthInterface, TimesheetCollectionInterface, TimesheetInterface, TimesheetOptionInterface } from "@/lib/types/timesheetType";
import { Personnel } from "../personnel";
import { TimesheetEntryPeriod } from "./timesheetEntryPeriod";
import { createOrUpdateAppOption, createTimesheet, createTimesheetCollection, getByIndexInStore, getInStore, updateDataInStore } from "../indexedDB/indexedDBService";
import { CustomerSchema, IndexName, PersonnelSchema, StoreName, TimesheetCollectionSchema, TimesheetSchema } from "@/lib/constants/schema";
import { ActiveComponentType, StorageOptionLabel } from "@/lib/constants/enum";
import { PersonnelInterface } from "@/lib/types/personnelType";
import { TimesheetHour } from "./timesheetHour";

export class Timesheet implements TimesheetInterface {
    id: number;
    personnel: Personnel;
    weekEndingDate: TimesheetDate;
    customer: CustomerInterface;
    site: SiteInterface;
    project: ProjectInterface;
    options: TimesheetOptionInterface[];
    entries: TimesheetEntry[];
    comment: string;

    constructor(timesheet: TimesheetInterface) {
        this.id = timesheet.id ?? 0;
        this.personnel = timesheet.personnel;
        this.customer = timesheet.customer;
        this.site = timesheet.site;
        this.project = timesheet.project;
        this.weekEndingDate = timesheet.weekEndingDate;
        this.options = timesheet.options;
        this.entries = timesheet.entries;
        this.comment = timesheet.comment;
    }

    // might not be necessary, timesheet is already been grouped by week
    get timesheetEntriesByWeek() {
        let flatTimesheetCollection = this.entries;
        const groupedTimesheet = Object.groupBy(flatTimesheetCollection, ({ date }) => {
            return new TimesheetDate(date).weekNumber;
        });
        return groupedTimesheet;
    }

    get totalHours(): TimesheetHour {
        let hours = this.entries.reduce((accumulator, timesheetEntry) => {
            accumulator = TimesheetHour.sumTimesheetHours(timesheetEntry.totalEntryPeriodHours, accumulator)
            return accumulator
        }, {} as TimesheetHour);
        return hours;
    }

    get totalHourString(): string {
        return this.totalHours.time
    }

    get totalDays(): number {
        const entryDateInDefaultFormat = this.entries.map((currentEntry) => currentEntry.date.defaultFormat());
        const uniqueEntryDateInDefaultFormat = new Set(entryDateInDefaultFormat);
        return uniqueEntryDateInDefaultFormat.size;
    }

    get weekNumber(): number {
        return this.entries[0].weekNumber;
    }

    get monthNumber(): number {
        // A Timesheet spans a week, but never overlaps a month
        return this.entries[0].monthNumber;
    }

    get month(): string {
        return this.entries[0].month;
    }

    get isNull(): Boolean {
        if (this == null || this == undefined || !('entries' in this) || !('personnel' in this)) return true;
        return false;
    }

    hasEntryOnDate(date: TimesheetDate): Boolean {
        return this.entries.some((entry) => date.isEqual(entry.date))
    }

    static doesPrimitiveTimesheetHaveEntryOnPrimitiveDate(primitiveTimesheet: PrimitiveTimesheetInterface, primitiveDate: string) {
        return primitiveTimesheet.entries.some((entry) => entry.date === primitiveDate)
    }

    static async hasUpdatedDefaultInformation() {
        let defaultData = await TimesheetEntry.defaultInformation();
        if (defaultData.updatedAt == '' || defaultData.updatedAt == undefined || defaultData.updatedAt == null) return false;
        return true
    }

    static async createTimesheetCollectionFromMobilizationPeriod(mobilizationDate: TimesheetDate, demobilizationDate: TimesheetDate, personnel: Personnel, customer: CustomerInterface, site: SiteInterface, project: ProjectInterface) {
        let defaultData: DefaultPrimitiveTimesheetEntryDataInterface = await TimesheetEntry.defaultInformation();
        TimesheetDate.updateWeekStartDay(defaultData.weekStartDay); // to keep the week start day as monday.
        const _mobDate = mobilizationDate; // the date you got to the site
        const _demobDate = demobilizationDate; // the date you left the site
        const _preMobTravelDate = _mobDate.dateDecrementByDay(1); // the date you left your house
        const _postDemobTravelDate = _demobDate.dateIncrementByDay(1); // the date you got back to your house

        const monthCollection = TimesheetDate.getMonthsWithinATimePeriod(_preMobTravelDate, _postDemobTravelDate);
        const timesheetCollectionByMonth: Array<Timesheet[]> = new Array(monthCollection.length).fill([]);
        let timesheetCollection: TimesheetCollectionInterface = { collection: [] };

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
                _cursorTimesheet = new Timesheet({ personnel: personnel, weekEndingDate: _cursorWeekEndingDate, customer: customer, site: site, project: project, options: [], entries: [], comment: '' });
                timesheetCollectionByMonth[_monthCount] = [...timesheetCollectionByMonth[_monthCount], _cursorTimesheet];
                _startNewTimesheet = false;
            } else {
                _cursorTimesheet = timesheetCollectionByMonth[_monthCount][_timesheetCount];
            }

            const timesheetEntryForCurrentDate = new TimesheetEntry({
                id: Date.now(), date: _cursorDate, entryType: getEntryType(_cursorDate), entryPeriod: getEntryPeriod(), locationType: defaultData.locationType, comment: defaultData.comment
            });

            _cursorTimesheet.entries = [..._cursorTimesheet.entries, timesheetEntryForCurrentDate]
            timesheetCollectionByMonth[_monthCount][_timesheetCount].entries = _cursorTimesheet.entries;

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
                let timesheetForDb: TimesheetSchema = { customer: customer, personnel: personnel, project: project, site: site, entries: _cursorTimesheet.entries, options: _cursorTimesheet.options, weekEndingDate: _cursorTimesheet.weekEndingDate, comment: _cursorTimesheet.comment }

                const stringifiedTimesheet = JSON.stringify(timesheetForDb)
                const timesheet = await createTimesheet(JSON.parse(stringifiedTimesheet));
                timesheetCollection.collection = [...timesheetCollection.collection, timesheet];
            }

            _cursorWeekNumber = _cursorDate.weekNumber;
            _cursorMonthNumber = _cursorDate.monthNumber;
            _cursorWeekEndingDate = _cursorDate.getLastDayOfTheWeek;
        }

        const timesheetIdCollection = timesheetCollection.collection.map((timesheet) => timesheet.id).filter(t => t != undefined)
        const timesheetCollectionFromDb: TimesheetCollectionInterface = await createTimesheetCollection({ timesheetIdCollection: timesheetIdCollection });

        if (timesheetCollectionFromDb.id) {
            await createOrUpdateAppOption(StorageOptionLabel.activeTimesheetCollectionIdLabel, timesheetCollectionFromDb.id);
            await createOrUpdateAppOption(StorageOptionLabel.activeComponentType, ActiveComponentType.timesheetCollection);
        }

        return { timesheetCollection: timesheetCollectionFromDb, timesheetCollectionByMonth: timesheetCollectionByMonth };
    }

    static async updateTimesheetInDb(timesheet: Timesheet | TimesheetInterface) {
        if (!timesheet.id) throw Error //Invalid timesheet Supplied

        const _stringifiedUpdatedTimesheet = JSON.stringify(timesheet);
        const _timesheetSchema: TimesheetSchema = JSON.parse(_stringifiedUpdatedTimesheet);
        // delete _timesheetSchema.id

        const newTimesheet = await updateDataInStore(_timesheetSchema, timesheet.id, StoreName.timesheet);
        return newTimesheet;
    }

    static convertTimesheetToPrimitive(timesheet: Timesheet) {
        if (!timesheet.project.id) throw Error;
        const _projectId = timesheet.project.id

        const _primitiveTimesheet: PrimitiveTimesheetInterface = {
            id: timesheet.id,
            customerSlug: timesheet.customer.slug,
            siteSlug: timesheet.site.slug,
            projectId: _projectId,
            options: timesheet.options,
            comment: timesheet.comment,
            entries: timesheet.entries.map((entry: TimesheetEntry) => {
                const _breakStartTime = entry?.entryPeriod?.breakTimeStart?.time;
                const _breakFinishTime = entry?.entryPeriod?.breakTimeFinish?.time;

                if (!entry.entryPeriod?.startTime) throw Error // invalid starttime
                const _entryPeriodStartTime = entry.entryPeriod.startTime.time

                if (!entry.entryPeriod?.finishTime?.time) throw Error
                const _entryPeriodFinishTime = entry.entryPeriod?.finishTime?.time

                const _primitiveTimesheetEntry: PrimitiveTimesheetEntryInterface = { id: entry.id, date: entry.date.defaultFormat(), entryTypeSlug: entry.entryType.slug, hasPremium: entry.hasPremium, entryPeriodStartTime: _entryPeriodStartTime, entryPeriodFinishTime: _entryPeriodFinishTime, locationType: entry.locationType, comment: entry.comment, breakPeriodStartTime: _breakStartTime ? _breakStartTime : '', breakPeriodFinishTime: _breakFinishTime ? _breakFinishTime : '' }
                return _primitiveTimesheetEntry
            })
        }
        return _primitiveTimesheet;
    }

    static convertSchemaToTimesheet(timesheetDBData: TimesheetSchema) {
        // const personnelDbData: PersonnelSchema = await getByIndexInStore(StoreName.personnel, IndexName.slugIndex, timesheetDBData.personnelSlug);
        // const _personnel = Personnel.convertPersonnelSchemaToPersonnel(personnelDbData);
        const personnelData: PersonnelInterface = timesheetDBData.personnel;
        const _personnel = new Personnel(personnelData);

        // const customerDbData: CustomerSchema = await getByIndexInStore(StoreName.customer, IndexName.slugIndex, timesheetDBData.customerSlug);
        /* if (!customerDbData.id) throw Error //Customer not found or something
        const _customer: CustomerInterface = { ...customerDbData, id: customerDbData.id }; */
        const _customer: CustomerInterface = timesheetDBData.customer;

        /* if (customerDbData.sites.length == 0) throw Error; //There are no sites for the selected customer, not right  
        const _site: SiteInterface = customerDbData.sites.filter(s => s.slug == timesheetDBData.siteSlug)[0];
        if (!_site) throw Error; // there are sites for the customer, but the one saved on the timesheet Data is not on the site list */
        const _site: SiteInterface = timesheetDBData.site;

        // const _project: ProjectInterface = await getInStore(timesheetDBData.projectId, StoreName.project);
        const _project: ProjectInterface = timesheetDBData.project;

        const _weekEndingDate = new TimesheetDate(timesheetDBData.weekEndingDate);

        let _options: TimesheetOptionInterface[] = [];
        if (timesheetDBData.options) _options = timesheetDBData.options

        if (!timesheetDBData.entries) throw Error //entry is undefined or null, bad situation.
        const timesheetEntries = timesheetDBData.entries.map((entry) => {
            return new TimesheetEntry(entry)
        });


        const timesheet = new Timesheet({
            id: timesheetDBData.id, personnel: _personnel, customer: _customer, site: _site, project: _project,
            weekEndingDate: _weekEndingDate, options: _options, entries: timesheetEntries, comment: timesheetDBData.comment
        });
        return timesheet
    }

    static async convertPrimitiveToSchema(primitiveTimesheet: PrimitiveTimesheetInterface, personnel: PersonnelInterface, weekEndingDate: TimesheetDate) {
        const customerDbData: CustomerSchema = await getByIndexInStore(StoreName.customer, IndexName.slugIndex, primitiveTimesheet.customerSlug);
        if (!customerDbData.id) throw Error //Customer not found
        const _customer: CustomerInterface = { ...customerDbData, id: customerDbData.id };

        if (customerDbData.sites.length == 0) throw Error; //There are no sites for the selected customer, not right  
        const _site: SiteInterface = customerDbData.sites.filter(s => s.slug == primitiveTimesheet.siteSlug)[0];
        if (!_site) throw Error; // there are sites for the customer, but the one saved on the timesheet Data is not on the site list

        const _project: ProjectInterface = await getInStore(primitiveTimesheet.projectId, StoreName.project);

        let _options: TimesheetOptionInterface[] = [];
        if (primitiveTimesheet.options) _options = primitiveTimesheet.options

        if (!primitiveTimesheet.entries) throw Error //entry is undefined or null, bad situation.
        const timesheetEntries = primitiveTimesheet.entries.map((primitiveEntry) => TimesheetEntry.convertPrimitiveToTimesheetEntryInterface(primitiveEntry));

        const timesheetSchema: TimesheetSchema = {
            id: primitiveTimesheet.id, personnel: personnel, customer: _customer, site: _site, project: _project,
            weekEndingDate: weekEndingDate, options: _options, entries: timesheetEntries, comment: primitiveTimesheet.comment
        };
        return timesheetSchema
    }

    static async convertPrimitiveToTimesheet(primitiveTimesheet: PrimitiveTimesheetInterface, personnel: PersonnelInterface, weekEndingDate: TimesheetDate) {
        const _timesheetSchema = await Timesheet.convertPrimitiveToSchema(primitiveTimesheet, personnel, weekEndingDate)
        const _timesheet = Timesheet.convertSchemaToTimesheet(_timesheetSchema);
        return _timesheet
    }

    static async getTimesheetFromId(timesheetId: number) {
        const _timesheetFromDb: TimesheetSchema = await getInStore(timesheetId, StoreName.timesheet);
        const _timesheet = await Timesheet.convertSchemaToTimesheet(_timesheetFromDb);
        if (_timesheet) return _timesheet;
        throw Error // timesheet not found
    }

    static async getTimesheetCollectionFromId(timesheetCollectionId: number) {
        const timesheetCollectionFromDb: TimesheetCollectionSchema = await getInStore(timesheetCollectionId, StoreName.timesheetCollection);
        let _timesheetCollection: TimesheetCollectionInterface = { id: timesheetCollectionFromDb.id, collection: [] }
        await Promise.all(timesheetCollectionFromDb.timesheetIdCollection.map(async (id) => {
            const timesheetDbData: TimesheetSchema = (await getInStore(id, StoreName.timesheet)) || undefined;
            const timesheet = await Timesheet.convertSchemaToTimesheet(timesheetDbData);
            if (timesheet) _timesheetCollection.collection = [..._timesheetCollection.collection, timesheet];
        }));
        return _timesheetCollection
    }

    static async getTimesheetCollectionGroupedMonthlyFromId(timesheetCollectionId: number) {
        const timesheetCollectionFromDb: TimesheetCollectionSchema = await getInStore(timesheetCollectionId, StoreName.timesheetCollection);
        let _timesheetCollectionByMonth: TimesheetCollectionByMonthInterface = { id: timesheetCollectionFromDb.id, collection: [[]] }

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
}

