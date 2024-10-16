'use client'
import Link from "next/link";
import DefaultSection from "../_components/DefaultSection";
import { useState } from "react";
import { SearchParamsLabel, SettingSection } from "@/lib/constants/constant";
import ManagePersonnel from "./_components/ManagePersonnel";
import ManageProjects from "./_components/ManageProjects";
import ManageCustomersAndSites from "./_components/ManageCustomersAndSites";
import { useSearchParams } from "next/navigation";
import ManageDefaultTimesheetEntryInformation from "./_components/ManageDefaultTimesheetEntryInformation";

export default function SettingsPage() {

    const searchParams = useSearchParams();
    const _searchParamSection = searchParams.get(SearchParamsLabel.section)
    let _settingSection = SettingSection.default
    if (_searchParamSection === SettingSection.personnel || _searchParamSection === SettingSection.customer || _searchParamSection === SettingSection.project) _settingSection = _searchParamSection as SettingSection;

    const [settingSection, setSettingSection] = useState(_settingSection);

    return (
        <main>
            <DefaultSection>
                <div className="grid grid-cols-12">
                    <div className="settings-navigation-container col-span-2">
                        <div className="settings-navigation px-3 py-4">
                            <div className="mb-3">
                                <h5 className="font-bold py-2 px-1 text-center rounded bg-emerald-800 text-white">Settings Navigation</h5>
                            </div>
                            <ul className="flex flex-col gap-y-2 text-sm">
                                <li>
                                    <Link href={`/settings?${SearchParamsLabel.section}=${SettingSection.default}`} onClick={() => setSettingSection(SettingSection.default)} className={`inline-block w-full px-2 py-1 rounded ${settingSection === SettingSection.default ? 'bg-emerald-50' : ''} hover:text-blue-600`}>Default Information</Link>
                                </li>
                                <li>
                                    <Link href={`/settings?${SearchParamsLabel.section}=${SettingSection.personnel}`} onClick={() => setSettingSection(SettingSection.personnel)} className={`inline-block w-full px-2 py-1 rounded ${settingSection === SettingSection.personnel ? 'bg-emerald-50' : ''} hover:text-blue-600`}>Personnel</Link>
                                </li>
                                <li>
                                    <Link href={`/settings?${SearchParamsLabel.section}=${SettingSection.project}`} onClick={() => setSettingSection(SettingSection.project)} className={`inline-block w-full px-2 py-1 rounded ${settingSection === SettingSection.project ? 'bg-emerald-50' : ''} hover:text-blue-600`}>Project</Link>
                                </li>
                                <li>
                                    <Link href={`/settings?${SearchParamsLabel.section}=${SettingSection.customer}`} onClick={() => setSettingSection(SettingSection.customer)} className={`inline-block w-full px-2 py-1 rounded ${settingSection === SettingSection.customer ? 'bg-emerald-50' : ''} hover:text-blue-600`}>Customer and Sites</Link>
                                </li>
                                <li className="mt-4">
                                    <Link href={`/`} className={`inline-block w-full px-2 py-1 bg-gray-600 text-white ${settingSection === SettingSection.customer ? 'bg-gray-50' : ''} hover:text-gray-50`}>Go Home</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-span-10">
                        <> {/* default information */}
                            {settingSection === SettingSection.default ?
                                <ManageDefaultTimesheetEntryInformation />
                                : ''}
                        </>
                        <> {/* personnel settings */}
                            {settingSection === SettingSection.personnel ?
                                <div>
                                    <ManagePersonnel />
                                </div> : ''
                            }
                        </>
                        <> {/* project settings */}
                            {settingSection === SettingSection.project ?
                                <div>
                                    <ManageProjects />
                                </div> : ''}
                        </>
                        <> {/* customer and site settings */}
                            {settingSection === SettingSection.customer ?
                                <div>
                                    <ManageCustomersAndSites />
                                </div> : ''
                            }
                        </>
                    </div>
                </div>
            </DefaultSection>
        </main >
    );
}

