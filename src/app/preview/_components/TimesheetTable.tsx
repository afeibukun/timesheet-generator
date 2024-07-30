import { TimesheetDate } from "@/lib/services/timesheet/timesheetDate";
import { TimesheetEntry } from "@/lib/services/timesheet/timesheetEntry";
import { TimesheetEntryPeriod } from "@/lib/services/timesheet/timesheetEntryPeriod";


export default function TimesheetTable({ timesheetEntryCollectionData }: any) {

    let timesheetTableMarkup = timesheetEntryCollectionData.map((timesheetEntry: TimesheetEntry) =>
        <tr key={timesheetEntry.id} className="px-2 odd:bg-white even:bg-slate-50">
            <td className="pl-4">
                <span className="flex flex-col pr-2 py-2">
                    <span className="text-sm font-normal">{new TimesheetDate(timesheetEntry.date).dayLabel}</span>
                    <span className="text-[10px]">{new TimesheetDate(timesheetEntry.date).dateInDayMonthFormat}</span>
                </span>
            </td>
            <td>
                <span className="flex flex-col gap-y-1 pr-2 py-2">
                    <span className="flex gap-x-1 items-center">
                        <span className="inline-block min-w-10 text-sm">Start</span>
                        <span className="inline-block min-w-16 px-2 py-1 border text-sm text-center">{timesheetEntry.entryPeriod!.startTime}</span>
                    </span>
                    <span className="flex gap-x-1 items-center">
                        <span className="inline-block min-w-10 text-sm">Finish</span>
                        <span className="inline-block min-w-16 px-2 py-1 border text-sm text-center">{timesheetEntry.entryPeriod!.finishTime}</span>
                    </span>
                </span>
            </td>
            <td>
                {new TimesheetEntryPeriod(timesheetEntry.entryPeriod!).isValid ?
                    <span className="inline-block pr-2 py-2">
                        <span className="font-semibold mr-1">{new TimesheetEntryPeriod(timesheetEntry.entryPeriod!).totalHours}</span>
                        <span className="text-xs">hrs</span>
                    </span> : ''}
            </td>
            <td>
                <span className="inline-block pr-2 py-2 text-sm capitalize">{timesheetEntry.locationType}</span>
            </td>
            <td>
                <span className="inline-block pr-2 py-2">
                    <span className="inline-block border p-1 text-sm">{timesheetEntry.comment}</span>
                </span>
            </td>
            <td className="pr-4">
                <div className="py-2">
                    <button type="button" className="px-3 py-1 rounded text-sm text-white bg-blue-600">Edit</button>
                </div>
            </td>
        </tr>
    )
    return (
        <table className="w-full table-auto">
            <thead>
                <tr className="text-sm">
                    <th className="border-b border-slate-600 pl-4">Date</th>
                    <th className="border-b border-slate-600"><span className="inline-block pr-2">Period</span></th>
                    <th className="border-b border-slate-600"><span className="inline-block pr-2">Total hours</span></th>
                    <th className="border-b border-slate-600"><span className="inline-block pr-2">Location</span></th>
                    <th className="border-b border-slate-600"><span className="inline-block pr-2">Comment</span></th>
                    <th className="border-b border-slate-600 pr-4">{' '}</th>
                </tr>
            </thead>
            <tbody>
                {timesheetTableMarkup}
            </tbody>
        </table>)
}