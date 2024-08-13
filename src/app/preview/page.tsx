'use client'
import Link from "next/link";
import DefaultSection from "../_components/DefaultSection";
import DefaultSectionHeader from "../_components/DefaultSectionHeader";
import DefaultSectionTitle from "../_components/DefaultSectionTitle";
import InfoLabel from "./_components/InfoLabel";
import TimesheetTable from "./_components/TimesheetTable";
import { TimesheetEntry, TimesheetEntryEditFormData } from "@/lib/services/timesheet/timesheetEntry";
import { useEffect, useState } from "react";
import { TimesheetLocalStorage } from "@/lib/services/timesheet/timesheetLocalStorage";
import { TimesheetDate } from "@/lib/services/timesheet/timesheetDate";
import { TimesheetEntryPeriod } from "@/lib/services/timesheet/timesheetEntryPeriod";
import { Timesheet } from "@/lib/services/timesheet/timesheet";
import { CannotParsePrimitiveDataToTimesheetError } from "@/lib/services/timesheet/timesheetErrors";

export default function Preview() {

    const [timesheet, setTimesheet] = useState({} as Timesheet);
    const [groupedTimesheet, setGroupedTimesheet] = useState({} as Partial<Record<number | string, TimesheetEntry[]>>);
    const [weeksInGroupedTimesheet, setWeeksInGroupedTimesheet] = useState([] as string[]);

    useEffect(() => {
        var retrievedTimesheet;
        try {
            retrievedTimesheet = TimesheetLocalStorage.getTimesheetFromLocalStorage();
            setTimesheet(retrievedTimesheet);
            let _groupedTimesheetEntry = retrievedTimesheet.timesheetEntryCollectionByWeek
            let _weeksInGroupedTimesheet: string[] = Object.keys(_groupedTimesheetEntry)
            setGroupedTimesheet(_groupedTimesheetEntry);
            setWeeksInGroupedTimesheet(_weeksInGroupedTimesheet)
        } catch (e) {
            if (e instanceof CannotParsePrimitiveDataToTimesheetError) {
                console.log(e);
            }
        }

    }, []);

    function updateTimesheetEntryCollection(weekNumber: number, updatedTimesheetEntryFormData: TimesheetEntryEditFormData) {
        try {
            let updatedTimesheetEntryCollection: TimesheetEntry[] = timesheet.entryCollection.map((timesheetEntry: TimesheetEntry) => {
                if (timesheetEntry.id == updatedTimesheetEntryFormData.id) {
                    return new TimesheetEntry({ ...timesheetEntry, entryPeriod: new TimesheetEntryPeriod({ startTime: updatedTimesheetEntryFormData.startTime, finishTime: updatedTimesheetEntryFormData.finishTime }), locationType: updatedTimesheetEntryFormData.locationType, comment: updatedTimesheetEntryFormData.comment })
                }
                return timesheetEntry;
            });
            let updatedTimesheet = new Timesheet({ meta: timesheet.meta, entryCollection: updatedTimesheetEntryCollection })
            setTimesheet(updatedTimesheet);
            setGroupedTimesheet(updatedTimesheet.timesheetEntryCollectionByWeek);
            return true;
        } catch (e) { }
        throw Error;
    }

    useEffect(() => {
        if ('meta' in timesheet && 'entryCollection' in timesheet) {
            TimesheetLocalStorage.setGeneratedTimesheetInLocalStorage(timesheet);
        }
    }, [timesheet])

    function handleResetEverythingButton(e: any) {
        setTimesheet({} as Timesheet);
        setGroupedTimesheet({});
        setWeeksInGroupedTimesheet([]);
        TimesheetLocalStorage.clearTimesheetFromLocalStorage();
    }

    return (
        <main>
            <DefaultSection>
                <DefaultSectionHeader>
                    <div className="preview-header-group main-title group-1 mb-4">
                        <DefaultSectionTitle>Timesheet Preview</DefaultSectionTitle>
                        {timesheet.meta != undefined ?
                            <div className="timesheet-period">
                                <p className="text-base font-medium italic">
                                    {timesheet.meta.mobilizationDate != undefined && timesheet?.meta.mobilizationDate != null ?
                                        <span>{new TimesheetDate(timesheet?.meta.mobilizationDate).simpleFormat()}</span>
                                        : ''}
                                    <span className="px-3">-</span>
                                    {timesheet?.meta.demobilizationDate != undefined && timesheet?.meta.demobilizationDate != null ?
                                        <span>{new TimesheetDate(timesheet?.meta.demobilizationDate!).simpleFormat()}</span> : ''}
                                </p>
                            </div> : ''}

                    </div>
                    <div className="preview-header-group group-2 flex justify-between">
                        {timesheet.meta != undefined ?
                            <div className="timesheet-owner-group  ">
                                <h5 className="text-3xl font-medium rounded  p-2 bg-slate-100">{timesheet?.meta.fsrName}</h5>
                            </div> : ''}
                        <div className="timesheet-owner-hours border p-2 rounded-md">
                            <p className="text-center">Total hours</p>
                            <h3>
                                <span className="text-3xl font-semibold">
                                    <span>{timesheet.totalHours}</span>
                                    <span className="text-lg font-medium">hrs</span>
                                </span>
                                {/* <span className="text-base font-light">
                                    <span>{30}</span>
                                    <span>m</span>
                                </span> */}
                            </h3>
                            <h5 className="text-sm text-center">
                                <span>{timesheet.totalDays}</span>
                                <span>days</span>
                            </h5>
                        </div>
                    </div>
                    <div className="preview-header-group group-3 flex gap-x-8">
                        {timesheet.meta != undefined ?
                            <div className="customer-and-site-info">
                                <div className="customer-info-group mb-4">
                                    <p>
                                        <InfoLabel>Customer</InfoLabel>
                                        <span className="info-value">{timesheet?.meta.customerName}</span>
                                    </p>
                                </div>
                                <div className="site-info-group mb-4 ">
                                    <p>
                                        <span className="site-info">
                                            <InfoLabel>Site Name</InfoLabel>
                                            <span className="info-value">{timesheet?.meta.siteName}</span>
                                        </span>
                                        <span className="country-info">
                                            <span className="mr-4">,</span>
                                            <InfoLabel>Country</InfoLabel>
                                            <span className="info-value">{timesheet?.meta.siteCountry}</span>
                                        </span>
                                    </p>
                                </div>
                            </div>
                            : ''}
                        {timesheet.meta != undefined ?
                            <div className="project-info-group">
                                <div className="purchase-order-number-group mb-4">
                                    <p className="purchase-order-number-info">
                                        <InfoLabel>PO Number</InfoLabel>
                                        <span className="info-value">{timesheet?.meta.purchaseOrderNumber}</span>
                                    </p>
                                </div>
                                {timesheet?.meta.orderNumber != null && timesheet?.meta.orderNumber != undefined ?
                                    <div className="order-number-group mb-4">
                                        <p className="order-number-info">
                                            <InfoLabel>Order Number</InfoLabel>
                                            <span className="info-value">{timesheet?.meta.orderNumber}</span>
                                        </p>
                                    </div>
                                    : ''}
                            </div> : ''}
                    </div>
                </DefaultSectionHeader>
                <div className="section-body">
                    {timesheet != null ? (
                        <div>
                            {weeksInGroupedTimesheet.map((currentWeek: string) =>
                                <div key={currentWeek} className="week-wrapper border p-4">
                                    <div className="wrapper-header mb-4">
                                        <h4 className="rounded text-base font-black text-purple-700">
                                            <span>Week </span>
                                            <span>{currentWeek}</span></h4>
                                    </div>
                                    <div className="timesheet-table text-left">
                                        <TimesheetTable timesheetEntryCollectionData={groupedTimesheet[currentWeek]} handleTimesheetEntryCollectionUpdate={(e: any) => updateTimesheetEntryCollection(Number(currentWeek), e)} />
                                    </div>
                                </div>
                            )
                            }
                        </div>
                    ) : ''}

                </div>
                <footer className="py-8">
                    <div className="flex gap-x-4">
                        <div>
                            <button type="button" className="inline-block px-8 py-2 rounded uppercase text-sm bg-purple-700 text-white">Save Data</button>
                        </div>
                        <div>
                            <Link href="/generate" className="inline-block px-8 py-2 rounded border">Edit Meta Data</Link>
                        </div>
                        <div>
                            <Link href="/" className="inline-block px-8 py-2 rounded border">Go Home</Link>
                        </div>
                        <div>
                            <button type="button" onClick={handleResetEverythingButton} className="inline-block px-8 py-2 rounded uppercase text-sm bg-red-400 text-black">Reset Everything</button>
                        </div>
                    </div>
                </footer>
            </DefaultSection>
        </main>
    );
}