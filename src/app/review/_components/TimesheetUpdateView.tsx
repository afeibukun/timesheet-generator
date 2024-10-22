import { defaultExportOption, defaultTimesheetEntryType } from "@/lib/constants/default";
import { LocationType, ReportType, TemplateType } from "@/lib/constants/constant";
import { Timesheet } from "@/lib/services/timesheet/timesheet";
import { TimesheetDate } from "@/lib/services/timesheet/timesheetDate";
import { useEffect, useState } from "react";
import InfoLabel from "./InfoLabel";
import { TimesheetEntry } from "@/lib/services/timesheet/timesheetEntry";
import { TimesheetRecord } from "@/lib/services/timesheet/timesheetRecord";
import { PrimitiveTimesheet, PrimitiveTimesheetEntry, PrimitiveTimesheetEntryError, PrimitiveTimesheetRecord } from "@/lib/types/primitive";
import ManageExportOption from "@/app/_components/ManageExportOption";
import { AppOption } from "@/lib/services/meta/appOption";
import TimesheetExportUI from "./TimesheetExportUI";

type TimesheetTableProps = {
    timesheetData: Timesheet,
    handleSaveTimesheet: Function
}

export default function TimesheetUpdateView({ timesheetData, handleSaveTimesheet }: TimesheetTableProps) {

    const [localPrimitiveTimesheet, setLocalPrimitiveTimesheet] = useState(timesheetData.convertToPrimitive());
    const [localTimesheet, setLocalTimesheet] = useState(timesheetData);

    const defaultErrorObject = { error: false, message: "" }
    const initializeEntryErrors = () => {
        let entryError: PrimitiveTimesheetEntryError[] = [];
        timesheetData?.records.forEach((_record: TimesheetRecord) => {
            const entryErrorsForDay: PrimitiveTimesheetEntryError[] = _record.entries.map((_entry) => {
                return { id: _entry.id, entryType: defaultErrorObject, locationType: defaultErrorObject, entryPeriodStartTime: defaultErrorObject, entryPeriodFinishTime: defaultErrorObject, breakPeriodStartTime: defaultErrorObject, breakPeriodFinishTime: defaultErrorObject }
            });
            entryError = [...entryError, ...entryErrorsForDay];
        })
        return entryError
    }
    const [localPrimitiveTimesheetEntryErrors, setLocalPrimitiveTimesheetEntryErrors] = useState(initializeEntryErrors());

    const [daysInCurrentTimesheetWeek, setDaysInCurrentTimesheetWeek] = useState([] as TimesheetDate[]);

    useEffect(() => {
        const initializer = async () => {
            await TimesheetDate.initializeWeekStartDay();
            const _weekDays = TimesheetDate.getWeekDays(timesheetData.weekEndingDate)
            setDaysInCurrentTimesheetWeek(_weekDays);
        }
        initializer();
    }, []);

    const getPrimitiveEntriesForDate = (primitiveDate: string) => {
        const _record = localPrimitiveTimesheet.records.filter((_record) => _record.date == primitiveDate)[0]
        if (_record) return _record.entries
        return []
    }

    const getEntryTotalTime = (entryId: number, primitiveDate: string) => {
        try {
            const _record = localTimesheet.records.filter((_record) => _record.date.defaultFormat() === primitiveDate)[0];
            const _entry = _record.entries.filter((_entry) => _entry.id === entryId)[0]
            return _entry.totalHoursInString
        } catch (e) {
            return '00:00'
        }
    }

    const addTimesheetEntry = (dayString: string) => {
        const _newPrimitiveEntry: PrimitiveTimesheetEntry = { id: TimesheetEntry.createId(), date: dayString, entryTypeSlug: '', hasPremium: false, entryPeriodStartTime: '', entryPeriodFinishTime: '', locationType: LocationType.onshore, comment: '', breakPeriodStartTime: '', breakPeriodFinishTime: '' }

        let _primitiveTimesheet: PrimitiveTimesheet = { ...localPrimitiveTimesheet }
        if (doesPrimitiveTimesheetHaveEntryOnDate(localPrimitiveTimesheet, dayString)) {
            _primitiveTimesheet = {
                ..._primitiveTimesheet, records: _primitiveTimesheet.records.map(_record => {
                    if (_record.date == dayString) {
                        return { ..._record, entries: [..._record.entries, _newPrimitiveEntry] }
                    } else {
                        return _record
                    }
                })
            }
        } else {
            const _newPrimitiveRecord: PrimitiveTimesheetRecord = { id: TimesheetRecord.createId(), date: dayString, entries: [_newPrimitiveEntry] }
            _primitiveTimesheet = {
                ..._primitiveTimesheet, records: [..._primitiveTimesheet.records, _newPrimitiveRecord]
            }
        }
        setLocalPrimitiveTimesheet(_primitiveTimesheet);
        setLocalPrimitiveTimesheetEntryErrors([...localPrimitiveTimesheetEntryErrors, { id: _newPrimitiveEntry.id, entryType: defaultErrorObject, locationType: defaultErrorObject, entryPeriodStartTime: defaultErrorObject, entryPeriodFinishTime: defaultErrorObject, breakPeriodStartTime: defaultErrorObject, breakPeriodFinishTime: defaultErrorObject }])
        handleLocalTimesheetUpdate(_primitiveTimesheet);
    }

    const doesPrimitiveTimesheetHaveEntryOnDate = (localPrimitiveTimesheet: PrimitiveTimesheet, dayString: string) => {
        return Timesheet.doesPrimitiveTimesheetHaveEntryOnPrimitiveDate(localPrimitiveTimesheet, dayString)
    }

    const getTotalHoursOnADay = (dayString: string) => {
        const date = new TimesheetDate(dayString)
        const totalHoursInDay = localTimesheet.getTotalHoursOnADay(date);
        return totalHoursInDay.time
    }

    function handleLocalPrimitiveTimesheetDataChange(e: any, day: string, entryId: number, entryItemKey: string) {
        let itemValue = e.target.value;
        if (entryItemKey === 'hasPremium') itemValue = !!e.target.checked
        const updatedLocalPrimitiveTimesheet = {
            ...localPrimitiveTimesheet, records: localPrimitiveTimesheet.records.map((_primitiveRecord) => {
                if (_primitiveRecord.date === day) {
                    return {
                        ..._primitiveRecord, entries: _primitiveRecord.entries.map((_primitiveEntry) => {
                            if (_primitiveEntry.id == entryId) {
                                return { ..._primitiveEntry, [entryItemKey]: itemValue }
                            }
                            return _primitiveEntry
                        })
                    }
                }
                return _primitiveRecord
            })
        }
        setLocalPrimitiveTimesheet(updatedLocalPrimitiveTimesheet);
        handleLocalTimesheetUpdate(updatedLocalPrimitiveTimesheet); //update the normal one along with it
    }

    async function handleLocalTimesheetUpdate(updatedLocalPrimitiveTimesheet: PrimitiveTimesheet) {
        try {
            const updatedLocalTimesheet = await Timesheet.convertPrimitiveToTimesheet(updatedLocalPrimitiveTimesheet, localTimesheet.personnel, localTimesheet.weekEndingDate);
            generateTimesheetEntryErrors(updatedLocalTimesheet)
            setLocalTimesheet(updatedLocalTimesheet)
        } catch (e) {
            console.log(e)
        }
    }

    const generateTimesheetEntryErrors = (_localTimesheet: Timesheet) => {
        let entryErrors: PrimitiveTimesheetEntryError[] = _localTimesheet.generateTimesheetErrors(localPrimitiveTimesheetEntryErrors);
        if (entryErrors.length > 0) setLocalPrimitiveTimesheetEntryErrors(entryErrors);
    }

    const doesTimesheetHaveError = () => {
        return localPrimitiveTimesheetEntryErrors.some((err) => {
            const hasErrors = err.entryType.error || err.entryPeriodStartTime.error || err.entryPeriodFinishTime.error || err.breakPeriodStartTime.error || err.breakPeriodFinishTime.error
            return hasErrors
        })
    }

    const verifyErrorData = (entryId: number, fieldName: string) => {
        try {
            const entryError = localPrimitiveTimesheetEntryErrors.filter(e => e.id == entryId)[0]
            if (entryError) {
                const errorData = entryError[fieldName as keyof PrimitiveTimesheetEntryError] as { error: boolean, message: string }
                return errorData
            } else {
                throw new Error("Entry Error Data Not found")
            }
        } catch (e) {
            console.log(e)
            return { error: false, message: '' }
        }
    }

    function handleEntryDelete(e: any, entryId: number, primitiveDate: string) {
        const _primitiveTimesheet = {
            ...localPrimitiveTimesheet, records: localPrimitiveTimesheet.records.map((_primitiveRecord) => {
                if (_primitiveRecord.date === primitiveDate) return { ..._primitiveRecord, entries: _primitiveRecord.entries.filter((_primitiveEntry) => _primitiveEntry.id !== entryId) }
                return _primitiveRecord
            })
        }
        setLocalPrimitiveTimesheet(_primitiveTimesheet);
        setLocalTimesheet(new Timesheet({
            ...localTimesheet, records: localTimesheet.records.map((_record) => {
                if (_record.date.defaultFormat() === primitiveDate) return new TimesheetRecord({ ..._record, entries: _record.entries.filter((entry) => entry.id !== entryId) })
                return _record
            })
        }))
        setLocalPrimitiveTimesheetEntryErrors(localPrimitiveTimesheetEntryErrors.filter((_entryError) => _entryError.id !== entryId));
        handleLocalTimesheetUpdate(_primitiveTimesheet);
    }

    function handleTimesheetSaveButtonClick(e: any) {
        if (!doesTimesheetHaveError()) {
            handleSaveTimesheet(e, localTimesheet)
        } else {
            handleSaveTimesheet(e, undefined);
        }
    }

    return (
        <div>
            <div className="print:hidden">
                <div className="timesheet-wrapper border p-4">
                    <div className="wrapper-header mb-4">
                        <div className="flex justify-between">
                            <h4 className="rounded text-base font-black text-purple-700">
                                <span>Week </span>
                                <span>{timesheetData.weekNumber} <small className="capitalize">({timesheetData.month})</small></span>
                            </h4>
                            <div className="">
                                <button type="button" className="px-4 py-1.5 bg-green-800 rounded text-sm text-white hover:bg-green-900" onClick={(e) => handleTimesheetSaveButtonClick(e)}>
                                    <span>Save Timesheet</span>
                                </button>
                            </div>
                        </div>
                        <div>
                            <div className="total-hours">
                                <h4><span className="px-1.5 py-1 rounded bg-slate-200 text-xs">Total Hours:</span> <span className="text-xs font-bold">{localTimesheet.totalHourString}</span></h4>
                            </div>
                        </div>
                    </div>
                    {/* Customer and Project Info */}
                    <div className="preview-header-group group-3 flex gap-x-4">
                        <div className="customer-and-site-info flex gap-x-2">
                            <> {/* Customer */}
                                {timesheetData.customer ?
                                    <div className="customer-info-group mb-4">
                                        <p>
                                            <InfoLabel><span className="text-xs">Customer</span></InfoLabel>
                                            <span className="info-value text-xs">{timesheetData.customer.name}</span>
                                        </p>
                                    </div> : ''
                                }
                            </>
                            <> {/* Site */}
                                {timesheetData.site ?
                                    <div className="site-info-group mb-4 ">
                                        <p>
                                            <span className="site-info">
                                                <InfoLabel><span className="text-xs">Site Name</span></InfoLabel>
                                                <span className="info-value text-xs">{timesheetData.site.name}</span>
                                            </span>
                                            <span className="country-info">
                                                <span className="mr-4">,</span>
                                                <InfoLabel><span className="text-xs">Country</span></InfoLabel>
                                                <span className="info-value text-xs">{timesheetData.site.country}</span>
                                            </span>
                                        </p>
                                    </div> : ''
                                }
                            </>
                        </div>
                        <> {/* Project */}
                            {timesheetData.project ?
                                <div className="project-info-group">
                                    <div className="purchase-order-number-group mb-4">

                                        <p className="purchase-order-number-info">
                                            <InfoLabel><span className="text-xs">PO Number</span></InfoLabel>
                                            <span className="info-value text-xs">{timesheetData.project.purchaseOrderNumber}</span>
                                        </p>

                                    </div>
                                    {timesheetData.project.orderNumber ?
                                        <div className="order-number-group mb-4">
                                            <p className="order-number-info">
                                                <InfoLabel><span className="text-xs">Order Number</span></InfoLabel>
                                                <span className="info-value text-xs">{timesheetData.project.orderNumber}</span>
                                            </p>
                                        </div>
                                        : ''}
                                </div>
                                : ''
                            }
                        </>
                    </div>
                    {/* Daily Breakdown */}
                    <div>
                        {daysInCurrentTimesheetWeek.map((date, dayOfTheWeekIndex) =>
                            <div key={date.date}>
                                <div>
                                    <div className={`${date}`}>
                                        <div className={`grid grid-cols-4 items-center px-3 py-2 rounded-md mb-2 ${doesPrimitiveTimesheetHaveEntryOnDate(localPrimitiveTimesheet, date.defaultFormat()) ? 'bg-blue-900' : 'bg-gray-400'}`}>
                                            <div className="date-container gap-x-2">
                                                <div>
                                                    <h4 className="text-xs text-white">
                                                        <span>Date: </span>
                                                        <span>{date.simpleFormat()}</span>
                                                    </h4>
                                                </div>
                                            </div>
                                            <div className="hours-container">
                                                <div>
                                                    {doesPrimitiveTimesheetHaveEntryOnDate(localPrimitiveTimesheet, date.defaultFormat()) ?
                                                        <p className="text-xs text-white">
                                                            <span>Hours: </span>
                                                            <span>{getTotalHoursOnADay(date.defaultFormat())}</span>
                                                        </p> : ''}
                                                </div>
                                            </div>
                                            <div></div>
                                            <div className="action-group justify-self-end">
                                                {date.monthNumber == timesheetData.monthNumber ?
                                                    <div>
                                                        <button className="px-3 py-0.5 border rounded-sm text-xs text-white bg-blue-900" type="button" onClick={(e) => addTimesheetEntry(date.defaultFormat())}>Add +</button>
                                                    </div>
                                                    : ''
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        {doesPrimitiveTimesheetHaveEntryOnDate(localPrimitiveTimesheet, date.defaultFormat()) ?
                                            <div>
                                                <div className="entry-heading grid grid-cols-12 gap-x-1 mb-1">
                                                    <div className="time-type col-span-2">
                                                        <h4 className="text-xs text-gray-600">Time Type</h4>
                                                    </div>
                                                    <div className="location-type">
                                                        <h4 className="text-xs text-gray-600">Location Type</h4>
                                                    </div>
                                                    <div className="premium place-self-center">
                                                        <h4 className="text-xs text-gray-600">Premium</h4>
                                                    </div>
                                                    <div className="start-time">
                                                        <h4 className="text-xs text-gray-600">Start Time</h4>
                                                    </div>
                                                    <div className="finish-time">
                                                        <h4 className="text-xs text-gray-600">Finish Time</h4>
                                                    </div>
                                                    <div className="break-time-start">
                                                        <h4 className="text-xs text-gray-600">Break Start</h4>
                                                    </div>
                                                    <div className="break-time-finish">
                                                        <h4 className="text-xs text-gray-600">Break Finish</h4>
                                                    </div>
                                                    <div className="total-time place-self-center">
                                                        <h4 className="text-xs text-gray-600">Total Time</h4>
                                                    </div>
                                                    <div className="comment col-span-2">
                                                        <h4 className="text-xs text-gray-600">Comment</h4>
                                                    </div>
                                                    <div className="action">
                                                        <h4 className="text-xs text-gray-600"></h4>
                                                    </div>
                                                </div>
                                                {getPrimitiveEntriesForDate(date.defaultFormat()).map((_entry, entryIndex) =>
                                                    <div className="entry-body grid grid-cols-12 gap-x-1.5 mb-2" key={_entry.id}>
                                                        <div className="time-type-edit col-span-2">
                                                            <select name="timeType" id={`time-type-${timesheetData.id}${dayOfTheWeekIndex}-${_entry.id}${entryIndex}`} title="Select Time Type" className={`text-xs p-1 rounded-sm border w-full ${!(verifyErrorData(_entry.id, 'entryType').error) ? 'border-black' : 'border-red-600 focus:outline-red-600'}`} value={_entry.entryTypeSlug} onChange={(e) => handleLocalPrimitiveTimesheetDataChange(e, date.defaultFormat(), _entry.id, 'entryTypeSlug')} >
                                                                <option value="" >Select Time Type</option>
                                                                {defaultTimesheetEntryType.map((entryType, entryTypeIndex) =>
                                                                    <option value={entryType.slug} key={entryTypeIndex}>{entryType.name}</option>
                                                                )}
                                                            </select>
                                                        </div>
                                                        <div className="location-type-edit">
                                                            <select name="locationType" id={`location-type-${timesheetData.id}${dayOfTheWeekIndex}-${_entry.id}${entryIndex}`} title="Select Location Type" className={`w-full text-xs p-1 rounded-sm border ${(_entry.locationType == LocationType.onshore || _entry.locationType == LocationType.offshore) ? 'border-black' : 'border-red-600 focus:outline-red-600'}`} value={_entry.locationType} onChange={(e) => handleLocalPrimitiveTimesheetDataChange(e, date.defaultFormat(), _entry.id, 'locationType')}>
                                                                <option value={LocationType.onshore}>Onshore</option>
                                                                <option value={LocationType.offshore}>Offshore</option>
                                                            </select>
                                                        </div>
                                                        <div className="premium-select place-self-center">
                                                            <input type="checkbox" name="premium" id={`premium-${timesheetData.id}${dayOfTheWeekIndex}-${_entry.id}${entryIndex}`} title="Check Premium" checked={!!_entry.hasPremium} onChange={(e) => handleLocalPrimitiveTimesheetDataChange(e, date.defaultFormat(), _entry.id, 'hasPremium')} className="text-center" />
                                                        </div>
                                                        <div className="start-time-edit">
                                                            <input type="time" name="startTime" id={`start-time-${timesheetData.id}${dayOfTheWeekIndex}-${_entry.id}${entryIndex}`} title="Pick Your Start Time" className={`w-full text-xs p-1 rounded-sm border border-black ${!verifyErrorData(_entry.id, 'entryPeriodStartTime').error ? 'border-black text-black' : 'border-red-600 text-red-600 outline-red-600'}`} value={_entry.entryPeriodStartTime} onChange={(e) => handleLocalPrimitiveTimesheetDataChange(e, date.defaultFormat(), _entry.id, 'entryPeriodStartTime')} step={300} list="entryStartTimePopularHours" />
                                                            <datalist id="entryStartTimePopularHours">
                                                                <option value="06:00"></option>
                                                                <option value="07:00"></option>
                                                                <option value="08:00"></option>
                                                                <option value="09:00"></option>
                                                            </datalist>
                                                        </div>
                                                        <div className="finish-time-edit">
                                                            <input type="time" name="finishTime" id={`finish-time-${timesheetData.id}${dayOfTheWeekIndex}-${_entry.id}${entryIndex}`} title="Pick Your Finish Time" value={_entry.entryPeriodFinishTime} onChange={(e) => handleLocalPrimitiveTimesheetDataChange(e, date.defaultFormat(), _entry.id, 'entryPeriodFinishTime')} className={`w-full text-xs p-1 rounded-sm border ${!verifyErrorData(_entry.id, 'entryPeriodFinishTime').error ? 'border-black text-black' : 'border-red-600 text-red-600 outline-red-600'}`} step="300" list="entryFinishTimePopularHours" />
                                                            <datalist id="entryFinishTimePopularHours">
                                                                <option value="16:00"></option>
                                                                <option value="18:00"></option>
                                                                <option value="19:00"></option>
                                                                <option value="20:00"></option>
                                                                <option value="21:00"></option>
                                                            </datalist>
                                                        </div>
                                                        <div className="break-start-time-edit">
                                                            <input type="time" name="breakStartTime" id={`break-start-time-${timesheetData.id}${dayOfTheWeekIndex}-${_entry.id}${entryIndex}`} title="Pick Your Break Start Time" className={`w-full text-xs p-1 rounded-sm border border-black ${!verifyErrorData(_entry.id, 'breakPeriodStartTime').error ? 'border-black text-black' : 'border-red-600 text-red-600 outline-red-600'}`} value={_entry.breakPeriodStartTime} onChange={(e) => handleLocalPrimitiveTimesheetDataChange(e, date.defaultFormat(), _entry.id, 'breakPeriodStartTime')} step="300" list="breakStartTimePopularHours" />
                                                            <datalist id="breakStartTimePopularHours">
                                                                <option value="11:00"></option>
                                                                <option value="11:30"></option>
                                                                <option value="12:00"></option>
                                                                <option value="12:30"></option>
                                                            </datalist>
                                                            {/* <select name="breakStartTime" id={`break-start-time-${timesheetData.id}${dayOfTheWeekIndex}-${editableEntry.id}${entryIndex}`} title="Pick Your Break Start Time" className={`w-full text-xs p-1 rounded-sm border border-black ${!errorOnBreakStartTime(editableEntry.id) ? 'border-black text-black' : 'border-red-600 text-red-600 outline-red-600'}`} value={editableEntry.breakPeriodStartTime} onChange={(e) => handleLocalPrimitiveTimesheetDataChange(e, editableEntry.id, 'breakPeriodStartTime')} >
                                                        {TimesheetHour.createTimeArray().map((timeString, timeStringIndex) =>
                                                            <option value={timeString} key={timeString}>{timeString}</option>
                                                        )}
                                                    </select> */}

                                                        </div>
                                                        <div className="break-finish-time-edit">
                                                            <input type="time" name="breakFinishTime" id={`break-finish-time-${timesheetData.id}${dayOfTheWeekIndex}-${_entry.id}${entryIndex}`} title="Pick Your Break Finish Time" className={`w-full text-xs p-1 rounded-sm border ${!verifyErrorData(_entry.id, 'breakPeriodFinishTime').error ? 'border-black text-black' : 'border-red-600 text-red-600 outline-red-600'}`} value={_entry.breakPeriodFinishTime} onChange={(e) => handleLocalPrimitiveTimesheetDataChange(e, date.defaultFormat(), _entry.id, 'breakPeriodFinishTime')} step="300" list="breakFinishTimePopularHours" />
                                                            <datalist id="breakFinishTimePopularHours">
                                                                <option value="12:00"></option>
                                                                <option value="12:30"></option>
                                                                <option value="13:00"></option>
                                                                <option value="13:30"></option>
                                                            </datalist>
                                                        </div>
                                                        <div className="total-time place-self-center">
                                                            <span className="text-xs border-b border-black p-1">
                                                                {getEntryTotalTime(_entry.id, date.defaultFormat())}
                                                            </span>
                                                        </div>
                                                        <div className="comment-edit col-span-2">
                                                            <input type="text" name="comment" id={`comment-${timesheetData.id}${dayOfTheWeekIndex}-${_entry.id}${entryIndex}`} title="Type Your Comment" className="w-full text-xs p-1 rounded-sm border border-black" value={_entry.comment} onChange={(e) => handleLocalPrimitiveTimesheetDataChange(e, date.defaultFormat(), _entry.id, 'comment')} />
                                                        </div>
                                                        <div className="action-list">
                                                            <div className="flex gap-x-1 justify-end">
                                                                <button type="button" title="Duplicate Entry" className="hidden">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                                                                    </svg>
                                                                </button>
                                                                <button type="button" title="Delete Entry" className="p-0.5 text-red-700" onClick={(e) => handleEntryDelete(e, _entry.id, date.defaultFormat())}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                                    </svg>
                                                                </button>

                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div> :
                                            <div className="py-2 px-4 rounded-sm bg-slate-100">
                                                <p className="text-xs italic text-center text-gray-600">No Entry for Date</p>
                                            </div>}

                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="timesheet-footer mt-4">
                        <TimesheetExportUI timesheet={timesheetData} />
                    </div>
                </div>
            </div>
        </div>
    )
}