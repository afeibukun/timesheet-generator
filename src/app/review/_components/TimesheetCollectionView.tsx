'use client'
import Link from "next/link";
import { useEffect, useState } from "react";
import { Timesheet } from "@/lib/services/timesheet/timesheet";
import { TimesheetCollection } from "@/lib/types/timesheet";
import { ReportType, TemplateType, ToastStatus } from "@/lib/constants/constant";
import DefaultSection from "@/app/_components/DefaultSection";
import DefaultSectionHeader from "@/app/_components/DefaultSectionHeader";
import DefaultSectionTitle from "@/app/_components/DefaultSectionTitle";
import ToastNotification from "@/app/_components/ToastNotification";
import TimesheetUpdateView from "./TimesheetUpdateView";
import { defaultExportOption } from "@/lib/constants/default";

type NotificationType = {
    display: boolean,
    text: string,
    status?: ToastStatus,
    icon?: any,
    bgColor?: string,
    progressBarColor?: string
}

type TimesheetCollectionViewProps = {
    timesheetCollection: TimesheetCollection,
    setTimesheetCollection: Function
}


export default function TimesheetCollectionView({ timesheetCollection, setTimesheetCollection }: TimesheetCollectionViewProps) {

    // const [timesheetCollection, setTimesheetCollection] = useState({} as TimesheetCollection);
    const [exportOption, setExportOption] = useState(defaultExportOption);
    const [showNotification, setShowNotification] = useState({ display: false, text: '' } as NotificationType);
    const [activeTimesheetIndexInCollection, setActiveTimesheetIndexInCollection] = useState(0);

    useEffect(() => {
        var retrievedTimesheet;
        const initializer = async () => {
            //const _timesheetCollection = await Timesheet.getTimesheetCollectionFromKey(key);
            //setTimesheetCollection(_timesheetCollection);
        }
        initializer();
    }, []);

    async function handleUpdateTimesheet(updatedTimesheet: Timesheet) {
        try {
            if (updatedTimesheet) {
                await updatedTimesheet.updateTimesheetInDb();
                const updatedCorrespondingTimesheet = new Timesheet(updatedTimesheet);
                // update the collection too
                setTimesheetCollection({
                    ...timesheetCollection, collection: timesheetCollection.collection.map((t) => {
                        if (t.id === updatedTimesheet.id) return updatedCorrespondingTimesheet
                        else return t
                    })
                })
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
        <div>
            <DefaultSection>
                <div className="print:hidden">
                    <DefaultSectionHeader>
                        <div>
                            <div className="flex items-center justify-between">
                                <div className="preview-header-group main-title group-1 mb-4">
                                    <DefaultSectionTitle>Timesheet Collection Preview</DefaultSectionTitle>
                                </div>
                                <div>
                                    <Link href="/" className="inline-block px-8 py-2 rounded border">Go Home</Link>
                                </div>
                            </div>
                            <div className="preview-header-group group-2 flex justify-between">
                                {timesheetCollection?.collection ?
                                    <div className="timesheet-owner-group  ">
                                        <h5 className="text-2xl font-medium rounded  p-2 bg-slate-100">Personnel Name: <span className="text-blue-900">{timesheetCollection?.collection[0].personnel.name}</span></h5>
                                    </div> : ''}
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
                    <div className="timesheet-collection-container w-full">
                        <div className="timesheet-collection-navigation">
                            <>{timesheetCollection?.collection ?
                                <div className="flex justify-between mb-2">
                                    <button type="button" onClick={(e) => activeTimesheetIndexInCollection > 0 ? setActiveTimesheetIndexInCollection(activeTimesheetIndexInCollection - 1) : ''} className={`px-3 py-1 text-xs rounded ${activeTimesheetIndexInCollection == 0 ? 'bg-slate-300 text-gray-400' : 'bg-slate-600 text-white'}`}>Prev</button>

                                    <div className="flex gap-x-1">
                                        {
                                            timesheetCollection.collection.map((collection: any, index: number) =>
                                                <span key={index} className={`inline-flex w-2 h-2 rounded-full transition ease-in-out duration-100 ${index == activeTimesheetIndexInCollection ? 'bg-slate-700' : 'bg-slate-200'}`}></span>
                                            )
                                        }
                                    </div>

                                    <button type="button" onClick={(e) => activeTimesheetIndexInCollection < timesheetCollection.collection.length - 1 ? setActiveTimesheetIndexInCollection(activeTimesheetIndexInCollection + 1) : ''} className={`px-3 py-1 text-xs rounded ${activeTimesheetIndexInCollection == timesheetCollection.collection.length - 1 ? 'bg-slate-300 text-gray-400' : 'bg-slate-600 text-white'}`}>Next</button>
                                </div>
                                : ''
                            }</>
                        </div>
                        {timesheetCollection?.collection ? (
                            <div className="timesheet-collection w-full overflow-x-hidden">
                                <div className="flex flex-nowrap flex-row w-full">
                                    {timesheetCollection.collection.map((timesheet: Timesheet) =>
                                        <div className="shrink-0 w-full transition ease-in-out duration-500" key={timesheet.id} style={{ transform: `translateX(-${activeTimesheetIndexInCollection * 100}%)` }}>
                                            {timesheet?.records ?
                                                <div className="timesheet-table text-left">
                                                    <TimesheetUpdateView timesheet={timesheet} handleSaveTimesheet={(e: any, updatedTimesheet: Timesheet) => { handleUpdateTimesheet(updatedTimesheet) }} />
                                                </div> : ''
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : ''}

                    </div>
                </div>
                <footer className="py-8 print:hidden">
                    <div className="">
                        <div className="flex gap-x-4 mb-4">
                            <div>
                                <button type="button" className="inline-block px-4 py-1 rounded uppercase text-sm bg-purple-700 text-white" onClick={(e) => Timesheet.exportXlsxTimesheets(timesheetCollection.collection, ReportType.customer, TemplateType.classic, exportOption)}>Export Timesheet Collection Excel</button>
                            </div>
                            <div>
                                <button type="button" className="inline-block px-4 py-1 rounded uppercase text-sm bg-green-700 text-white" onClick={(e) => Timesheet.exportPdfTimesheets(timesheetCollection.collection, ReportType.customer, TemplateType.classic, exportOption)}>Export Timesheet Collection PDF</button>
                            </div>

                            <div>
                            </div>
                        </div>
                        <div>

                            <div>
                                <Link href="/" className="inline-block px-8 py-2 rounded border">Go Home</Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </DefaultSection>
        </div>
    );
}