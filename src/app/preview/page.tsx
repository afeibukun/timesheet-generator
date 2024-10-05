'use client'
import Link from "next/link";
import DefaultSection from "../_components/DefaultSection";
import DefaultSectionHeader from "../_components/DefaultSectionHeader";
import DefaultSectionTitle from "../_components/DefaultSectionTitle";
import InfoLabel from "./_components/InfoLabel";
import TimesheetTable from "./_components/TimesheetTable";
import { TimesheetEntry } from "@/lib/services/timesheet/timesheetEntry";
import { useEffect, useState } from "react";
import { TimesheetLocalStorage } from "@/lib/services/timesheet/timesheetLocalStorage";
import { Timesheet } from "@/lib/services/timesheet/timesheet";
import { CannotParsePrimitiveDataToTimesheetError } from "@/lib/services/timesheet/timesheetErrors";
import { createPdfTimesheet } from "@/lib/services/pdf/pdfService";
import PrintTimesheetWithDefaultTemplate from "./_components/PrintTimesheetWithDefaultTemplate";
import { createXlsxTimesheetStandardTemplateWithExcelJs } from "@/lib/services/xlsx/excelJsService";
import { createPdfWithJsPdfAutoTable } from "@/lib/services/pdf/jsPdfAutoTableService";
import { PrimitiveTimesheetEntryDataInterface, PrimitiveTimesheetInterface, TimesheetCollectionInterface, TimesheetInterface } from "@/lib/types/timesheetType";
import { ActiveComponentType, LocationTypeEnum, StorageOptionLabel } from "@/lib/constants/enum";
import { getAppOptionData } from "@/lib/services/indexedDB/indexedDBService";
import { AppOptionInterface } from "@/lib/types/generalType";
import TimesheetUpdateView from "./_components/TimesheetUpdateView";
import { TimesheetSchema } from "@/lib/constants/schema";

