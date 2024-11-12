'use client'
import { TimesheetDate } from "@/lib/services/timesheet/timesheetDate"
import { TimesheetEntryError } from "@/lib/types/primitive"
import { useEffect, useState } from "react"
import EntryEditView from "./EntryEditView"
import { TimesheetEntry } from "@/lib/services/timesheet/timesheetEntry"
import { LocationType, OptionLabel } from "@/lib/constants/constant"
import { TimesheetRecord } from "@/lib/services/timesheet/timesheetRecord"
import { TimesheetEntryPeriod } from "@/lib/services/timesheet/timesheetEntryPeriod"
import { TimesheetRecordOption } from "@/lib/types/timesheet"

type ManageRecordViewProps = {
    record: TimesheetRecord | undefined,
    uiElementId: string,
    date: TimesheetDate,
    canAddEntry: Boolean,
    updateRecordInTimesheet: Function,
    updateRecordErrorState: Function,
    duplicateRecord: Function,
}

export default function ManageRecordView({ record, uiElementId, date, canAddEntry, updateRecordInTimesheet, updateRecordErrorState, duplicateRecord }: ManageRecordViewProps) {

    const defaultErrorObject = { error: false, message: "" }

    const _initialLocalEntryErrors: TimesheetEntryError[] = []
    const [entryErrorsInRecord, setEntryErrorsInRecord] = useState(_initialLocalEntryErrors);
    const [showRecordDuplicateOption, setShowRecordDuplicateOption] = useState(false);
    const [recordDuplicateDestination, setRecordDuplicateDestination] = useState([] as string[]);
    const [showRecordOptionsDropdown, setShowRecordOptionsDropdown] = useState(false);

    useEffect(() => {
        const initializer = () => {
            const _initialLocalEntryErrors: TimesheetEntryError[] = record && record.entries && record.entries.length > 0 ? record.entries.map((_entry) => {
                return addNewEntryError(_entry.id)
            }) : [];
            setEntryErrorsInRecord(_initialLocalEntryErrors);
        }
        initializer();
    }, []);

    const doesRecordHaveEntries = (record: TimesheetRecord | undefined) => {
        if (!record || !record.entries.some((_entry) => record.date.isDateSame(_entry.date))) return false
        return true
    }

    const getTotalHoursForRecord = () => {
        if (record) return record.totalHoursInString;
        return '00:00'
    }

    const addNewEntry = (dayString: string) => {
        const _newEntry: TimesheetEntry = new TimesheetEntry({ id: TimesheetEntry.createId(), date: new TimesheetDate(dayString), entryType: { slug: '', name: '' }, hasPremium: false, entryPeriod: new TimesheetEntryPeriod({}), locationType: LocationType.onshore, comment: '' });
        let _record: TimesheetRecord;

        if (doesRecordHaveEntries(record) && record?.entries) {
            _record = new TimesheetRecord({ ...record, entries: [...record?.entries, _newEntry] })
        } else {
            _record = new TimesheetRecord({ id: TimesheetRecord.createId(), date: new TimesheetDate(dayString), entries: [_newEntry] })
        }
        updateRecordInTimesheet(_record);
        const _updatedEntryErrors = [...entryErrorsInRecord, addNewEntryError(_newEntry.id)]
        setEntryErrorsInRecord(_updatedEntryErrors)
        checkForEntryErrors(_record, _updatedEntryErrors)
    }

    const addNewEntryError = (entryId: number) => {
        return { id: entryId, entryType: defaultErrorObject, locationType: defaultErrorObject, entryPeriodStartTime: defaultErrorObject, entryPeriodFinishTime: defaultErrorObject, breakPeriodStartTime: defaultErrorObject, breakPeriodFinishTime: defaultErrorObject } as TimesheetEntryError
    }

    const handleUpdateEntryInRecord = (entry: TimesheetEntry) => {
        if (record) {
            const doesEntryExistInRecord = record.entries.some(_entry => _entry.id === entry.id)
            let _updatedRecord: TimesheetRecord;
            if (doesEntryExistInRecord) {
                // update the record
                _updatedRecord = new TimesheetRecord({
                    ...record, entries: record.entries.map((_entry) => {
                        if (_entry.id === entry.id) return entry
                        else return _entry
                    })
                })
            } else {
                // add entry
                _updatedRecord = new TimesheetRecord({ ...record, entries: [...record.entries, entry] })
            }
            updateRecordInTimesheet(_updatedRecord);
            checkForEntryErrors(_updatedRecord, entryErrorsInRecord);
        }
    }

    function handleEntryDelete(entryId: number) {
        if (record) {
            const _updatedRecord = new TimesheetRecord({ ...record, entries: record.entries.filter((_entry) => _entry.id !== entryId) })
            updateRecordInTimesheet(_updatedRecord);
            const _updatedEntryErrors = entryErrorsInRecord.filter((_error) => _error.id !== entryId)
            setEntryErrorsInRecord(_updatedEntryErrors)
            checkForEntryErrors(_updatedRecord, _updatedEntryErrors)
        }
    }

    const getEntryError = (entryId: number) => {
        if (entryErrorsInRecord && entryErrorsInRecord.length > 0)
            return entryErrorsInRecord.filter(e => e.id === entryId)[0]
    }

    const checkForEntryErrors = (record: TimesheetRecord, entryErrorsInRecord: TimesheetEntryError[]) => {
        let entryErrors: TimesheetEntryError[] = TimesheetRecord.cheeckForErrorsInRecord(record, entryErrorsInRecord);
        if (entryErrors.length > 0) {
            setEntryErrorsInRecord(entryErrors);
            updateRecordErrorState(doesRecordHaveErrors(entryErrors))
        }

    }

    const doesRecordHaveErrors = (entryErrorsInRecord: TimesheetEntryError[]) => {
        return entryErrorsInRecord.some((err) => {
            const hasErrors = err.entryType.error || err.entryPeriodStartTime.error || err.entryPeriodFinishTime.error || err.breakPeriodStartTime.error || err.breakPeriodFinishTime.error
            return hasErrors
        })
    }

    const canRecordMakeCopies = () => {
        try {
            if (record) return (record.hasEntry())
        } catch (e) { }
        return false
    }

    const getOtherDaysInTheWeek = () => {
        if (date) {
            let daysOfTheWeek = TimesheetDate.daysOfTheWeek;
            let everyOtherDayInTheWeek = daysOfTheWeek.filter((_day) => _day !== daysOfTheWeek[date.weekday])
            return everyOtherDayInTheWeek;
        } else return []
    }

    const handleRecordDuplication = () => {
        setShowRecordDuplicateOption(false)
        duplicateRecord(record, recordDuplicateDestination)
        setRecordDuplicateDestination([])
    }

    const isColaRequired = () => {
        return record && record?.options ? record?.options?.some((_option) => _option.key == OptionLabel.isColaRequired && _option.value) : false
    }

    const isPublicHoliday = () => {
        return record && record.options ? record.options.some((_option) => _option.key == OptionLabel.isPublicHoliday && _option.value) : false
    }

    const handleColaOptionToggle = (e: any) => {
        const colaOption = !!e.target.checked
        if (record) {
            const recordHasColaOption = record.options ? record.options.some((_option) => _option.key == OptionLabel.isColaRequired) : false
            let _recordOptions: TimesheetRecordOption[] = []
            if (record && record.options) _recordOptions = record.options

            if (recordHasColaOption) {
                _recordOptions = _recordOptions.map((_option) => {
                    if (_option.key == OptionLabel.isColaRequired) {
                        return { key: _option.key, value: colaOption }
                    } else return _option
                })
            } else {
                _recordOptions = [..._recordOptions, { key: OptionLabel.isColaRequired, value: colaOption }]
            }
            const _updatedRecord = new TimesheetRecord({ ...record, options: _recordOptions })
            updateRecordInTimesheet(_updatedRecord);
        }
    }

    const handlePublicHolidayOptionToggle = (e: any) => {
        const publicHolidayOption = !!e.target.checked
        if (record) {
            const recordHasPublicHolidayOption = record.options ? record.options.some((_option) => _option.key == OptionLabel.isPublicHoliday) : false
            let _recordOptions: TimesheetRecordOption[] = []
            if (record && record.options) _recordOptions = record.options

            if (recordHasPublicHolidayOption) {
                _recordOptions = _recordOptions.map((_option) => {
                    if (_option.key == OptionLabel.isPublicHoliday) {
                        return { key: _option.key, value: publicHolidayOption }
                    } else return _option
                })
            } else {
                _recordOptions = [..._recordOptions, { key: OptionLabel.isPublicHoliday, value: publicHolidayOption }]
            }
            const _updatedRecord = new TimesheetRecord({ ...record, options: _recordOptions })
            updateRecordInTimesheet(_updatedRecord);
        }
    }

    return (
        <div>
            <div className={``}>
                <div className={`grid grid-cols-4 items-center px-3 py-2 rounded-md mb-2 ${doesRecordHaveEntries(record) ? 'bg-blue-900' : 'bg-gray-400'}`}>
                    <div className="date-container gap-x-2">
                        <div>
                            <h4 className="text-xs text-white">
                                <span>Date: </span>
                                <span>{date.simpleFormat()}</span>
                            </h4>
                        </div>
                    </div>
                    <div>{/* record hours */}{doesRecordHaveEntries(record) ?
                        <div className="hours-container">
                            <div>
                                <p className="text-xs text-white">
                                    <span>Hours: </span>
                                    <span>{getTotalHoursForRecord()}</span>
                                </p>
                            </div>
                        </div> : ''
                    }</div>
                    <div></div>
                    <div className="action-group justify-self-end">
                        <div className="flex gap-x-2">
                            <div className="">
                                <button type="button" className="text-white" onClick={() => setShowRecordOptionsDropdown(!showRecordOptionsDropdown)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                    </svg>
                                </button>

                                <div className="record-options-dropdown relative w-full">
                                    {/* Dropdown menu  */}
                                    <div id="dropdownEntryOptions" className={`z-10 ${showRecordOptionsDropdown ? '' : 'hidden'} w-48 absolute right-0 -top-2 bg-white rounded-lg shadow dark:bg-gray-700`}>
                                        <ul className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="entryOptionDropdownButton">
                                            <li className="mb-6">
                                                <h4 className="font-bold underline text-blue-100">Record Options</h4>
                                            </li>
                                            <li >
                                                <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                                    <input id={`public-holiday-${uiElementId}`} type="checkbox" value='cola' className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" checked={isPublicHoliday()} onChange={(e) => { handlePublicHolidayOptionToggle(e) }} />
                                                    <label htmlFor={`public-holiday-${uiElementId}`} className="w-full ms-2 text-xs font-medium text-gray-900 rounded dark:text-gray-300 capitalize">Public Holiday?</label>
                                                </div>
                                            </li>
                                            <li >
                                                <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                                    <input id={`cola-required-${uiElementId}`} type="checkbox" value='cola' className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" checked={isColaRequired()} onChange={(e) => { handleColaOptionToggle(e) }} />
                                                    <label htmlFor={`cola-required-${uiElementId}`} className="w-full ms-2 text-xs font-medium text-gray-900 rounded dark:text-gray-300 capitalize">Is COLA Required?</label>
                                                </div>
                                            </li>

                                            <li className="hidden">
                                                <div className="flex gap-x-2">
                                                    <button className="px-3 py-1 rounded text-xs bg-red-700" onClick={() => { }}>Cancel</button>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>

                                </div>
                            </div>
                            <>{canRecordMakeCopies() ?
                                <div className="flex items-center">
                                    <button type="button" className="px-3 text-xs text-white" id="duplicateRecordDropdownButton" data-dropdown-toggle="dropdownDuplicate" onClick={() => setShowRecordDuplicateOption(!showRecordDuplicateOption)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                                        </svg>
                                    </button>
                                    <div className="duplicate-dropdown relative w-full">
                                        {/* Dropdown menu  */}
                                        <div id="dropdownDuplicate" className={`z-10 ${showRecordDuplicateOption ? '' : 'hidden'} w-48 absolute right-0 top-4 bg-white rounded-lg shadow dark:bg-gray-700`}>
                                            <ul className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="duplicateRecordDropdownButton">
                                                <li>
                                                    <h4 className="font-bold underline text-blue-100">Duplicate Record</h4>
                                                </li>
                                                {getOtherDaysInTheWeek().map((_day) =>
                                                    <li key={_day}>
                                                        <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                                            <input id={`duplicateable-day-${uiElementId}-${_day}`} type="checkbox" value={_day} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                                onChange={(e) => { setRecordDuplicateDestination(e.target.checked ? [...recordDuplicateDestination, e.target.value] : recordDuplicateDestination.filter(d => d !== e.target.value)) }} />
                                                            <label htmlFor={`duplicateable-day-${uiElementId}-${_day}`} className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300 capitalize">{_day}</label>
                                                        </div>
                                                    </li>
                                                )}
                                                <li>
                                                    <div className="flex gap-x-1">
                                                        <button className="px-3 py-1 rounded text-xs bg-blue-700 hover:bg-blue-500" onClick={() => handleRecordDuplication()}>Duplicate</button>
                                                        <button className="px-3 py-1 rounded text-xs bg-transparent" onClick={() => setShowRecordDuplicateOption(false)}>Cancel</button>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>

                                    </div>
                                </div> : ''
                            }</>
                            <>{canAddEntry ?
                                <div className="flex items-center">
                                    <button className="px-3 rounded-sm text-xs text-white" type="button" onClick={(e) => addNewEntry(date.defaultFormat())}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>

                                    </button>
                                </div>
                                : ''
                            }</>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-3">
                <>{doesRecordHaveEntries(record) ?
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
                        <div>{record?.entries.map((_entry, _entryIndex) =>
                            <EntryEditView
                                key={_entry.id}
                                entry={_entry}
                                uiElementId={`${uiElementId}-${_entry.id}${_entryIndex}`}
                                updateEntryInRecord={(entry: TimesheetEntry) => handleUpdateEntryInRecord(entry)}
                                deleteEntryInRecord={(entryId: number) => handleEntryDelete(entryId)}
                                entryError={getEntryError(_entry.id)} />
                        )}</div>
                    </div> :
                    <div className="py-2 px-4 rounded-sm bg-slate-100">
                        <p className="text-xs italic text-center text-gray-600">No Entry for Date</p>
                    </div>
                }</>

            </div>
        </div>
    )
}