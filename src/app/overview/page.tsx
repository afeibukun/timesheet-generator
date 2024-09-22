import Link from "next/link";
import DefaultSection from "../_components/DefaultSection";
import DefaultSectionHeader from "../_components/DefaultSectionHeader";
import DefaultSectionTitle from "../_components/DefaultSectionTitle";

export default function Overview() {
    return (
        <main className="container">
            <div>
                <DefaultSection>
                    <div className="print:hidden">
                        <DefaultSectionHeader>
                            <div className="preview-header-group main-title group-1 mb-4">
                                <DefaultSectionTitle>Timesheet Overview</DefaultSectionTitle>
                                <div className="button-group py-4 flex gap-x-4">
                                    <Link href="/" className="py-3 px-6 rounded border">Go Back</Link>
                                </div>
                                <div>
                                    <label htmlFor="timesheet-week">Choose a week you want to generate timesheet for:</label>
                                    <input type="week" name="week" id="timesheet-week" /* min="2018-W18" max="2018-W26" */ required />
                                    <button type="button">Generate Timesheet</button>
                                </div>
                            </div>
                        </DefaultSectionHeader>
                    </div>
                </DefaultSection>
            </div>
        </main>)

}