export default function Review() {

    const [timesheetComponentType, setTimesheetComponentType] = useState(ActiveComponentType.timesheet);
    const [timesheetCollection, setTimesheetCollection] = useState({} as TimesheetCollectionInterface);
    const [activeTimesheetIndexInCollection, setActiveTimesheetIndexInCollection] = useState(0);
    const [timesheet, setTimesheet] = useState({} as Timesheet);
    const [groupedTimesheet, setGroupedTimesheet] = useState({} as Partial<Record<number | string, TimesheetEntry[]>>);
    const [weeksInGroupedTimesheet, setWeeksInGroupedTimesheet] = useState([] as string[]);

    useEffect(() => {
        var retrievedTimesheet;
        const initializer = async () => {
            const _timesheetComponentTypeAppOption: AppOptionInterface = await getAppOptionData(StorageOptionLabel.activeComponentType);
            const _timesheetComponentType: ActiveComponentType = _timesheetComponentTypeAppOption.value;
            setTimesheetComponentType(_timesheetComponentType ?? ActiveComponentType.timesheet);
            if (_timesheetComponentType == ActiveComponentType.timesheetCollection) {
                const _timesheetCollectionIdAppOption: AppOptionInterface = await getAppOptionData(StorageOptionLabel.activeTimesheetCollectionIdLabel);
                const _timesheetCollectionId: number = _timesheetCollectionIdAppOption.value;
                const _timesheetCollection = await Timesheet.getTimesheetCollectionFromId(_timesheetCollectionId);
                setTimesheetCollection(_timesheetCollection);
            } else {
                const _timesheetIdAppOption: AppOptionInterface = await getAppOptionData(StorageOptionLabel.activeTimesheetIdLabel);
                const _timesheetId: number = _timesheetIdAppOption.value;
                const _timesheet = await Timesheet.getTimesheetFromId(_timesheetId);
                setTimesheet(_timesheet);
            }
        }

        initializer();

        try {
            retrievedTimesheet = TimesheetLocalStorage.getTimesheetFromLocalStorage();
            setTimesheet(retrievedTimesheet);
            let _groupedTimesheetEntry = retrievedTimesheet.timesheetEntriesByWeek
            let _weeksInGroupedTimesheet: string[] = Object.keys(_groupedTimesheetEntry)
            setGroupedTimesheet(_groupedTimesheetEntry);
            setWeeksInGroupedTimesheet(_weeksInGroupedTimesheet)
        } catch (e) {
            if (e instanceof CannotParsePrimitiveDataToTimesheetError) {
                console.log(e);
            }
        }

    }, []);

    function updateTimesheetEntryCollection(weekNumber: number, updatedTimesheetEntryFormData: PrimitiveTimesheetEntryDataInterface) {
        try {
            /* let updatedTimesheetEntryCollection: TimesheetEntry[] = timesheet.entryCollection.map((timesheetEntry: TimesheetEntry) => {
                if (timesheetEntry.id == updatedTimesheetEntryFormData.id) {
                    return new TimesheetEntry({ ...timesheetEntry, entryPeriod: new TimesheetEntryPeriod({ startTime: updatedTimesheetEntryFormData.startTime, finishTime: updatedTimesheetEntryFormData.finishTime }), locationType: updatedTimesheetEntryFormData.locationType as LocationTypeEnum, comment: updatedTimesheetEntryFormData.comment })
                }
                return timesheetEntry;
            });
            let updatedTimesheet = new Timesheet({ meta: timesheet.meta, entryCollection: updatedTimesheetEntryCollection })
            setTimesheet(updatedTimesheet);
            setGroupedTimesheet(updatedTimesheet.timesheetEntryCollectionByWeek); */
            // return true;
        } catch (e) { }
        throw Error;
    }

    async function handleUpdateTimesheet(updatedTimesheet: TimesheetInterface) {
        try {
            // const originalCorrespondingTimesheet = timesheetCollection.collection.filter((t) => t.id === updatedTimesheet.id)[0];
            // const updatedTimesheetSchema = await Timesheet.convertPrimitiveToSchema(updatedPrimitiveTimesheet, originalCorrespondingTimesheet.personnel, originalCorrespondingTimesheet.weekEndingDate);
            await Timesheet.updateTimesheetInDb(updatedTimesheet);
            const updatedCorrespondingTimesheet = new Timesheet(updatedTimesheet);
            setTimesheetCollection({
                ...timesheetCollection, collection: timesheetCollection.collection.map((t) => {
                    if (t.id === updatedTimesheet.id) return updatedCorrespondingTimesheet
                    else return t
                })
            })
            return
            /* let updatedTimesheetEntryCollection: TimesheetEntry[] = timesheet.entryCollection.map((timesheetEntry: TimesheetEntry) => {
                if (timesheetEntry.id == updatedTimesheetEntryFormData.id) {
                    return new TimesheetEntry({ ...timesheetEntry, entryPeriod: new TimesheetEntryPeriod({ startTime: updatedTimesheetEntryFormData.startTime, finishTime: updatedTimesheetEntryFormData.finishTime }), locationType: updatedTimesheetEntryFormData.locationType as LocationTypeEnum, comment: updatedTimesheetEntryFormData.comment })
                }
                return timesheetEntry;
            });
            let updatedTimesheet = new Timesheet({ meta: timesheet.meta, entryCollection: updatedTimesheetEntryCollection })
            setTimesheet(updatedTimesheet);
            setGroupedTimesheet(updatedTimesheet.timesheetEntryCollectionByWeek); */
            // return true;
        } catch (e) {
            console.log(e)
        }
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
            <div>
                <DefaultSection>
                    <div className="print:hidden">
                        <DefaultSectionHeader>
                            <div>
                                <div className="preview-header-group main-title group-1 mb-4">
                                    <DefaultSectionTitle>Timesheet Preview</DefaultSectionTitle>
                                    {/* {timesheet.meta != undefined ?
                                        <div className="timesheet-period">
                                            <p className="text-base font-medium italic">
                                                {timesheet.meta.mobilizationDate != undefined && timesheet?.meta.mobilizationDate != null ?
                                                    <span>{new TimesheetDate(timesheet?.meta.mobilizationDate).simpleFormat()}</span>
                                                    : ''}
                                                <span className="px-3">-</span>
                                                {timesheet?.meta.demobilizationDate != undefined && timesheet?.meta.demobilizationDate != null ?
                                                    <span>{new TimesheetDate(timesheet?.meta.demobilizationDate!).simpleFormat()}</span> : ''}
                                            </p>
                                        </div> : ''} */}

                                </div>
                                <div className="preview-header-group group-2 flex justify-between">
                                    {timesheetCollection?.collection ?
                                        <div className="timesheet-owner-group  ">
                                            <h5 className="text-2xl font-medium rounded  p-2 bg-slate-100">Personnel Name: {timesheetCollection?.collection[0].personnel.name}</h5>
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
                        <div className="timesheet-collection-container w-full">
                            <div className="timesheet-collection-navigation">
                                {timesheetCollection?.collection ?
                                    <div className="flex justify-between mb-2">
                                        <button type="button" onClick={(e) => activeTimesheetIndexInCollection > 0 ? setActiveTimesheetIndexInCollection(activeTimesheetIndexInCollection - 1) : ''} className={`px-3 py-1 text-xs rounded ${activeTimesheetIndexInCollection == 0 ? 'bg-slate-300 text-gray-400' : 'bg-slate-600 text-white'}`}>Prev</button>

                                        <div className="flex gap-x-1">
                                            {
                                                timesheetCollection.collection.map((c, i) =>
                                                    <span key={i} className={`inline-flex w-2 h-2 rounded-full transition ease-in-out duration-100 ${i == activeTimesheetIndexInCollection ? 'bg-slate-700' : 'bg-slate-200'}`}></span>
                                                )
                                            }
                                        </div>

                                        <button type="button" onClick={(e) => activeTimesheetIndexInCollection < timesheetCollection.collection.length - 1 ? setActiveTimesheetIndexInCollection(activeTimesheetIndexInCollection + 1) : ''} className={`px-3 py-1 text-xs rounded ${activeTimesheetIndexInCollection == timesheetCollection.collection.length - 1 ? 'bg-slate-300 text-gray-400' : 'bg-slate-600 text-white'}`}>Next</button>
                                    </div>
                                    : ''}
                            </div>
                            {timesheetCollection?.collection ? (
                                <div className="timesheet-collection w-full overflow-x-hidden">
                                    <div className="flex flex-nowrap flex-row w-full">
                                        {timesheetCollection.collection.map((timesheet) =>
                                            <div className="shrink-0 w-full transition ease-in-out duration-500" key={timesheet.id} style={{ transform: `translateX(-${activeTimesheetIndexInCollection * 100}%)` }}>
                                                {timesheet?.entries ?
                                                    <div className="timesheet-table text-left">
                                                        <TimesheetUpdateView timesheetData={timesheet} handleSaveTimesheet={(e: any, updatedTimesheet: Timesheet) => { handleUpdateTimesheet(updatedTimesheet) }} />
                                                    </div> : ''
                                                }
                                                {/* updateTimesheetEntryCollection(timesheet.weekNumber, e) */}
                                                {/* Print Section */}
                                                {/* <PrintTimesheetWithDefaultTemplate currentWeek={currentWeek} groupedTimesheet={groupedTimesheet} timesheetMeta={timesheet.meta} /> */}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : ''}

                        </div>
                    </div>
                    <footer className="py-8 print:hidden">
                        <div className="">
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
                            <div>
                                <button type="button" onClick={(e) => createXlsxTimesheetStandardTemplateWithExcelJs(timesheet)}>Create Excel file</button>

                                <button type="button" onClick={(e) => createPdfWithJsPdfAutoTable(timesheet)}>Create PDF file</button>
                            </div>
                        </div>
                    </footer>
                </DefaultSection>
            </div>
        </main>
    );
}