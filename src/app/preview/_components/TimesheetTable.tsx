import { EntryStateEnum, LocationTypeEnum } from "@/lib/constants/enum";
import { TimesheetDate } from "@/lib/services/timesheet/timesheetDate";
import { TimesheetEntry } from "@/lib/services/timesheet/timesheetEntry";
import { TimesheetEntryPeriod } from "@/lib/services/timesheet/timesheetEntryPeriod";
import { PrimitiveTimesheetEntryDataInterface } from "@/lib/types/timesheetType";
import { useEffect, useState } from "react";


export default function TimesheetTable({ timesheetEntryCollectionData, handleTimesheetEntryCollectionUpdate }: any) {

    const [editableTimesheetCollection, setEditableTimesheetCollection] = useState(timesheetEntryCollectionData.map((entry: any) => {
        return { ...entry, 'startTime': entry.entryPeriod.startTime, 'finishTime': entry.entryPeriod.finishTime, state: EntryStateEnum.default, updatedAt: null } as PrimitiveTimesheetEntryDataInterface
    }) as PrimitiveTimesheetEntryDataInterface[]);


    const updateEditableTimsheetEntryState = (timesheetEntryId: number, entryState: EntryStateEnum) => {
        setEditableTimesheetCollection(editableTimesheetCollection.map((editableTimesheetEntry: PrimitiveTimesheetEntryDataInterface) => {
            if (editableTimesheetEntry.id == timesheetEntryId) {
                return { ...editableTimesheetEntry, state: entryState };
            }
            return editableTimesheetEntry
        }));
    }

    function handleEditButtonClick(e: any, timesheetEntryId: number) {
        updateEditableTimsheetEntryState(timesheetEntryId, EntryStateEnum.edit);
    }

    function handleBackButtonClick(e: any, timesheetEntryId: number) {
        updateEditableTimsheetEntryState(timesheetEntryId, EntryStateEnum.default);
    }

    function handleInputChange(e: any, timesheetEntryId: number, entryItemKey: string,) {
        let entryItemValue = e.target.value;
        setEditableTimesheetCollection(editableTimesheetCollection.map((editableTimesheetEntry) => {
            if (editableTimesheetEntry.id == timesheetEntryId) {
                return { ...editableTimesheetEntry, [entryItemKey]: entryItemValue };
            }
            return editableTimesheetEntry
        }));
    }

    function handleSaveButtonClick(e: any, timesheetEntryId: number) {
        try {
            let entry = selectedEditableTimesheetEntry(timesheetEntryId);
            handleTimesheetEntryCollectionUpdate({ id: entry.id, startTime: entry.startTime, finishTime: entry.finishTime, locationType: entry.locationType, comment: entry.comment });
            updateEditableTimsheetEntryState(timesheetEntryId, EntryStateEnum.recentlyUpdated);
            setTimeout(() => {
                updateEditableTimsheetEntryState(timesheetEntryId, EntryStateEnum.default);
            }, 5000)
        } catch (e) {

        }
    }

    const selectedEditableTimesheetEntry = (timesheetEntryId: number) => editableTimesheetCollection.filter((editableTimesheetEntry: PrimitiveTimesheetEntryDataInterface) => editableTimesheetEntry.id == timesheetEntryId)[0];

    function isEntryInEditState(timesheetEntryId: number) {
        let entry = selectedEditableTimesheetEntry(timesheetEntryId);
        if (entry.state == EntryStateEnum.edit) return true
        return false
    }

    const setRecentlySavedField = (timesheetEntryId: number, isRecentlySaved: boolean) => {
        let updatedEditableTimesheetCollection = editableTimesheetCollection.map((editableTimesheetEntry: PrimitiveTimesheetEntryDataInterface) => {
            if (editableTimesheetEntry.id == timesheetEntryId) {
                return { ...editableTimesheetEntry, isRecentlySaved: !!isRecentlySaved }
            }
            return editableTimesheetEntry;
        });
        setEditableTimesheetCollection(updatedEditableTimesheetCollection);
    }

    let timesheetTableMarkup = timesheetEntryCollectionData.map((timesheetEntry: TimesheetEntry) =>
        <tr key={timesheetEntry.id} className="px-2 odd:bg-white even:bg-slate-50">
            <td className="pl-4">
                <span className="flex flex-col pr-2 py-2">
                    <span className="text-sm font-normal">{timesheetEntry.entryDateDayLabel}</span>
                    <span className="text-[10px]">{timesheetEntry.entryDateInDayMonthFormat}</span>
                </span>
            </td>
            <td>
                <span className="flex flex-col gap-y-1 pr-2 py-2">
                    <span className="flex gap-x-1 items-center">
                        <span className="inline-block min-w-10 text-sm">Start</span>
                        <span className="inline-block min-w-16 text-sm text-center">
                            {timesheetEntry.entryPeriod != null && timesheetEntry.entryPeriod.startTime != null ?
                                <span className="inline-block w-full">
                                    {!isEntryInEditState(timesheetEntry.id) ?
                                        <span className="inline-block w-full border px-2 py-1 text-sm text-center">
                                            <span>{timesheetEntry.entryPeriod.startTime}</span>
                                        </span> :
                                        <span className="inline-block">
                                            <label htmlFor={`startTime-${timesheetEntry.id}`} className="sr-only">Start Time</label>
                                            <input
                                                value={editableTimesheetCollection.filter((entry) => entry.id == timesheetEntry.id)[0].startTime}
                                                onChange={(e) => handleInputChange(e, timesheetEntry.id, 'startTime')}
                                                type="time"
                                                name={`startTime-${timesheetEntry.id}`}
                                                id={`startTime-${timesheetEntry.id}`}
                                                className="px-0.5 border text-xs" />
                                        </span>
                                    }
                                </span>
                                :
                                <span className="inline-block w-full px-2 py-1 text-sm text-center bg-gray-300">
                                    <span className="invisible">00:00</span>
                                </span>
                            }
                        </span>
                    </span>
                    <span className="flex gap-x-1 items-center">
                        <span className="inline-block min-w-10 text-sm">Finish</span>
                        <span className="inline-block min-w-16  text-sm text-center">
                            {timesheetEntry.entryPeriod != null && timesheetEntry.entryPeriod.finishTime != null ?
                                <span className="inline-block w-full">
                                    {!isEntryInEditState(timesheetEntry.id) ?
                                        <span className="inline-block w-full border px-2 py-1 text-sm text-center">
                                            <span>{timesheetEntry.entryPeriod.finishTime}</span>
                                        </span>
                                        :
                                        <span className="inline-block">
                                            <label htmlFor={`finishTime-${timesheetEntry.id}`} className="sr-only">Finish Time</label>
                                            <input
                                                value={editableTimesheetCollection.filter((entry) => entry.id == timesheetEntry.id)[0].finishTime}
                                                onChange={(e) => handleInputChange(e, timesheetEntry.id, 'finishTime')} type="time" name={`finishTime-${timesheetEntry.id}`} id={`finishTime-${timesheetEntry.id}`}
                                                className="px-0.5 border text-xs" />
                                        </span>
                                    }
                                </span>

                                :
                                <span className="inline-block w-full px-2 py-1 text-sm text-center bg-gray-300">
                                    <span className="invisible">00:00</span>
                                </span>
                            }
                        </span>
                    </span>
                </span>
            </td>
            <td>
                {new TimesheetEntryPeriod(timesheetEntry.entryPeriod!).isValid ?
                    <span className="inline-block pl-2 pr-2 py-2">
                        <span className="font-semibold mr-1">
                            {!isEntryInEditState(timesheetEntry.id) ?
                                <span>{new TimesheetEntryPeriod(timesheetEntry.entryPeriod!).totalHours}
                                </span> :
                                <span className="text-slate-500">{new TimesheetEntryPeriod({ startTime: editableTimesheetCollection.filter((entry) => entry.id == timesheetEntry.id)[0].startTime, finishTime: editableTimesheetCollection.filter((entry) => entry.id == timesheetEntry.id)[0].finishTime }).totalHours}
                                </span>
                            }
                        </span>
                        <span className="text-xs">hrs</span>
                    </span> : ''}
            </td>
            <td>
                <span className="inline-block px-1">
                    {timesheetEntry.locationType != null && timesheetEntry.locationType != undefined ?
                        <span>
                            {!isEntryInEditState(timesheetEntry.id) ?
                                <span className="inline-block pr-2 py-2 text-sm capitalize">{timesheetEntry.locationType}</span>
                                :
                                <span>
                                    <select
                                        value={editableTimesheetCollection.filter((entry) => entry.id == timesheetEntry.id)[0].locationType}
                                        onChange={(e) => handleInputChange(e, timesheetEntry.id, 'locationType')} name={`location-${timesheetEntry.id}`}
                                        id={`location-${timesheetEntry.id}`} title="Location"
                                        className="text-xs">
                                        <option value={LocationTypeEnum.onshore}>Onshore</option>
                                        <option value={LocationTypeEnum.offshore}>Offshore</option>
                                    </select>
                                </span>
                            }
                        </span>
                        : ''
                    }
                </span>
            </td>
            <td>
                <span className="inline-block px-1.5 py-2">
                    <span className="inline-block text-sm">
                        {timesheetEntry.comment != null ?
                            <span className="inline-block">
                                {!isEntryInEditState(timesheetEntry.id) ?
                                    <span className="inline-block border p-1 max-h-16 scroll-auto">
                                        <span className="inline-block">{timesheetEntry.comment}</span>
                                    </span>
                                    :
                                    <span>
                                        <textarea
                                            value={editableTimesheetCollection.filter((entry) => entry.id == timesheetEntry.id)[0].comment}
                                            onChange={(e) => handleInputChange(e, timesheetEntry.id, 'comment')} name={`comment-${timesheetEntry.id}`}
                                            id={`comment-${timesheetEntry.id}`} title="Comment" className="border text-sm"></textarea>
                                    </span>
                                }
                            </span> :
                            <span className="p-1 bg-gray-200">
                                <span className="invisible">No Comments As you can see</span>
                            </span>
                        }
                    </span>
                </span>
            </td>
            <td className="pl-1 pr-4">
                <div className="py-2">
                    {!timesheetEntry.isNullEntry ?
                        <div className="inline-flex gap-1.5">
                            {!isEntryInEditState(timesheetEntry.id) ?
                                <div className="inline-flex gap-1.5 items-center relative">
                                    <button type="button" onClick={(e) => handleEditButtonClick(e, timesheetEntry.id)} className="px-3 py-1 rounded text-sm text-white bg-blue-600">Edit</button>
                                    {editableTimesheetCollection.filter((entry) => entry.id == timesheetEntry.id)[0].state == EntryStateEnum.recentlyUpdated ?
                                        <p className="inline-block absolute -right-8 text-xs text-green-700">
                                            <span className="inline-block bg-green-200 px-2 py-1 rounded font-semibold">✔</span>
                                        </p>
                                        : ''}
                                    {/* <button type="button" className="invisible px-3 py-1 rounded text-sm text-white bg-slate-600">Edit</button> */}
                                </div> :
                                <div className="inline-flex gap-1.5">
                                    <button type="button" onClick={(e) => handleSaveButtonClick(e, timesheetEntry.id)} className="px-3 py-1 rounded text-sm text-white bg-green-600">Save</button>
                                    {/* <button type="button" onClick={(e) => handleBackButtonClick(e, timesheetEntry.id)} className="px-3 py-1 rounded text-sm text-white bg-slate-600">Back</button> */}
                                </div>
                            }
                        </div>
                        : ''}
                </div>
            </td>
        </tr >
    )
    return (
        <table className="w-full table-auto">
            <thead>
                <tr className="text-xs">
                    <th className="border-b border-slate-600 pl-4 ">Date</th>
                    <th className="border-b border-slate-600"><span className="inline-block pr-2">Period</span></th>
                    <th className="border-b border-slate-600 text-xs"><span className="inline-block pl-2 pr-2">Total hours</span></th>
                    <th className="border-b border-slate-600 text-xs"><span className="inline-block pr-2">Location</span></th>
                    <th className="border-b border-slate-600 w-56"><span className="inline-block pr-2">Comment</span></th>
                    <th className="border-b border-slate-600 pr-4">{' '}</th>
                </tr>
            </thead>
            <tbody>
                {timesheetTableMarkup}
            </tbody>
        </table>)
}