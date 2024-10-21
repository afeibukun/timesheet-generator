'use client'
import Link from "next/link";
import DefaultSection from "../_components/DefaultSection";
import { TimesheetEntry } from "@/lib/services/timesheet/timesheetEntry";
import { useEffect, useState } from "react";
import { TimesheetLocalStorage } from "@/lib/services/timesheet/timesheetLocalStorage";
import { Timesheet } from "@/lib/services/timesheet/timesheet";
import { TimesheetCollection } from "@/lib/types/timesheet";
import { ComponentType, SearchParamsLabel, ToastStatus } from "@/lib/constants/constant";
import { PrimitiveDefaultTimesheetEntry } from "@/lib/types/primitive";
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
            if (component == ComponentType.timesheetCollection) {
                if (key) {
                    const _timesheetCollection = await Timesheet.getTimesheetCollectionFromKey(key);
                    setTimesheetCollection(_timesheetCollection);
                }
            } else {
                if (key) {
                    const _timesheet = await Timesheet.getTimesheetFromKey(key);
                    if (_timesheet) setTimesheet(_timesheet);
                }
            }
        }
        initializer();
    }, []);

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
        </main>
    );
}