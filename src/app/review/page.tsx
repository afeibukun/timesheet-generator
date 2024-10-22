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
import TimesheetNotFound from "./_components/TimesheetNotFound";

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

    let _initialTimesheetCollection: TimesheetCollection = {} as TimesheetCollection
    const [timesheetCollection, setTimesheetCollection] = useState(_initialTimesheetCollection);
    let _initialTimesheet: Timesheet = {} as Timesheet
    const [timesheet, setTimesheet] = useState(_initialTimesheet);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const initializer = async () => {
            try {
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
            } catch (e) {
                console.log(e)
                setNotFound(true)
            }
        }
        initializer();
    }, []);

    return (
        <main>
            <div>
                <>{component === ComponentType.timesheetCollection && timesheetCollection && !notFound ?
                    <TimesheetCollectionView timesheetCollection={timesheetCollection} setTimesheetCollection={setTimesheetCollection} />
                    : ''
                }
                </>
                <>{component === ComponentType.timesheet && timesheet && !notFound ?
                    <TimesheetView timesheet={timesheet} setTimesheet={setTimesheet} />
                    : ''
                }
                </>
                <>{notFound ? <TimesheetNotFound />
                    : ''
                }
                </>
            </div>
        </main>
    );
}