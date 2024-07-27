import Link from "next/link";
import DefaultSection from "../_components/DefaultSection";
import DefaultSectionHeader from "../_components/DefaultSectionHeader";
import DefaultSectionTitle from "../_components/DefaultSectionTitle";
import DefaultFormItem from "../_components/DefaultFormItem";
import DefaultLabelText from "../_components/DefaultLabelText";

export default function DefaultData() {
    return (
        <main>
            <DefaultSection>
                <DefaultSectionHeader>
                    <DefaultSectionTitle>Default Data</DefaultSectionTitle>
                </DefaultSectionHeader>
                <div className="section-body">
                    <form action="">
                        <DefaultFormItem>
                            <label htmlFor="defaultStartTime">
                                <DefaultLabelText>Start Time</DefaultLabelText>
                            </label>
                            <input type="time" name="defaultStartTime" id="defaultStartTime" className="inline-block border rounded" />
                        </DefaultFormItem>
                        <DefaultFormItem>
                            <label htmlFor="defaultFinishTime">
                                <DefaultLabelText>Finish Time</DefaultLabelText>
                            </label>
                            <input type="time" name="defaultFinishTime" id="defaultFinishTime" className="inline-block border rounded" />
                        </DefaultFormItem>
                        <DefaultFormItem>
                            <label htmlFor="defaultLocationType">
                                <DefaultLabelText>Location Type</DefaultLabelText>
                            </label>
                            <select name="defaultLocationType" id="defaultLocationType" className="inline-block border rounded">
                                <option value="onshore">Onshore</option>
                                <option value="offshore">Offshore</option>
                            </select>
                        </DefaultFormItem>
                        <DefaultFormItem>
                            <label htmlFor="defaultComment">
                                <DefaultLabelText>Comment</DefaultLabelText>
                            </label>
                            <textarea name="defaultComment" id="defaultComment" cols={30} rows={3} className="inline-block border rounded p-2"></textarea>
                        </DefaultFormItem>

                        <DefaultFormItem>
                            <label htmlFor="weekStartDay">
                                <DefaultLabelText>Week Start Day</DefaultLabelText>
                            </label>
                            <select name="weekStartDay" id="weekStartDay" className="inline-block border rounded">
                                <option value="monday">Monday</option>
                                <option value="tuesday">Tuesday</option>
                                <option value="wednesday">Wednesday</option>
                                <option value="thursday">Thursday</option>
                                <option value="friday">Friday</option>
                                <option value="saturday">Saturday</option>
                                <option value="sunday">Sunday</option>
                            </select>
                        </DefaultFormItem>

                        <DefaultFormItem>
                            <div className="flex gap-x-4">
                                <button type="button" className="px-8 py-2 rounded uppercase text-sm font-semibold bg-purple-700 text-white">Save Default Data</button>
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