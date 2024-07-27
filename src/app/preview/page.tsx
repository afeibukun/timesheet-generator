import Link from "next/link";
import DefaultSection from "../_components/DefaultSection";
import DefaultSectionHeader from "../_components/DefaultSectionHeader";
import DefaultSectionTitle from "../_components/DefaultSectionTitle";
import InfoLabel from "./_components/InfoLabel";

export default function Preview() {
    let timesheetGroup: TimesheetEntry[] = [
        {
            id: 1,
            day: "Monday",
            date: "29 Apr 2024",
            startTime: "06:00",
            finishTime: "18:00",
            totalHours: 12,
            locationType: "onshore",
            comment: "Technical Support"
        },
        {
            id: 2,
            day: "Tuesday",
            date: "30 Apr 2024",
            startTime: "06:00",
            finishTime: "18:00",
            totalHours: 12,
            locationType: "onshore",
            comment: "Technical Support"
        },
        {
            id: 3,
            day: "Wednesday",
            date: "01 May 2024",
            startTime: "06:00",
            finishTime: "18:00",
            totalHours: 12,
            locationType: "onshore",
            comment: "Technical Support"
        },
        {
            id: 4,
            day: "Thursday",
            date: "02 May 2024",
            startTime: "06:00",
            finishTime: "18:00",
            totalHours: 12,
            locationType: "onshore",
            comment: "Technical Support"
        },
        {
            id: 5,
            day: "Friday",
            date: "03 May 2024",
            startTime: "06:00",
            finishTime: "18:00",
            totalHours: 12,
            locationType: "onshore",
            comment: "Technical Support"
        }
    ]

    let timesheetTableMarkup = timesheetGroup.map((timesheetEntry) =>
        <tr key={timesheetEntry.id} className="py-3">
            <td>
                <span className="flex flex-col pr-2">
                    <span className="text-sm font-normal">{timesheetEntry.day}</span>
                    <span className="text-[10px]">{timesheetEntry.date}</span>
                </span>
            </td>
            <td>
                <span className="flex flex-col gap-y-1 pr-2">
                    <span className="flex gap-x-1 items-center">
                        <span className="inline-block min-w-10 text-sm">Start</span>
                        <span className="inline-block min-w-16 px-2 py-1 border text-sm text-center">{timesheetEntry.startTime}</span>
                    </span>
                    <span className="flex gap-x-1 items-center">
                        <span className="inline-block min-w-10 text-sm">Finish</span>
                        <span className="inline-block min-w-16 px-2 py-1 border text-sm text-center">{timesheetEntry.finishTime}</span>
                    </span>
                </span>
            </td>
            <td>
                <span className="inline-block pr-2">
                    <span className="font-semibold mr-1">{timesheetEntry.totalHours.toString()}</span>
                    <span className="text-xs">hrs</span>
                </span>
            </td>
            <td>
                <span className="inline-block pr-2 text-sm capitalize">{timesheetEntry.locationType}</span>
            </td>
            <td>
                <span className="inline-block pr-2">
                    <span className="inline-block border p-1 text-sm">{timesheetEntry.comment}</span>
                </span>
            </td>
            <td><button type="button" className="px-3 py-1 rounded text-sm text-white bg-blue-600">Edit</button></td>
        </tr>
    )
    return (
        <main>
            <DefaultSection>
                <DefaultSectionHeader>
                    <div className="preview-header-group main-title group-1 mb-4">
                        <DefaultSectionTitle>Timesheet Preview</DefaultSectionTitle>
                        <div className="timesheet-period">
                            <p className="text-base font-medium italic">
                                <span>{'03/19/2021'}</span>
                                <span className="px-3">-</span>
                                <span>{'05/03/2021'}</span>
                            </p>
                        </div>
                    </div>
                    <div className="preview-header-group group-2 flex justify-between">
                        <div className="timesheet-owner-group  ">
                            <h5 className="text-3xl font-medium rounded  p-2 bg-slate-100">{'John Lagbaja'}</h5>
                        </div>
                        <div className="timesheet-owner-hours border p-2 rounded-md">
                            <p>Total hours</p>
                            <h3>
                                <span className="text-3xl font-semibold">
                                    <span>{37}</span>
                                    <span>h</span>
                                </span>
                                <span className="text-base font-light">
                                    <span>{30}</span>
                                    <span>m</span>
                                </span>
                            </h3>
                            <h5 className="text-sm text-center">
                                <span>{6}</span>
                                <span>days</span>
                            </h5>
                        </div>
                    </div>
                    <div className="preview-header-group group-3 flex gap-x-8">
                        <div className="customer-and-site-info">
                            <div className="customer-info-group mb-4">
                                <p>
                                    <InfoLabel>Customer</InfoLabel>
                                    <span className="info-value">{'Exxon Mobil'}</span>
                                </p>
                            </div>
                            <div className="site-info-group mb-4 ">
                                <p>
                                    <span className="site-info">
                                        <InfoLabel>Site Name</InfoLabel>
                                        <span className="info-value">{'QIT'}</span>
                                    </span>
                                    <span className="country-info">
                                        <span className="mr-4">,</span>
                                        <InfoLabel>Country</InfoLabel>
                                        <span className="info-value">{'Nigeria'}</span>
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="project-info-group">
                            <div className="purchase-order-number-group mb-4">
                                <p className="purchase-order-number-info">
                                    <InfoLabel>PO Number</InfoLabel>
                                    <span className="info-value">{'345678675432333'}</span>
                                </p>
                            </div>
                            <div className="order-number-group mb-4">
                                <p className="order-number-info">
                                    <InfoLabel>Order Number</InfoLabel>
                                    <span className="info-value">{'34564342te'}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </DefaultSectionHeader>
                <div className="section-body">
                    <div className="week-wrapper border p-4">
                        <div className="wrapper-header">
                            <h4 className="text-lg font-semibold">Week {5}</h4>
                        </div>
                        <div className="timesheet-table text-left">
                            <table>
                                <thead>
                                    <tr className="text-sm">
                                        <th>Date</th>
                                        <th><span className="inline-block pr-2">Period</span></th>
                                        <th><span className="inline-block pr-2">Total hours</span></th>
                                        <th><span className="inline-block pr-2">Location</span></th>
                                        <th><span className="inline-block pr-2">Comment</span></th>
                                        <th>{' '}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {timesheetTableMarkup}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <footer className="py-8">
                    <div className="flex gap-x-4">
                        <div>
                            <button type="button" className="inline-block px-8 py-2 rounded uppercase text-sm bg-purple-700 text-white">Save Data</button>
                        </div>
                        <div>
                            <Link href="/" className="inline-block px-8 py-2 rounded border">Go Back</Link>
                        </div>
                    </div>
                </footer>
            </DefaultSection>

        </main>
    );
}

type TimesheetEntry = {
    id: number,
    day: string,
    date: string,
    startTime: string,
    finishTime: string,
    totalHours: number,
    locationType: string,
    comment: string
}