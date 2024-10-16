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
import { createXlsxTimesheetClassicTemplate } from "@/lib/services/xlsx/excelJsService";
import { createPdfWithJsPdfAutoTable } from "@/lib/services/pdf/jsPdfAutoTableService";
import { TimesheetCollection, TimesheetInterface } from "@/lib/types/timesheet";
import { ComponentType, LocationType, SearchParamsLabel, ToastStatus } from "@/lib/constants/constant";
import { getAppOptionData } from "@/lib/services/indexedDB/indexedDBService";
import { AppOptionInterface } from "@/lib/types/generalType";
import TimesheetUpdateView from "./_components/TimesheetUpdateView";
import { TimesheetSchema } from "@/lib/types/schema";
import ToastNotification from "../_components/ToastNotification";
import { PrimitiveDefaultTimesheetEntry } from "@/lib/types/primitive";
import { StorageLabel } from "@/lib/constants/storage";
import { useSearchParams } from "next/navigation";
import TimesheetView from "./_components/TimesheetView";
import TimesheetCollectionView from "./_components/TimesheetCollectionView";

type NotificationType = {
    display: boolean,
    text: string,
    status?: ToastStatus,
    icon?: any,
    bgColor?: string,
    progressBarColor?: string
}


export default function Preview() {

    const searchParams = useSearchParams();
    const component = searchParams.get(SearchParamsLabel.component) === ComponentType.timesheetCollection ? ComponentType.timesheetCollection : ComponentType.timesheet;
    const key = searchParams.get(SearchParamsLabel.key) ? Number(searchParams.get(SearchParamsLabel.key)) : undefined;

    const [timesheetComponentType, setTimesheetComponentType] = useState(ComponentType.timesheet);
    const [timesheetCollection, setTimesheetCollection] = useState({} as TimesheetCollection);
    const [activeTimesheetIndexInCollection, setActiveTimesheetIndexInCollection] = useState(0);
    const [timesheet, setTimesheet] = useState({} as Timesheet);
    const [showNotification, setShowNotification] = useState({ display: false, text: '' } as NotificationType);
    const [groupedTimesheet, setGroupedTimesheet] = useState({} as Partial<Record<number | string, TimesheetEntry[]>>);
    const [weeksInGroupedTimesheet, setWeeksInGroupedTimesheet] = useState([] as string[]);


    useEffect(() => {
        var retrievedTimesheet;
        const initializer = async () => {
            // const _timesheetComponentTypeAppOption: AppOptionInterface = await getAppOptionData(StorageLabel.activeComponentType);
            // const _timesheetComponentType: ComponentType = _timesheetComponentTypeAppOption.value;
            // setTimesheetComponentType(_timesheetComponentType ?? ComponentType.timesheet);
            if (component == ComponentType.timesheetCollection) {
                if (key) {
                    const _timesheetCollection = await Timesheet.getTimesheetCollectionFromKey(key);
                    setTimesheetCollection(_timesheetCollection);
                }
            } else {
                if (key) {
                    const _timesheet = await Timesheet.getTimesheetFromKey(key);
                    console.log("Timesheet - ", _timesheet)
                    if (_timesheet) setTimesheet(_timesheet);
                }
            }
        }
        initializer();
    }, []);

    function updateTimesheetEntryCollection(weekNumber: number, updatedTimesheetEntryFormData: PrimitiveDefaultTimesheetEntry) {
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

    async function handleUpdateTimesheet(updatedTimesheet: Timesheet) {
        try {
            // const originalCorrespondingTimesheet = timesheetCollection.collection.filter((t) => t.id === updatedTimesheet.id)[0];
            // const updatedTimesheetSchema = await Timesheet.convertPrimitiveToSchema(updatedPrimitiveTimesheet, originalCorrespondingTimesheet.personnel, originalCorrespondingTimesheet.weekEndingDate);
            if (updatedTimesheet) {
                await updatedTimesheet.updateTimesheetInDb();
                const updatedCorrespondingTimesheet = new Timesheet(updatedTimesheet);
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
                {component === ComponentType.timesheetCollection && timesheetCollection ?
                    <TimesheetCollectionView timesheetCollection={timesheetCollection} setTimesheetCollection={setTimesheetCollection} />
                    : component === ComponentType.timesheet && timesheet ?
                        <TimesheetView timesheet={timesheet} setTimesheet={setTimesheet} />
                        : <div>Data Not found </div>
                }
            </div>
            <DefaultSection>
                <div>
                    <div>
                        <Link href="/" className="inline-block px-8 py-2 rounded border">Go Home</Link>
                    </div>
                </div>
            </DefaultSection>
        </main>
    );
}