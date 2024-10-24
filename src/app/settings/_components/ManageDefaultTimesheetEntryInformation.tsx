'use client'
import DefaultFormItem from "@/app/_components/DefaultFormItem";
import DefaultLabelText from "@/app/_components/DefaultLabelText";
import DefaultSection from "@/app/_components/DefaultSection";
import DefaultSectionHeader from "@/app/_components/DefaultSectionHeader";
import DefaultSectionTitle from "@/app/_components/DefaultSectionTitle";
import SubmitButton02 from "@/app/_components/SubmitButton02";
import { LocationType, Status } from "@/lib/constants/constant";
import { defaultTimesheetEntryData, possibleWeekStartDays } from "@/lib/constants/default";
import { createOrUpdateTimesheetEntryDefaultData } from "@/lib/services/indexedDB/indexedDBService";
import { TimesheetDate } from "@/lib/services/timesheet/timesheetDate";
import { TimesheetEntry } from "@/lib/services/timesheet/timesheetEntry";
import { PrimitiveDefaultTimesheetEntry as PrimitiveDefaultTimesheetEntry } from "@/lib/types/primitive";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ManageDefaultTimesheetEntryInformation() {
    let _initialDefaultInfo: PrimitiveDefaultTimesheetEntry = defaultTimesheetEntryData

    const [defaultTimesheetEntryForm, setDefaultTimesheetEntryForm] = useState(_initialDefaultInfo);
    const [status, setStatus] = useState(Status.enteringData);

    useEffect(() => {
        const fetchSavedTimesheetEntryDefaultData = async () => {
            try {
                const _defaultTimesheetEntry = await TimesheetEntry.defaultInformation();
                setDefaultTimesheetEntryForm(_defaultTimesheetEntry);
            } catch (e) {
                // if there is an error, nothing is set then
            }
        }
        fetchSavedTimesheetEntryDefaultData();
    }, []);

    function handleInputChange(e: any, informationKey: string) {
        setDefaultTimesheetEntryForm({ ...defaultTimesheetEntryForm, [informationKey]: e.target.value });
    }

    async function handleSubmitDefaultTimesheetEntry(e: any) {
        e.preventDefault();
        e.stopPropagation();
        setStatus(Status.submitting);

        const _updatedAt = TimesheetDate.simpleNowDateTimeFormat();
        const _updatedDefaultTimesheetEntryInfo = { ...defaultTimesheetEntryForm, updatedAt: _updatedAt };
        setDefaultTimesheetEntryForm(_updatedDefaultTimesheetEntryInfo);

        // TimesheetLocalStorage.setDefaultInformationInLocalStorage(updatedDefaultTimesheetInfo);
        await createOrUpdateTimesheetEntryDefaultData(_updatedDefaultTimesheetEntryInfo);
        setStatus(Status.submitted);
    }

    return (
        <div>
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
                                value={defaultTimesheetEntryForm.startTime}
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
                                value={defaultTimesheetEntryForm.finishTime}
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
                                value={defaultTimesheetEntryForm.locationType}
                                onChange={
                                    e => {
                                        handleInputChange(e, 'locationType')
                                    }
                                }
                                className="inline-block border rounded capitalize">
                                <option value={LocationType.onshore}>{LocationType.onshore}</option>
                                <option value={LocationType.offshore}>{LocationType.offshore}</option>
                            </select>
                        </DefaultFormItem>
                        <DefaultFormItem>
                            <label htmlFor="defaultComment">
                                <DefaultLabelText>Comment</DefaultLabelText>
                            </label>
                            <textarea
                                name="defaultComment"
                                value={defaultTimesheetEntryForm.comment}
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
                                value={defaultTimesheetEntryForm.weekStartDay}
                                onChange={
                                    e => {
                                        handleInputChange(e, 'weekStartDay')
                                    }
                                }
                                id="weekStartDay"
                                className="inline-block border rounded capitalize">
                                {possibleWeekStartDays.map((day) => <option key={day} value={day} className="capitalize">{day}</option>)}
                            </select>
                        </DefaultFormItem>

                        <DefaultFormItem>
                            <div>
                                <div>
                                    <div className="py-2">
                                        <p className="text-sm text-blue-700">
                                            <span className="font-semibold">Last Saved: </span>
                                            <span className="font-medium italic">{defaultTimesheetEntryForm.updatedAt}</span></p>
                                    </div>
                                </div>
                                <div>
                                    {
                                        status == Status.submitted ? (
                                            <div className="p-4 mb-2 rounded bg-green-200">
                                                <p className="text-sm text-green-900"><span>🎉</span><span>The Default Timesheet Information has been successfully saved</span></p>
                                            </div>
                                        ) : ''
                                    }
                                </div>
                            </div>
                            <div className="flex gap-x-4">
                                <SubmitButton02 handleButtonClick={handleSubmitDefaultTimesheetEntry} showLoading={status == Status.submitting} loadingText="Saving">Save Default Info</SubmitButton02>

                                <Link href="/" className="px-8 py-2 rounded uppercase text-sm font-semibold border ">Go Back</Link>
                            </div>
                        </DefaultFormItem>
                    </form>
                </div>
                <footer>

                </footer>
            </DefaultSection>
        </div>
    )
}