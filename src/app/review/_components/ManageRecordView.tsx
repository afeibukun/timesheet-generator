import { TimesheetDate } from "@/lib/services/timesheet/timesheetDate"
import { TimesheetEntryError } from "@/lib/types/primitive"
import { useEffect, useState } from "react"
import EntryEditView from "./EntryEditView"
import { TimesheetEntry } from "@/lib/services/timesheet/timesheetEntry"
import { LocationType } from "@/lib/constants/constant"
import { TimesheetRecord } from "@/lib/services/timesheet/timesheetRecord"
import { TimesheetEntryPeriod } from "@/lib/services/timesheet/timesheetEntryPeriod"

type ManageRecordViewProps = {
    record: TimesheetRecord,
    uiElementId: string,
    date: TimesheetDate,
    canAddEntry: Boolean,
    updateRecordInTimesheet: Function,
    updateRecordErrorState: Function
}

export default function ManageRecordView({ record, uiElementId, date, canAddEntry, updateRecordInTimesheet, updateRecordErrorState }: ManageRecordViewProps) {

    const [localRecord, setLocalRecord] = useState(record);

    const defaultErrorObject = { error: false, message: "" }

    const _initialLocalEntryErrors: TimesheetEntryError[] = []
    const [entryErrorsInRecord, setEntryErrorsInRecord] = useState(_initialLocalEntryErrors);

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
        if (localRecord) return localRecord.totalHoursInString;
        return '00:00'
    }

    const addNewEntry = (dayString: string) => {
        const _newEntry: TimesheetEntry = new TimesheetEntry({ id: TimesheetEntry.createId(), date: new TimesheetDate(dayString), entryType: { slug: '', name: '' }, hasPremium: false, entryPeriod: new TimesheetEntryPeriod({}), locationType: LocationType.onshore, comment: '' });
        let _record: TimesheetRecord;

        if (doesRecordHaveEntries(localRecord) && localRecord?.entries) {
            _record = new TimesheetRecord({ ...localRecord, entries: [...localRecord?.entries, _newEntry] })
        } else {
            _record = new TimesheetRecord({ id: TimesheetRecord.createId(), date: new TimesheetDate(dayString), entries: [_newEntry] })
        }
        setLocalRecord(_record);
        updateRecordInTimesheet(_record);
        const _updatedEntryErrors = [...entryErrorsInRecord, addNewEntryError(_newEntry.id)]
        setEntryErrorsInRecord(_updatedEntryErrors)
        checkForEntryErrors(_record, _updatedEntryErrors)
    }

    const addNewEntryError = (entryId: number) => {
        return { id: entryId, entryType: defaultErrorObject, locationType: defaultErrorObject, entryPeriodStartTime: defaultErrorObject, entryPeriodFinishTime: defaultErrorObject, breakPeriodStartTime: defaultErrorObject, breakPeriodFinishTime: defaultErrorObject } as TimesheetEntryError
    }

    const handleUpdateEntryInRecord = (entry: TimesheetEntry) => {
        if (localRecord) {
            const doesEntryExistInLocalRecord = localRecord.entries.some(_entry => _entry.id === entry.id)
            let _updatedLocalRecord: TimesheetRecord;
            if (doesEntryExistInLocalRecord) {
                // update the record
                _updatedLocalRecord = new TimesheetRecord({
                    ...localRecord, entries: localRecord.entries.map((_entry) => {
                        if (_entry.id === entry.id) return entry
                        else return _entry
                    })
                })
            } else {
                // add entry
                _updatedLocalRecord = new TimesheetRecord({ ...localRecord, entries: [...localRecord.entries, entry] })
            }
            setLocalRecord(_updatedLocalRecord);
            updateRecordInTimesheet(_updatedLocalRecord);
            checkForEntryErrors(_updatedLocalRecord, entryErrorsInRecord);
        }
    }

    function handleEntryDelete(entryId: number) {
        if (localRecord) {
            const _updatedRecord = new TimesheetRecord({ ...localRecord, entries: localRecord.entries.filter((_entry) => _entry.id !== entryId) })
            setLocalRecord(_updatedRecord);
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

    return (
        <div>
            <div className={``}>
                <div className={`grid grid-cols-4 items-center px-3 py-2 rounded-md mb-2 ${doesRecordHaveEntries(localRecord) ? 'bg-blue-900' : 'bg-gray-400'}`}>
                    <div className="date-container gap-x-2">
                        <div>
                            <h4 className="text-xs text-white">
                                <span>Date: </span>
                                <span>{date.simpleFormat()}</span>
                            </h4>
                        </div>
                    </div>
                    <div>{/* record hours */}{doesRecordHaveEntries(localRecord) ?
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
                        {canAddEntry ?
                            <div>
                                <button className="px-3 py-0.5 border rounded-sm text-xs text-white bg-blue-900" type="button" onClick={(e) => addNewEntry(date.defaultFormat())}>Add +</button>
                            </div>
                            : ''
                        }
                    </div>
                </div>
            </div>
            <div className="mb-3">
                <>{doesRecordHaveEntries(localRecord) ?
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
                        <div>{localRecord?.entries.map((_entry, _entryIndex) =>
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