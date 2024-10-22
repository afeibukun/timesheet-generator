'use client'
import DefaultSection from "@/app/_components/DefaultSection";
import DefaultSectionHeader from "@/app/_components/DefaultSectionHeader";
import DefaultSectionTitle from "@/app/_components/DefaultSectionTitle";
import Link from "next/link";

export default function TimesheetNotFound() {

    return (
        <main>
            <div>
                <DefaultSection>
                    <div className="">
                        <DefaultSectionHeader>
                            <div className="pt-24">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="preview-header-group main-title group-1 mb-4">
                                        <DefaultSectionTitle>Resource Not Found</DefaultSectionTitle>
                                    </div>
                                    <div>
                                        <Link href="/" className="inline-block px-8 py-2 rounded border">Go Home</Link>
                                    </div>
                                </div>
                                <div>
                                    <div className="py-10 px-3 border rounded bg-slate-100">
                                        <p>The Timesheet / Timesheet Collection could not be found in the system</p>
                                    </div>
                                </div>
                            </div>
                        </DefaultSectionHeader>
                    </div>
                    <div className="section-body">
                    </div>
                    <footer className="py-8">
                        <div className="">
                            <div className="flex gap-x-4">
                            </div>
                        </div>
                    </footer>
                </DefaultSection>
            </div>
        </main>
    );
}