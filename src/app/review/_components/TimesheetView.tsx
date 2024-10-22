'use client'
import { useEffect, useState } from "react";
import { TimesheetLocalStorage } from "@/lib/services/timesheet/timesheetLocalStorage";
import { Timesheet } from "@/lib/services/timesheet/timesheet";
import { ToastStatus } from "@/lib/constants/constant";
import DefaultSection from "@/app/_components/DefaultSection";
import DefaultSectionHeader from "@/app/_components/DefaultSectionHeader";
import DefaultSectionTitle from "@/app/_components/DefaultSectionTitle";
import ToastNotification from "@/app/_components/ToastNotification";
import TimesheetUpdateView from "./TimesheetUpdateView";
import Link from "next/link";

type NotificationType = {
    display: boolean,
    text: string,
    status?: ToastStatus,
    icon?: any,
    bgColor?: string,
    progressBarColor?: string
}

type TimesheetViewProps = {
    timesheet: Timesheet,
    setTimesheet: Function
}


export default function TimesheetView({ timesheet, setTimesheet }: TimesheetViewProps) {
    const [showNotification, setShowNotification] = useState({ display: false, text: '' } as NotificationType);

    async function handleUpdateTimesheet(updatedTimesheet: Timesheet) {
        try {
            if (updatedTimesheet) {
                await updatedTimesheet.updateTimesheetInDb();
                const updatedCorrespondingTimesheet = new Timesheet(updatedTimesheet);
                setTimesheet(updatedTimesheet)
                setShowNotification({ display: true, text: "Timesheet Data Saved Successfully", status: ToastStatus.success });
            } else {
                setShowNotification({ display: true, text: "Correct The Timesheet Errors First", status: ToastStatus.danger });
            }

            setTimeout(() => {
                setShowNotification({ display: false, text: "", status: undefined });
            }, 3000)
            return

        } catch (e) {
            console.log(e)
        }
        throw Error;
    }

    return (
        <main>
            <div>
                <DefaultSection>
                    <div className="print:hidden">
                        <DefaultSectionHeader>
                            <div>
                                <div className="flex items-center justify-between">
                                    <div className="preview-header-group main-title group-1 mb-4">
                                        <DefaultSectionTitle>Timesheet Preview</DefaultSectionTitle>
                                    </div>
                                    <div>
                                        <Link href="/" className="inline-block px-8 py-2 rounded border">Go Home</Link>
                                    </div>
                                </div>
                                <div className="preview-header-group group-2 flex justify-between">
                                    <div className="timesheet-owner-group  ">
                                        {timesheet.personnel ?
                                            <h5 className="text-2xl font-medium rounded  p-2 bg-slate-100">
                                                <span>Personnel Name: </span>
                                                <span className="text-blue-900">{timesheet.personnel.name}</span>
                                            </h5> : ''
                                        }
                                    </div>
                                    {/* <div className="timesheet-owner-hours border p-2 rounded-md">
                                        <p className="text-center">Total hours</p>
                                        <h3>
                                            <span className="text-3xl font-semibold">
                                                <span>{timesheet.totalHours}</span>
                                                <span className="text-lg font-medium">hrs</span>
                                            </span> */}
                                    {/* <span className="text-base font-light">
                                    <span>{30}</span>
                                    <span>m</span>
                                </span> */}
                                    {/* </h3>
                                        <h5 className="text-sm text-center">
                                            <span>{timesheet.totalDays}</span>
                                            <span>days</span>
                                        </h5>
                                    </div> */}
                                </div>
                            </div>
                        </DefaultSectionHeader>
                    </div>
                    <div className="section-body">
                        {showNotification.display && showNotification.status !== undefined ?
                            <ToastNotification toastType={showNotification.status} toastText={showNotification.text} /> : ''
                        }
                        <div className="timesheet-container w-full">
                            <div className="timesheet w-full">
                                <div className="w-full">
                                    <div className="shrink-0 w-full transition ease-in-out duration-500">
                                        {timesheet.records ?
                                            <div className="timesheet-table text-left">
                                                <TimesheetUpdateView timesheetData={timesheet} handleSaveTimesheet={(e: any, updatedTimesheet: Timesheet) => { handleUpdateTimesheet(updatedTimesheet) }} />
                                            </div> : ''
                                        }
                                        {/* updateTimesheetEntryCollection(timesheet.weekNumber, e) */}
                                        {/* Print Section */}
                                        {/* <PrintTimesheetWithDefaultTemplate currentWeek={currentWeek} groupedTimesheet={groupedTimesheet} timesheetMeta={timesheet.meta} /> */}
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                    <footer className="py-8 print:hidden">
                        <div className="">
                            <div className="flex gap-x-4">
                            </div>
                        </div>
                    </footer>
                </DefaultSection>
            </div>
        </main>
    );
}