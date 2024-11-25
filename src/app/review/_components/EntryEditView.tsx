'use client'
import { LocationType, OptionLabel, ReportType } from "@/lib/constants/constant"
import { defaultTimesheetEntryType } from "@/lib/constants/default"
import { TimesheetEntry } from "@/lib/services/timesheet/timesheetEntry"
import { TimesheetEntryPeriod } from "@/lib/services/timesheet/timesheetEntryPeriod"
import { TimesheetHour } from "@/lib/services/timesheet/timesheetHour"
import { TimesheetEntryError, TimesheetEntryOption } from "@/lib/types/timesheet"
import { useEffect, useState } from "react"

type EntryEditViewProps = {
    entry: TimesheetEntry,
    uiElementId: string,
    updateEntryInRecord: Function,
    deleteEntryInRecord: Function,
    entryError: TimesheetEntryError | undefined
}

export default function EntryEditView({ entry, uiElementId, updateEntryInRecord, deleteEntryInRecord, entryError }: EntryEditViewProps) {

    const timeSuggestion = {
        startTime: ["06:00", "07:00", "08:00", "09:00"],
        finishTime: ["16:00", "17:00", "18:00", "19:00", "20:00", "21:00"],
        breakStartTime: ["11:00", "11:30", "12:00", "12:30", "13:00"],
        breakFinishTime: ["12:00", "12:30", "13:00", "13:30", "14:00"],
    }

    const [showEntryOptionsDropdown, setShowEntryOptionsDropdown] = useState(false)

    useEffect(() => {
    }, []);

    const handleEntryTypeChange = (e: any) => {
        const _entryTypeSlug = e.target.value
        const _entryType = defaultTimesheetEntryType.filter((_entryType) => _entryType.slug === _entryTypeSlug)[0];
        const _updatedLocalEntry = new TimesheetEntry({ ...entry, entryType: _entryType })
        updateEntryInRecord(_updatedLocalEntry)
    }

    const handleLocationTypeChange = (e: any) => {
        const _locationType = e.target.value
        const _updatedLocalEntry = new TimesheetEntry({ ...entry, locationType: _locationType })
        updateEntryInRecord(_updatedLocalEntry)
    }

    const handleHasPremiumCheck = (e: any) => {
        const _hasPremium: boolean = !!e.target.checked
        const _updatedLocalEntry = new TimesheetEntry({ ...entry, hasPremium: _hasPremium })
        updateEntryInRecord(_updatedLocalEntry)
    }

    const handleEntryStartTimeChange = (e: any) => {
        const _entryStartTimeString: string = e.target.value
        let _entryStartTime: TimesheetHour | undefined
        try {
            _entryStartTime = new TimesheetHour(_entryStartTimeString)
        } catch (e) { }
        const _entryPeriod = new TimesheetEntryPeriod({ ...entry.entryPeriod, startTime: _entryStartTime });
        const _updatedLocalEntry = new TimesheetEntry({ ...entry, entryPeriod: _entryPeriod })
        updateEntryInRecord(_updatedLocalEntry)
    }

    const handleEntryFinishTimeChange = (e: any) => {
        const _entryFinishTimeString: string = e.target.value
        const _entryFinishTime: TimesheetHour = new TimesheetHour(_entryFinishTimeString)
        const _entryPeriod = new TimesheetEntryPeriod({ ...entry.entryPeriod, finishTime: _entryFinishTime });
        const _updatedLocalEntry = new TimesheetEntry({ ...entry, entryPeriod: _entryPeriod })
        updateEntryInRecord(_updatedLocalEntry)
    }

    const handleBreakStartTimeChange = (e: any) => {
        const _breakStartTimeString: string = e.target.value
        const _breakStartTime: TimesheetHour = new TimesheetHour(_breakStartTimeString)
        const _entryPeriod = new TimesheetEntryPeriod({ ...entry.entryPeriod, breakTimeStart: _breakStartTime });
        const _updatedLocalEntry = new TimesheetEntry({ ...entry, entryPeriod: _entryPeriod })
        updateEntryInRecord(_updatedLocalEntry)
    }

    const handleBreakFinishTimeChange = (e: any) => {
        const _breakFinishTimeString: string = e.target.value
        const _breakFinishTime: TimesheetHour = new TimesheetHour(_breakFinishTimeString)
        const _entryPeriod = new TimesheetEntryPeriod({ ...entry.entryPeriod, finishTime: _breakFinishTime });
        const _updatedLocalEntry = new TimesheetEntry({ ...entry, entryPeriod: _entryPeriod })
        updateEntryInRecord(_updatedLocalEntry)
    }

    const handleCommentChange = (e: any) => {
        const _comment: string = e.target.value
        const _updatedLocalEntry = new TimesheetEntry({ ...entry, comment: _comment })
        updateEntryInRecord(_updatedLocalEntry)
    }

    const handleExclusionOptionChange = (e: any) => {
        const _optionKey = e.target.value
        let _entryOptions: TimesheetEntryOption[] = [];
        if (entry.options) _entryOptions = [...entry.options]
        const entryHasExclusionOption = _entryOptions.some((_option) => _option.key == OptionLabel.excludeEntryFromReport)
        let _updatedLocalEntry: TimesheetEntry;
        if (!!e.target.checked) {
            // add
            if (entryHasExclusionOption) {
                _entryOptions = _entryOptions.map((_option) => {
                    if (_option.key == OptionLabel.excludeEntryFromReport) {
                        return { key: _option.key, value: [..._option.value, _optionKey] }
                    } else return _option
                })
            } else {
                _entryOptions = [..._entryOptions, { key: OptionLabel.excludeEntryFromReport, value: [_optionKey] }]
            }
            _updatedLocalEntry = new TimesheetEntry({ ...entry, options: _entryOptions })
        } else {
            // remove
            if (entryHasExclusionOption) {
                _entryOptions = _entryOptions.map((_option) => {
                    if (_option.key == OptionLabel.excludeEntryFromReport) {
                        return { key: _option.key, value: _option.value.filter((_val: string) => _val !== _optionKey) }
                    } else return _option
                })
            } else {
                _entryOptions = [..._entryOptions]
            }
            _updatedLocalEntry = new TimesheetEntry({ ...entry, options: _entryOptions })
        }

        updateEntryInRecord(_updatedLocalEntry)
    }

    const totalHoursInEntry = () => {
        try {
            const _totalHoursInString = entry.totalHoursInString;
            return _totalHoursInString
        } catch (e) { }
        return "00:00"
    }

    const verifyErrorData = (fieldName: string) => {
        try {
            if (entryError) {
                const errorData = entryError[fieldName as keyof TimesheetEntryError] as { error: boolean, message: string }
                return errorData
            } else {
                throw new Error("Entry Error Data Not found")
            }
        } catch (e) {
            return { error: false, message: '' }
        }
        return { error: false, message: '' }
    }

    function handleEntryDelete(e: any, entryId: number | string) {
        deleteEntryInRecord(entryId);
    }

    return (
        <div className="entry-body grid grid-cols-12 gap-x-1.5 mb-4" key={entry.id}>
            <div className="time-type-edit col-span-2">
                <select
                    name="timeType"
                    id={`time-type-${uiElementId}`}
                    title="Select Time Type"
                    className={`text-xs p-1 rounded-sm border w-full ${!(entryError && entryError.entryType && entryError.entryType.error) ? 'border-black ' : 'border-red-600 focus:outline-red-600'}`}
                    value={entry.entryType.slug}
                    onChange={(e) => handleEntryTypeChange(e)} >
                    <option value="" >Select Time Type</option>
                    {defaultTimesheetEntryType.map((entryType, entryTypeIndex) =>
                        <option value={entryType.slug} key={entryTypeIndex}>{entryType.name}</option>
                    )}
                </select>
                <>{entryError && entryError.entryType && entryError.entryType.error ?
                    <div className="w-full relative">
                        <div className="error-display absolute w-full" title={entryError.entryType.message}>
                            <p className="text-red-600 text-[8px] font-medium">{entryError.entryType.message}</p>
                        </div>
                    </div>
                    : ''
                }</>
            </div>
            <div className="location-type-edit">
                <select
                    name="locationType"
                    id={`location-type-${uiElementId}`}
                    title="Select Location Type"
                    className={`w-full text-xs p-1 rounded-sm border ${(entry.locationType == LocationType.onshore || entry.locationType == LocationType.offshore) ? 'border-black' : 'border-red-600 focus:outline-red-600'}`}
                    value={entry.locationType}
                    onChange={(e) => handleLocationTypeChange(e)}>
                    <option value={LocationType.onshore}>Onshore</option>
                    <option value={LocationType.offshore}>Offshore</option>
                </select>
                <>{!(entry.locationType == LocationType.onshore || entry.locationType == LocationType.offshore) ?
                    <div className="w-full relative">
                        <div className="error-display absolute w-full" title="Invalid Location Type">
                            <p className="text-red-600 text-[8px] font-medium text-ellipsis overflow-hidden whitespace-nowrap">Invalid Location Type</p>
                        </div>
                    </div> : ''
                }</>
            </div>
            <div className="premium-select place-self-center">
                <input
                    type="checkbox"
                    name="premium"
                    id={`premium-${uiElementId}`}
                    title="Check Premium"
                    checked={!!entry.hasPremium} onChange={(e) => handleHasPremiumCheck(e)}
                    className="text-center" />
            </div>
            <div className="start-time-edit">
                <input
                    type="time"
                    name="startTime"
                    id={`start-time-${uiElementId}`}
                    title="Pick Your Start Time"
                    className={`w-full text-xs p-1 rounded-sm border border-black ${!(entryError && entryError.entryPeriodStartTime && entryError.entryPeriodStartTime.error) ? 'border-black text-black' : 'border-red-600 text-red-600 outline-red-600'}`}
                    value={entry.entryPeriodStartTime}
                    onChange={(e) => handleEntryStartTimeChange(e)}
                    step={300}
                    list="entryStartTimePopularHours" />
                <datalist id="entryStartTimePopularHours">
                    {timeSuggestion.startTime.map((_time) =>
                        <option key={_time} value={_time}></option>
                    )}
                </datalist>
                <>{entryError && entryError.entryPeriodStartTime && entryError.entryPeriodStartTime.error ?
                    <div className="w-full relative">
                        <div className="error-display absolute w-full" title={entryError.entryPeriodStartTime.message}>
                            <p className="text-red-600 text-[8px] w-full whitespace-nowrap font-medium text-ellipsis overflow-hidden">{entryError.entryPeriodStartTime.message}</p>
                        </div>
                    </div>

                    : ''
                }</>
            </div>
            <div className="finish-time-edit">
                <input
                    type="time"
                    name="finishTime"
                    id={`finish-time-${uiElementId}`}
                    title="Pick Your Finish Time"
                    value={entry.entryPeriodFinishTime}
                    onChange={(e) => handleEntryFinishTimeChange(e)}
                    className={`w-full text-xs p-1 rounded-sm border ${!(entryError && entryError.entryPeriodFinishTime && entryError.entryPeriodFinishTime.error) ? 'border-black text-black' : 'border-red-600 text-red-600 outline-red-600'}`}
                    step="300"
                    list="entryFinishTimePopularHours" />

                <datalist id="entryFinishTimePopularHours">
                    {timeSuggestion.finishTime.map((_time) =>
                        <option key={_time} value={_time}></option>
                    )}
                </datalist>
                <>{entryError && entryError.entryPeriodFinishTime && entryError.entryPeriodFinishTime.error ?
                    <div className="w-full relative">
                        <div className="error-display absolute w-full" title={entryError.entryPeriodFinishTime.message}>
                            <p className="text-red-600 text-[8px] font-medium w-full whitespace-nowrap text-ellipsis overflow-hidden">{entryError.entryPeriodFinishTime.message}</p>
                        </div>
                    </div>

                    : ''
                }</>
            </div>
            <div className="break-start-time-edit">
                <input
                    type="time"
                    name="breakStartTime"
                    id={`break-start-time-${uiElementId}`}
                    title="Pick Your Break Start Time"
                    className={`w-full text-xs p-1 rounded-sm border border-black ${!(entryError && entryError.breakPeriodStartTime && entryError.breakPeriodStartTime.error) ? 'border-black text-black' : 'border-red-600 text-red-600 outline-red-600'}`}
                    value={entry.breakPeriodStartTime}
                    onChange={(e) => handleBreakStartTimeChange(e)}
                    step="300"
                    list="breakStartTimePopularHours" />

                <datalist id="breakStartTimePopularHours">
                    {timeSuggestion.breakStartTime.map((_time) =>
                        <option key={_time} value={_time}></option>
                    )}
                </datalist>
                <>{entryError && entryError.breakPeriodStartTime && entryError.breakPeriodStartTime.error ?
                    <div className="w-full relative">
                        <div className="error-display absolute w-full" title={entryError.breakPeriodStartTime.message}>
                            <p className="text-red-600 text-[8px] w-full whitespace-nowrap font-medium text-ellipsis overflow-hidden">{entryError.breakPeriodStartTime.message}</p>
                        </div>
                    </div>
                    : ''
                }</>
            </div>
            <div className="break-finish-time-edit">
                <input
                    type="time"
                    name="breakFinishTime"
                    id={`break-finish-time-${uiElementId}`}
                    title="Pick Your Break Finish Time"
                    className={`w-full text-xs p-1 rounded-sm border ${!verifyErrorData('breakPeriodFinishTime').error ? 'border-black text-black' : 'border-red-600 text-red-600 outline-red-600'}`}
                    value={entry.breakPeriodFinishTime}
                    onChange={(e) => handleBreakFinishTimeChange(e)}
                    step="300"
                    list="breakFinishTimePopularHours" />

                <datalist id="breakFinishTimePopularHours">
                    {timeSuggestion.breakFinishTime.map((_time) =>
                        <option key={_time} value={_time}></option>
                    )}
                </datalist>
                <>{entryError && entryError.breakPeriodFinishTime && entryError.breakPeriodFinishTime.error ?
                    <div className="w-full relative">
                        <div className="error-display absolute w-full" title={entryError.breakPeriodFinishTime.message}>
                            <p className="text-red-600 text-[8px] font-medium w-full whitespace-nowrap  text-ellipsis overflow-hidden">{entryError.breakPeriodFinishTime.message}</p>
                        </div>
                    </div>
                    : ''
                }</>
            </div>
            <div className="total-time place-self-center">
                <span className="text-xs border-b border-black p-1">
                    {totalHoursInEntry()}
                </span>
            </div>
            <div className="comment-edit col-span-2">
                <input
                    type="text"
                    name="comment"
                    id={`comment-${uiElementId}`} title="Type Your Comment" className="w-full text-xs p-1 rounded-sm border border-black" value={entry.comment} onChange={(e) => handleCommentChange(e)} />
            </div>
            <div className="action-list">
                <div className="flex gap-x-1 justify-end">
                    <div className="">
                        <button type="button" onClick={() => setShowEntryOptionsDropdown(!showEntryOptionsDropdown)} title="Entry Options">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                            </svg>
                        </button>

                        <div className="entry-options-dropdown relative w-full">
                            {/* Dropdown menu  */}
                            <div id="dropdownEntryOptions" className={`z-10 ${showEntryOptionsDropdown ? '' : 'hidden'} w-48 absolute right-0 -top-2 bg-white rounded-lg shadow dark:bg-gray-700`}>
                                <ul className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="entryOptionDropdownButton">
                                    <li className="mb-6">
                                        <h4 className="font-bold underline text-blue-100">Entry Options</h4>
                                    </li>
                                    <li className="mb-2">
                                        <p className="text-xs italic text-slate-300">Exclude Entry</p>
                                    </li>
                                    {Object.keys(ReportType).map((_key) =>
                                        <li key={_key}>
                                            <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                                <input id={`entry-option-${uiElementId}-${_key}`} type="checkbox" value={_key} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" checked={TimesheetEntry.isExcludedFromReport(entry, _key)}
                                                    onChange={(e) => { handleExclusionOptionChange(e) }} />
                                                <label htmlFor={`entry-option-${uiElementId}-${_key}`} className="w-full ms-2 text-xs font-medium text-gray-900 rounded dark:text-gray-300 capitalize">{_key} Report</label>
                                            </div>
                                        </li>
                                    )}
                                    <li>
                                        <div className="flex gap-x-2">
                                            <button className="px-3 py-1 rounded text-xs bg-red-700" onClick={() => { setShowEntryOptionsDropdown(false) }}>Cancel</button>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>
                    <button type="button" title="Duplicate Entry" className="">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                        </svg>
                    </button>

                    <button type="button" title="Delete Entry" className="p-0.5 text-red-700" onClick={(e) => handleEntryDelete(e, entry.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    </button>

                </div>
            </div>
        </div>)
}