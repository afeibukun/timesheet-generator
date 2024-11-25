'use client'
import { Timesheet } from "@/lib/services/timesheet/timesheet";
import { TimesheetDate } from "@/lib/services/timesheet/timesheetDate";
import { useEffect, useState } from "react";
import InfoLabel from "./InfoLabel";
import { TimesheetRecord } from "@/lib/services/timesheet/timesheetRecord";
import TimesheetExportUI from "./TimesheetExportUI";
import ManageRecordView from "./ManageRecordView";
import { TimesheetEntry } from "@/lib/services/timesheet/timesheetEntry";
import { useRouter } from "next/navigation";
import { ComponentType, SearchParamsLabel } from "@/lib/constants/constant";

type TimesheetTableProps = {
    timesheet: Timesheet,
    handleSaveTimesheet: Function
}

type TimesheetDatePlusRecords = {
    day: TimesheetDate,
    record: TimesheetRecord | undefined
}

export default function TimesheetUpdateView({ timesheet, handleSaveTimesheet }: TimesheetTableProps) {
    const router = useRouter();
    const [localTimesheet, setLocalTimesheet] = useState(timesheet);

    const [timesheetRecordsErrorState, setTimesheetRecordsErrorState] = useState(Array(7).fill(false));

    const [daysInCurrentTimesheetWeek, setDaysInCurrentTimesheetWeek] = useState([] as TimesheetDate[]);
    const [daysInCurrentWeekPlusRecords, setDaysInCurrentWeekPlusRecords] = useState([] as TimesheetDatePlusRecords[]);

    useEffect(() => {
        const initializer = async () => {
            await TimesheetDate.initializeWeekStartDay();
            const _weekDays = TimesheetDate.getWeekDays(timesheet.weekEndingDate)
            const _weekDaysPlusRecords = generateWeekDaysPlusRecords(localTimesheet)
            setDaysInCurrentTimesheetWeek(_weekDays);
            setDaysInCurrentWeekPlusRecords(_weekDaysPlusRecords);
        }
        initializer();
    }, []);

    /*  useEffect(() => {
         const _weekDaysPlusRecords = daysInCurrentTimesheetWeek.map(_day => {
             return { day: _day, record: getRecordForDate(_day, localTimesheet) }
         })
         setDaysInCurrentWeekPlusRecords(_weekDaysPlusRecords);
     }, [localTimesheet]); */

    const getRecordForDate = (date: TimesheetDate, timesheet: Timesheet) => {
        const _record = timesheet.records.filter((_record) => date.isDateSame(_record.date))[0]
        return _record
    }

    const timesheetHasRecord = () => {
        try {
            const _timesheetHasRecords = (localTimesheet.records && localTimesheet.records.length > 0)
            return _timesheetHasRecords
        } catch (e) { }
        return false
    }

    const canRecordHaveEntry = (date: string) => {
        let _monthNumberMatch = false
        try {
            if (date && localTimesheet) {
                const _monthForSelectedDay = TimesheetDate.monthForSelectedDay(date);
                const _timesheetMonthNumber = localTimesheet.monthNumber
                _monthNumberMatch = _monthForSelectedDay === _timesheetMonthNumber
            }
        } catch (e) { }

        let _noRecordInTimesheetYet = true;
        try {
            if (date && localTimesheet) {
                const _record = getRecordForDate(new TimesheetDate(date), localTimesheet);
                const _timesheetHasRecords = timesheetHasRecord()
                _noRecordInTimesheetYet = (!_record && !_timesheetHasRecords)
            }
        } catch (e) { }

        if (_monthNumberMatch || _noRecordInTimesheetYet) return true
        return false
    }

    const getTimesheetMonth = () => {
        try {
            return TimesheetDate.monthsInYear[localTimesheet.monthNumber]
        } catch (e) { }
        return ''
    }

    const handleUpdateRecordInTimesheet = (record: TimesheetRecord) => {
        const doesRecordExistInLocalTimesheet = localTimesheet.records.some(_rec => _rec.id === record.id)
        let _updatedTimesheet: Timesheet;
        if (doesRecordExistInLocalTimesheet) {
            // update it,
            let _updatedRecords = localTimesheet.records.map((_rec) => {
                if (_rec.id === record.id) return record
                else return _rec
            })
            // remove empty records
            _updatedRecords = _updatedRecords.filter((_rec) => _rec.entries && _rec.entries.length > 0)

            _updatedTimesheet = new Timesheet({
                ...localTimesheet, records: _updatedRecords
            })

        } else {
            // add new record
            _updatedTimesheet = new Timesheet({
                ...localTimesheet, records: [...localTimesheet.records, record]
            })
        }
        setLocalTimesheet(_updatedTimesheet);
        const _weekDaysPlusRecords = generateWeekDaysPlusRecords(_updatedTimesheet, daysInCurrentTimesheetWeek)
        setDaysInCurrentWeekPlusRecords(_weekDaysPlusRecords);
    }

    const doesTimesheetHaveError = () => {
        return timesheetRecordsErrorState.some((err) => err === true)
    }

    const updateTimesheetErrorState = (errorState: boolean, index: number) => {
        const _recordErrorStates = [...timesheetRecordsErrorState]
        _recordErrorStates[index] = errorState;
        setTimesheetRecordsErrorState(_recordErrorStates)
    }

    function handleTimesheetSaveButtonClick(e: any) {
        if (!doesTimesheetHaveError()) {
            handleSaveTimesheet(e, localTimesheet)
        } else {
            handleSaveTimesheet(e, undefined);
        }
    }

    const deleteTimesheetEventHandler = (e: any) => {
        Timesheet.deleteTimesheet(localTimesheet)
        router.push(`/create?${SearchParamsLabel.component}=${ComponentType.timesheet}`);
    }

    const copyRecordToOtherDays = (referenceRecord: TimesheetRecord, otherDays: string[]) => {
        let _records = localTimesheet.records;
        otherDays.forEach((_day) => {
            const _timesheetDate = daysInCurrentTimesheetWeek.filter((_date) => _date.dayLabel.toLowerCase() === _day.toLowerCase())[0];
            const _recordForDate = _records.filter((_record) => _record.date.isDateSame(_timesheetDate))[0];
            let _updatedRecord: TimesheetRecord;
            if (_recordForDate) {
                if (_recordForDate.entries) {
                    _updatedRecord = new TimesheetRecord({ ..._recordForDate, entries: [..._recordForDate.entries, ...referenceRecord.entries.map((_entry) => new TimesheetEntry({ ..._entry, id: TimesheetEntry.createTimesheetEntryId(), date: _timesheetDate }))] })
                } else {
                    _updatedRecord = new TimesheetRecord({ ..._recordForDate, entries: [...referenceRecord.entries.map((_entry) => new TimesheetEntry({ ..._entry, id: TimesheetEntry.createTimesheetEntryId(), date: _timesheetDate }))] })
                }
                _records = _records.map(_record => {
                    if (_record.id === _recordForDate.id) return _updatedRecord
                    else return _record
                })
            } else {
                _updatedRecord = new TimesheetRecord({ key: TimesheetRecord.createTimesheetRecordKey(_timesheetDate), date: _timesheetDate, entries: referenceRecord.entries.map((_entry) => new TimesheetEntry({ ..._entry, id: TimesheetEntry.createTimesheetEntryId(), date: _timesheetDate })), comment: referenceRecord.comment })
                _records = [..._records, _updatedRecord]
            }
        })
        const _updatedLocalTimesheet = new Timesheet({ ...localTimesheet, records: _records })
        setLocalTimesheet(_updatedLocalTimesheet);
        const _weekDaysPlusRecords = generateWeekDaysPlusRecords(_updatedLocalTimesheet, daysInCurrentTimesheetWeek)
        setDaysInCurrentWeekPlusRecords(_weekDaysPlusRecords);
    }

    const generateWeekDaysPlusRecords = (timesheet: Timesheet, weekDays?: TimesheetDate[]): TimesheetDatePlusRecords[] => {
        let _weekDays: TimesheetDate[]
        if (weekDays) _weekDays = weekDays
        else _weekDays = TimesheetDate.getWeekDays(timesheet.weekEndingDate)

        return _weekDays.map(_day => {
            return { day: _day, record: getRecordForDate(_day, timesheet) }
        })
    }

    return (
        <div>
            <div className="print:hidden">
                <div className="timesheet-wrapper border p-4">
                    <div className="wrapper-header mb-4">
                        <div className="flex justify-between">
                            <h4 className="rounded text-base font-black text-purple-700">
                                <span>Week </span>
                                <span>{timesheet.weekNumber}</span>
                                <>{timesheetHasRecord() ?
                                    <span className="inline-block ml-2">
                                        <small className="capitalize">({getTimesheetMonth()})</small>
                                    </span> : ''
                                }</>
                            </h4>
                            <div className="flex gap-x-2">
                                <button type="button" className="px-4 py-1.5 bg-red-800 rounded text-sm text-white hover:bg-red-900" onClick={(e) => deleteTimesheetEventHandler(e)}>
                                    <span>Discard Timesheet</span>
                                </button>
                                <button type="button" className="px-4 py-1.5 bg-green-800 rounded text-sm text-white hover:bg-green-900" onClick={(e) => handleTimesheetSaveButtonClick(e)}>
                                    <span>Save Timesheet</span>
                                </button>
                            </div>
                        </div>
                        <div>
                            <div className="total-hours">
                                <h4><span className="px-1.5 py-1 rounded bg-slate-200 text-xs">Total Hours:</span> <span className="text-xs font-bold">{localTimesheet.totalHours}</span></h4>
                            </div>
                        </div>
                    </div>
                    {/* Customer and Project Info */}
                    <div className="preview-header-group group-3 flex gap-x-4 justify-between">
                        <div className="flex gap-x-3">
                            <div className="customer-and-site-info flex gap-x-2">
                                <> {/* Customer und site*/} {timesheet.customer ?
                                    <>
                                        {/* just customer */}
                                        <div className="customer-info-group mb-4">
                                            <p>
                                                <InfoLabel><span className="text-xs">Customer</span></InfoLabel>
                                                <span className="info-value text-xs">{timesheet.customer.name}</span>
                                            </p>
                                        </div>
                                        <> {/* Site */} {timesheet.customer.activeSite ?
                                            <div className="site-info-group mb-4 ">
                                                <p>
                                                    <span className="site-info">
                                                        <InfoLabel><span className="text-xs">Site Name</span></InfoLabel>
                                                        <span className="info-value text-xs">{timesheet.customer.activeSite.name}</span>
                                                    </span>
                                                    <span className="country-info">
                                                        <span className="mr-4">,</span>
                                                        <InfoLabel><span className="text-xs">Country</span></InfoLabel>
                                                        <span className="info-value text-xs">{timesheet.customer.activeSite.country}</span>
                                                    </span>
                                                </p>
                                            </div> : ''
                                        }
                                        </>
                                    </> : ''
                                }
                                </>

                            </div>
                            <> {/* Project */}
                                {timesheet.project ?
                                    <div className="project-info-group">
                                        <div className="purchase-order-number-group mb-4">

                                            <p className="purchase-order-number-info">
                                                <InfoLabel><span className="text-xs">PO Number</span></InfoLabel>
                                                <span className="info-value text-xs">{timesheet.project.purchaseOrderNumber}</span>
                                            </p>

                                        </div>
                                        {timesheet.project.orderNumber ?
                                            <div className="order-number-group mb-4">
                                                <p className="order-number-info">
                                                    <InfoLabel><span className="text-xs">Order Number</span></InfoLabel>
                                                    <span className="info-value text-xs">{timesheet.project.orderNumber}</span>
                                                </p>
                                            </div>
                                            : ''}
                                    </div>
                                    : ''
                                }
                            </>
                        </div>
                        <div className="timesheet-validity-status text-[10px] font-bold">
                            {localTimesheet && doesTimesheetHaveError() ? <p className="bg-red-200 text-red-900 px-2 py-1">Timesheet Has Errors</p> : <p className="bg-green-100 text-green-900 px-2 py-1">Valid Timesheet</p>}
                        </div>
                    </div>
                    {/* Daily Breakdown */}
                    <div>
                        <>{daysInCurrentWeekPlusRecords.map((_datePlusRecord, dayOfTheWeekIndex) =>
                            <div key={_datePlusRecord.day.date}>
                                <ManageRecordView
                                    record={_datePlusRecord.record}
                                    uiElementId={`${timesheet.id}${dayOfTheWeekIndex}`}
                                    date={_datePlusRecord.day}
                                    updateRecordInTimesheet={(record: TimesheetRecord) => handleUpdateRecordInTimesheet(record)}
                                    canAddEntry={canRecordHaveEntry(_datePlusRecord.day.basicFormat())}
                                    updateRecordErrorState={(errorState: boolean) => updateTimesheetErrorState(errorState, dayOfTheWeekIndex)}
                                    duplicateRecord={(referenceRecord: TimesheetRecord, otherDays: string[]) => copyRecordToOtherDays(referenceRecord, otherDays)}
                                />
                            </div>
                        )}</>
                    </div>
                    <div className="timesheet-footer mt-4">
                        <TimesheetExportUI timesheet={timesheet} />
                    </div>
                </div>
            </div>
        </div>
    )
}