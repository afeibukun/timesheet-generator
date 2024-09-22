'use client'

import Link from "next/link";
import DefaultSection from "../_components/DefaultSection";
import DefaultSectionHeader from "../_components/DefaultSectionHeader";
import DefaultSectionTitle from "../_components/DefaultSectionTitle";
import DefaultFormItem from "../_components/DefaultFormItem";
import DefaultLabelText from "../_components/DefaultLabelText";
import { useEffect, useState } from "react";
import { LocationTypeEnum, StatusEnum, storageOptionLabel } from "@/lib/constants/enum";
import SubmitButton02 from "../_components/SubmitButton02";
import { TimesheetDate } from "@/lib/services/timesheet/timesheetDate";
import { TimesheetLocalStorage } from "@/lib/services/timesheet/timesheetLocalStorage";
import { CannotParsePrimitiveDataToDefaultTimesheetInformationError } from "@/lib/services/timesheet/timesheetErrors";
import { defaultTimesheetEntryData, possibleWeekStartDays } from "@/lib/constants/defaultData";
import { DefaultPrimitiveTimesheetEntryDataInterface } from "@/lib/types/timesheetType";
import { createOrUpdateTimesheetEntryDefaultData, getTimesheetEntryDefaultData } from "@/lib/services/indexedDB/indexedDBService";
import { AppOptionSchema, appOptionStoreName } from "@/lib/constants/schema";

export default function DefaultTimesheetInformationView() {

    let _initialDefaultInfo: DefaultPrimitiveTimesheetEntryDataInterface = defaultTimesheetEntryData

    const [timesheetDefaultInformationFormData, setTimesheetDefaultInformationFormData] = useState(_initialDefaultInfo);

    const [status, setStatus] = useState(StatusEnum.enteringData);

    useEffect(() => {
        // var retrievedDefaultInfo
        let retrievedTimesheetEntryDefaultData

        const fetchSavedTimesheetEntryDefaultData = async () => {
            try {
                // retrievedDefaultInfo = TimesheetLocalStorage.getDefaultInformationFromLocalStorage();
                let retrievedData = await getTimesheetEntryDefaultData()
                if (retrievedData) {
                    retrievedTimesheetEntryDefaultData = retrievedData.value
                } else throw Error
            } catch (e) {
                if (e instanceof CannotParsePrimitiveDataToDefaultTimesheetInformationError) {
                    console.log(e.name);
                }
                // retrievedDefaultInfo = null
                retrievedTimesheetEntryDefaultData = null
            }
            /* if (retrievedDefaultInfo != null) {
                        setTimesheetDefaultInformationFormData(retrievedDefaultInfo);
                    } */
            if (retrievedTimesheetEntryDefaultData) {
                setTimesheetDefaultInformationFormData(retrievedTimesheetEntryDefaultData);
            }
        }
        fetchSavedTimesheetEntryDefaultData();
    }, []);

    function handleInputChange(e: any, informationKey: string) {
        setTimesheetDefaultInformationFormData({ ...timesheetDefaultInformationFormData, [informationKey]: e.target.value });
    }

    async function handleSubmitDefaultInformation(e: any) {
        e.preventDefault();
        e.stopPropagation();
        setStatus(StatusEnum.submitting);

        const updatedAtDate = TimesheetDate.simpleNowDateTimeFormat();
        const updatedDefaultTimesheetInfo = { ...timesheetDefaultInformationFormData, updatedAt: updatedAtDate };
        setTimesheetDefaultInformationFormData(updatedDefaultTimesheetInfo);

        // TimesheetLocalStorage.setDefaultInformationInLocalStorage(updatedDefaultTimesheetInfo);
        await createOrUpdateTimesheetEntryDefaultData(updatedDefaultTimesheetInfo);
        setStatus(StatusEnum.submitted);
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
                                value={timesheetDefaultInformationFormData.startTime}
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
                                value={timesheetDefaultInformationFormData.finishTime}
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
                                value={timesheetDefaultInformationFormData.locationType}
                                onChange={
                                    e => {
                                        handleInputChange(e, 'locationType')
                                    }
                                }
                                className="inline-block border rounded capitalize">
                                <option value={LocationTypeEnum.onshore}>{LocationTypeEnum.onshore}</option>
                                <option value={LocationTypeEnum.offshore}>{LocationTypeEnum.offshore}</option>
                            </select>
                        </DefaultFormItem>
                        <DefaultFormItem>
                            <label htmlFor="defaultComment">
                                <DefaultLabelText>Comment</DefaultLabelText>
                            </label>
                            <textarea
                                name="defaultComment"
                                value={timesheetDefaultInformationFormData.comment}
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
                                value={timesheetDefaultInformationFormData.weekStartDay}
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
                                            <span className="font-medium italic">{timesheetDefaultInformationFormData.updatedAt}</span></p>
                                    </div>
                                </div>
                                <div>
                                    {
                                        status == StatusEnum.submitted ? (
                                            <div className="p-4 mb-2 rounded bg-green-200">
                                                <p className="text-sm text-green-900"><span>🎉</span><span>The Default Timesheet Information has been successfully saved</span></p>
                                            </div>
                                        ) : ''
                                    }
                                </div>
                            </div>
                            <div className="flex gap-x-4">
                                <SubmitButton02 handleButtonClick={handleSubmitDefaultInformation} showLoading={status == StatusEnum.submitting} loadingText="Saving">Save Default Info</SubmitButton02>

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

