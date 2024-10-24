import { TimesheetDate } from "@/lib/services/timesheet/timesheetDate"
import { PrimitiveTimesheetEntry, PrimitiveTimesheetEntryError, PrimitiveTimesheetRecord } from "@/lib/types/primitive"
import { useEffect, useState } from "react"
import EntryEditView from "./EntryEditView"
import { TimesheetEntry } from "@/lib/services/timesheet/timesheetEntry"
import { LocationType } from "@/lib/constants/constant"
import { TimesheetRecord } from "@/lib/services/timesheet/timesheetRecord"

type ManageRecordViewProps = {
    primitiveRecord: PrimitiveTimesheetRecord | undefined,
    uiElementId: string,
    date: TimesheetDate,
    canAddEntry: Boolean,
    updatePrimitiveRecordInTimesheet: Function,
    updateRecordErrorState: Function
}

export default function ManageRecordView({ primitiveRecord, uiElementId, date, canAddEntry, updatePrimitiveRecordInTimesheet, updateRecordErrorState }: ManageRecordViewProps) {

    const [localPrimitiveRecord, setLocalPrimitiveRecord] = useState(primitiveRecord);

    const defaultErrorObject = { error: false, message: "" }

    const _initialLocalEntryErrors: PrimitiveTimesheetEntryError[] = []
    const [entryErrorsInRecord, setEntryErrorsInRecord] = useState(_initialLocalEntryErrors);

    useEffect(() => {
        const initializer = () => {
            const _initialLocalEntryErrors: PrimitiveTimesheetEntryError[] = primitiveRecord && primitiveRecord.entries && primitiveRecord.entries.length > 0 ? primitiveRecord.entries.map((_primitiveEntry) => {
                return addNewEntryError(_primitiveEntry.id)
            }) : [];
            setEntryErrorsInRecord(_initialLocalEntryErrors);
        }
        initializer();
    }, []);

    const doesPrimitiveRecordHaveEntries = (primitiveRecord: PrimitiveTimesheetRecord | undefined) => {
        if (!primitiveRecord || !primitiveRecord.entries.some((_primitiveEntry) => primitiveRecord.date === _primitiveEntry.date)) return false
        return true
    }

    const getTotalHoursForRecord = () => {
        if (localPrimitiveRecord) return TimesheetRecord.totalHoursForPrimitiveRecord(localPrimitiveRecord);
        return '00:00'
    }

    const addNewEntry = (dayString: string) => {
        const _newPrimitiveEntry: PrimitiveTimesheetEntry = { id: TimesheetEntry.createId(), date: dayString, entryTypeSlug: '', hasPremium: false, entryPeriodStartTime: '', entryPeriodFinishTime: '', locationType: LocationType.onshore, comment: '', breakPeriodStartTime: '', breakPeriodFinishTime: '' }
        let _primitiveRecord: PrimitiveTimesheetRecord;

        if (doesPrimitiveRecordHaveEntries(localPrimitiveRecord) && localPrimitiveRecord?.entries) {
            _primitiveRecord = { ...localPrimitiveRecord, entries: [...localPrimitiveRecord?.entries, _newPrimitiveEntry] }
        } else {
            _primitiveRecord = { id: TimesheetRecord.createId(), date: dayString, entries: [_newPrimitiveEntry] }
        }
        setLocalPrimitiveRecord(_primitiveRecord);
        updatePrimitiveRecordInTimesheet(_primitiveRecord);
        const _updatedEntryErrors = [...entryErrorsInRecord, addNewEntryError(_newPrimitiveEntry.id)]
        setEntryErrorsInRecord(_updatedEntryErrors)
        checkForEntryErrors(_primitiveRecord, _updatedEntryErrors)
        // set the primitive record on its timesheet
    }

    const addNewEntryError = (entryId: number) => {
        return { id: entryId, entryType: defaultErrorObject, locationType: defaultErrorObject, entryPeriodStartTime: defaultErrorObject, entryPeriodFinishTime: defaultErrorObject, breakPeriodStartTime: defaultErrorObject, breakPeriodFinishTime: defaultErrorObject } as PrimitiveTimesheetEntryError
    }

    const handleUpdatePrimitiveEntryInRecord = (primitiveEntry: PrimitiveTimesheetEntry) => {
        if (localPrimitiveRecord) {
            const doesPrimitiveEntryExistInLocalRecord = localPrimitiveRecord.entries.some(_primitiveEntry => _primitiveEntry.id === primitiveEntry.id)
            let _updatedLocalPrimitiveRecord: PrimitiveTimesheetRecord;
            if (doesPrimitiveEntryExistInLocalRecord) {
                // update the primitive record
                _updatedLocalPrimitiveRecord = {
                    ...localPrimitiveRecord, entries: localPrimitiveRecord.entries.map((_primtiveEntry) => {
                        if (_primtiveEntry.id === primitiveEntry.id) return primitiveEntry
                        else return _primtiveEntry
                    })
                }
            } else {
                // add primitive entry
                _updatedLocalPrimitiveRecord = { ...localPrimitiveRecord, entries: [...localPrimitiveRecord.entries, primitiveEntry] }
            }
            setLocalPrimitiveRecord(_updatedLocalPrimitiveRecord);
            updatePrimitiveRecordInTimesheet(_updatedLocalPrimitiveRecord);
            checkForEntryErrors(_updatedLocalPrimitiveRecord, entryErrorsInRecord);
        }
    }

    function handlePrimitiveEntryDelete(entryId: number) {
        if (localPrimitiveRecord) {
            const _updatedPrimitiveRecord = { ...localPrimitiveRecord, entries: localPrimitiveRecord.entries.filter((_primitiveEntry) => _primitiveEntry.id !== entryId) }
            setLocalPrimitiveRecord(_updatedPrimitiveRecord);
            updatePrimitiveRecordInTimesheet(_updatedPrimitiveRecord);
            const _updatedEntryErrors = entryErrorsInRecord.filter((_error) => _error.id !== entryId)
            setEntryErrorsInRecord(_updatedEntryErrors)
            checkForEntryErrors(_updatedPrimitiveRecord, _updatedEntryErrors)
        }
    }

    const getEntryError = (entryId: number) => {
        if (entryErrorsInRecord && entryErrorsInRecord.length > 0)
            return entryErrorsInRecord.filter(e => e.id === entryId)[0]
    }

    const checkForEntryErrors = (primitiveRecord: PrimitiveTimesheetRecord, entryErrorsInRecord: PrimitiveTimesheetEntryError[]) => {
        let entryErrors: PrimitiveTimesheetEntryError[] = TimesheetRecord.cheeckForErrorsInRecord(primitiveRecord, entryErrorsInRecord);
        if (entryErrors.length > 0) {
            setEntryErrorsInRecord(entryErrors);
            updateRecordErrorState(doesRecordHaveErrors(entryErrors))
        }

    }

    const doesRecordHaveErrors = (entryErrorsInRecord: PrimitiveTimesheetEntryError[]) => {
        return entryErrorsInRecord.some((err) => {
            const hasErrors = err.entryType.error || err.entryPeriodStartTime.error || err.entryPeriodFinishTime.error || err.breakPeriodStartTime.error || err.breakPeriodFinishTime.error
            return hasErrors
        })
    }

    return (
        <div>
            <div className={``}>
                <div className={`grid grid-cols-4 items-center px-3 py-2 rounded-md mb-2 ${doesPrimitiveRecordHaveEntries(localPrimitiveRecord) ? 'bg-blue-900' : 'bg-gray-400'}`}>
                    <div className="date-container gap-x-2">
                        <div>
                            <h4 className="text-xs text-white">
                                <span>Date: </span>
                                <span>{date.simpleFormat()}</span>
                            </h4>
                        </div>
                    </div>
                    <div>{/* record hours */}{doesPrimitiveRecordHaveEntries(localPrimitiveRecord) ?
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
                <>{doesPrimitiveRecordHaveEntries(localPrimitiveRecord) ?
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
                        <div>{localPrimitiveRecord?.entries.map((_primitiveEntry, _entryIndex) =>
                            <EntryEditView
                                key={_primitiveEntry.id}
                                primitiveEntry={_primitiveEntry}
                                uiElementId={`${uiElementId}-${_primitiveEntry.id}${_entryIndex}`}
                                updatePrimitiveEntryInRecord={(primitiveEntry: PrimitiveTimesheetEntry) => handleUpdatePrimitiveEntryInRecord(primitiveEntry)}
                                deletePrimitiveEntryInRecord={(entryId: number) => handlePrimitiveEntryDelete(entryId)}
                                entryError={getEntryError(_primitiveEntry.id)} />
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