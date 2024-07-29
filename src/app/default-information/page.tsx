'use client'

import Link from "next/link";
import DefaultSection from "../_components/DefaultSection";
import DefaultSectionHeader from "../_components/DefaultSectionHeader";
import DefaultSectionTitle from "../_components/DefaultSectionTitle";
import DefaultFormItem from "../_components/DefaultFormItem";
import DefaultLabelText from "../_components/DefaultLabelText";
import { useEffect, useState } from "react";
import { DefaultTimesheetInformation } from "@/lib/types/timesheetType";
import { defaultTimesheetInformationLabel, statusConstants } from "@/lib/constants";
import moment from "moment";
import SubmitButton02 from "../_components/SubmitButton02";

export default function DefaultTimesheetInformationView() {
    let _initialTimesheetDefaultInformation: DefaultTimesheetInformation = {
        startTime: '06:00',
        finishTime: '18:00',
        locationType: 'onshore',
        comment: 'Technical support',
        weekStartDay: "monday",
        updatedAt: ''
    }
    const [timesheetDefaultInformation, setTimesheetDefaultInformation] = useState(_initialTimesheetDefaultInformation);

    const [status, setStatus] = useState(statusConstants.enteringData);

    useEffect(() => {
        const rawDefaultTimesheetInformation = localStorage.getItem(defaultTimesheetInformationLabel);
        if (rawDefaultTimesheetInformation != null) {
            setTimesheetDefaultInformation(JSON.parse(rawDefaultTimesheetInformation));
        }
    }, []);

    let daysOfTheWeek: string[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

    function handleInputChange(e: any, informationKey: string) {
        setTimesheetDefaultInformation({ ...timesheetDefaultInformation, [informationKey]: e.target.value });
    }

    function handleSubmitDefaultInformation(e: any) {
        e.preventDefault();
        e.stopPropagation();
        setStatus(statusConstants.submitting);
        const updatedAtDate = moment().format("MMMM DD YYYY HH:mm:ss");
        setTimesheetDefaultInformation({ ...timesheetDefaultInformation, updatedAt: updatedAtDate });
        localStorage.setItem(defaultTimesheetInformationLabel, JSON.stringify(timesheetDefaultInformation));
        setStatus(statusConstants.submitted);
    }

    return (
        <main>
            <DefaultSection>
                <DefaultSectionHeader>
                    <DefaultSectionTitle>Default Information</DefaultSectionTitle>
                </DefaultSectionHeader>
                <div className="section-body">
                    <form action="">
                        <DefaultFormItem>
                            <label htmlFor="defaultStartTime">
                                <DefaultLabelText>Start Time</DefaultLabelText>
                            </label>
                            <input type="time"
                                value={timesheetDefaultInformation.startTime}
                                onChange={
                                    e => {
                                        handleInputChange(e, 'startTime');
                                    }
                                }
                                name="defaultStartTime"
                                id="defaultStartTime"
                                className="inline-block border rounded" />
                        </DefaultFormItem>
                        <DefaultFormItem>
                            <label htmlFor="defaultFinishTime">
                                <DefaultLabelText>Finish Time</DefaultLabelText>
                            </label>
                            <input type="time"
                                value={timesheetDefaultInformation.finishTime}
                                onChange={
                                    e => {
                                        handleInputChange(e, 'finishTime')
                                    }
                                }
                                name="defaultFinishTime"
                                id="defaultFinishTime"
                                className="inline-block border rounded" />
                        </DefaultFormItem>
                        <DefaultFormItem>
                            <label htmlFor="defaultLocationType">
                                <DefaultLabelText>Location Type</DefaultLabelText>
                            </label>
                            <select
                                name="defaultLocationType"
                                id="defaultLocationType"
                                value={timesheetDefaultInformation.locationType}
                                onChange={
                                    e => {
                                        handleInputChange(e, 'locationType')
                                    }
                                }
                                className="inline-block border rounded">
                                <option value="onshore">Onshore</option>
                                <option value="offshore">Offshore</option>
                            </select>
                        </DefaultFormItem>
                        <DefaultFormItem>
                            <label htmlFor="defaultComment">
                                <DefaultLabelText>Comment</DefaultLabelText>
                            </label>
                            <textarea
                                name="defaultComment"
                                value={timesheetDefaultInformation.comment}
                                onChange={
                                    e => {
                                        handleInputChange(e, 'comment')
                                    }
                                }
                                id="defaultComment"
                                cols={30} rows={3} className="inline-block border rounded p-2"></textarea>
                        </DefaultFormItem>

                        <DefaultFormItem>
                            <label htmlFor="weekStartDay">
                                <DefaultLabelText>Week Start Day</DefaultLabelText>
                            </label>
                            <select
                                name="weekStartDay"
                                value={timesheetDefaultInformation.weekStartDay}
                                onChange={
                                    e => {
                                        handleInputChange(e, 'weekStartDay')
                                    }
                                }
                                id="weekStartDay"
                                className="inline-block border rounded capitalize">
                                {daysOfTheWeek.map((day) => <option key={day} value={day} className="capitalize">{day}</option>)}
                            </select>
                        </DefaultFormItem>

                        <DefaultFormItem>
                            <div>
                                <div>
                                    <div className="py-2">
                                        <p className="text-sm text-blue-700">
                                            <span className="font-semibold">Last Saved: </span>
                                            <span className="font-medium italic">{timesheetDefaultInformation.updatedAt}</span></p>
                                    </div>
                                </div>
                                <div>
                                    {
                                        status == statusConstants.submitted ? (
                                            <div className="p-4 mb-2 rounded bg-green-200">
                                                <p className="text-sm text-green-900"><span>🎉</span><span>The Default Timesheet Information has been successfully saved</span></p>
                                            </div>
                                        ) : ''
                                    }
                                </div>
                            </div>
                            <div className="flex gap-x-4">
                                <SubmitButton02 handleButtonClick={handleSubmitDefaultInformation} showLoading={status == statusConstants.submitting} loadingText="Saving">Save Default Info</SubmitButton02>

                                <Link href="/" className="px-8 py-2 rounded uppercase text-sm font-semibold border ">Go Back</Link>
                            </div>
                        </DefaultFormItem>
                    </form>
                </div>
                <footer>

                </footer>
            </DefaultSection>
        </main>
    );
}

