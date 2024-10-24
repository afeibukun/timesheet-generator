import { Timesheet } from "@/lib/services/timesheet/timesheet";
import { TimesheetDate } from "@/lib/services/timesheet/timesheetDate";
import { useEffect, useState } from "react";
import InfoLabel from "./InfoLabel";
import { TimesheetRecord } from "@/lib/services/timesheet/timesheetRecord";
import TimesheetExportUI from "./TimesheetExportUI";
import ManageRecordView from "./ManageRecordView";

type TimesheetTableProps = {
    timesheet: Timesheet,
    handleSaveTimesheet: Function
}

export default function TimesheetUpdateView({ timesheet, handleSaveTimesheet }: TimesheetTableProps) {

    const [localTimesheet, setLocalTimesheet] = useState(timesheet);

    const [timesheetRecordsErrorState, setTimesheetRecordsErrorState] = useState(Array(7).fill(false));

    const [daysInCurrentTimesheetWeek, setDaysInCurrentTimesheetWeek] = useState([] as TimesheetDate[]);

    useEffect(() => {
        const initializer = async () => {
            await TimesheetDate.initializeWeekStartDay();
            const _weekDays = TimesheetDate.getWeekDays(timesheet.weekEndingDate)
            setDaysInCurrentTimesheetWeek(_weekDays);
        }
        initializer();
    }, []);

    const getRecordForDate = (date: TimesheetDate) => {
        const _record = localTimesheet.records.filter((_record) => date.isDateSame(_record.date))[0]
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
                const _record = getRecordForDate(new TimesheetDate(date));
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
        const doesRecordExistInLocalTimesheet = localTimesheet.records.some(_record => _record.id === record.id)
        let _updatedTimesheet: Timesheet;
        if (doesRecordExistInLocalTimesheet) {
            // update it,
            let _updatedRecords = localTimesheet.records.map((_record) => {
                if (_record.id === record.id) return record
                else return _record
            })
            // remove empty records
            _updatedRecords = _updatedRecords.filter((_record) => _record.entries && _record.entries.length > 0)

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
                                    <span>
                                        <small className="capitalize">({getTimesheetMonth()})</small>
                                    </span> : ''
                                }</>
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
                    <div className="preview-header-group group-3 flex gap-x-4 justify-between">
                        <div className="flex gap-x-3">
                            <div className="customer-and-site-info flex gap-x-2">
                                <> {/* Customer */}
                                    {timesheet.customer ?
                                        <div className="customer-info-group mb-4">
                                            <p>
                                                <InfoLabel><span className="text-xs">Customer</span></InfoLabel>
                                                <span className="info-value text-xs">{timesheet.customer.name}</span>
                                            </p>
                                        </div> : ''
                                    }
                                </>
                                <> {/* Site */}
                                    {timesheet.site ?
                                        <div className="site-info-group mb-4 ">
                                            <p>
                                                <span className="site-info">
                                                    <InfoLabel><span className="text-xs">Site Name</span></InfoLabel>
                                                    <span className="info-value text-xs">{timesheet.site.name}</span>
                                                </span>
                                                <span className="country-info">
                                                    <span className="mr-4">,</span>
                                                    <InfoLabel><span className="text-xs">Country</span></InfoLabel>
                                                    <span className="info-value text-xs">{timesheet.site.country}</span>
                                                </span>
                                            </p>
                                        </div> : ''
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
                        <>{daysInCurrentTimesheetWeek.map((date, dayOfTheWeekIndex) =>
                            <div key={date.date}>
                                <ManageRecordView
                                    record={getRecordForDate(date)}
                                    uiElementId={`${timesheet.id}${dayOfTheWeekIndex}`}
                                    date={date}
                                    updateRecordInTimesheet={(record: TimesheetRecord) => handleUpdateRecordInTimesheet(record)}
                                    canAddEntry={canRecordHaveEntry(date.basicFormat())}
                                    updateRecordErrorState={(errorState: boolean) => updateTimesheetErrorState(errorState, dayOfTheWeekIndex)}
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