'use client'
import Link from "next/link";
import DefaultSection from "./_components/DefaultSection";
import DefaultSectionHeader from "./_components/DefaultSectionHeader";
import { defaultLogoBase64 } from "@/lib/constants/defaultLogoBase64Image";
import { useEffect, useState } from "react";
import { Personnel } from "@/lib/services/meta/personnel";
import { Timesheet } from "@/lib/services/timesheet/timesheet";
import { ComponentType, OptionLabel, SearchParamsLabel } from "@/lib/constants/constant";
import ActivePersonnel from "./_components/ActivePersonnel";
import { StorageLabel } from "@/lib/constants/storage";
import { time } from "console";


export default function Home() {
  const [localActivePersonnel, setLocalActivePersonnel] = useState({} as Personnel);
  const [timesheetsFromActivePersonnel, setTimesheetsFromActivePersonnel] = useState([] as Timesheet[]);

  useEffect(() => {
    const initializer = async () => {
      let _activePersonnel: Personnel | undefined = undefined;
      try {
        try {
          _activePersonnel = await Personnel.getActivePersonnel();
          setLocalActivePersonnel(_activePersonnel);
        } catch (e) { }

        if (_activePersonnel) {
          const _timesheetsFromActivePersonnel = await Timesheet.getTimesheetsFromPersonnel(_activePersonnel);
          setTimesheetsFromActivePersonnel(_timesheetsFromActivePersonnel);
        }
      } catch (e) {
        console.log(e)
      }
    }
    initializer();
  }, []);

  useEffect(() => {
    const sideEffect = async () => {
      try {
        if (localActivePersonnel) {
          const _timesheetsFromActivePersonnel = await Timesheet.getTimesheetsFromPersonnel(localActivePersonnel);
          setTimesheetsFromActivePersonnel(_timesheetsFromActivePersonnel);
        }
      } catch (e) { }
    }
    sideEffect();
  }, [localActivePersonnel]);

  const isTimesheetPartOfCollection = (timesheet: Timesheet) => {
    return timesheet.options.some((_option) => _option.key === OptionLabel.timesheetCollectionKey && _option.value)
  }

  const getTimesheetCollectionKey = (timesheet: Timesheet) => {
    if (isTimesheetPartOfCollection(timesheet)) {
      return timesheet.options.filter((_option) => _option.key === OptionLabel.timesheetCollectionKey && _option.value)[0].value
    }
  }

  return (
    <main className="container mx-auto">
      <DefaultSection>
        <DefaultSectionHeader>
          <div className="mb-12">
            <img src={defaultLogoBase64} alt="timesheet generator app" className="h-14" />
            <h1 className="hidden text-5xl font-black">Timesheet Generator App</h1>
          </div>
        </DefaultSectionHeader>
        <div className="section-body general-label mb-12">
          <div className="py-8 px-8 border">
            <p>Welcome to my simple personnel timesheet generator. I hope it works for you. </p>
          </div>
        </div>
        <div className="mb-4">
          <div className="active-personnel-group">
            <div>
              <div>
                <ActivePersonnel activePersonnel={localActivePersonnel} />
              </div>
              <div>
                <Link href={`/settings?section=personnel`} className="underline decoration-dotted text-blue-700 hover:text-blue-500">Manage Personnel</Link>
              </div>
            </div>

          </div>
        </div>
        <footer className="section-footer section-action">
          <div className="button-group py-4 flex gap-x-4">
            <Link href={`/create?${SearchParamsLabel.component}=${ComponentType.timesheet}`} className="py-3 px-6 rounded bg-slate-400">Create Timesheet</Link>
            <Link href={`/create?${SearchParamsLabel.component}=${ComponentType.timesheetCollection}`} className="py-3 px-6 rounded bg-slate-400">Create Collection</Link>
            <Link href="/overview" className="py-3 px-6 rounded border">Timesheet Overview</Link>
            <Link href="/settings" className="py-3 px-6 rounded border">Update Default Information</Link>
          </div>
        </footer>
      </DefaultSection>

      <div className="spacer h-8"></div>

      <DefaultSection>
        <header className="section-header py-4">
          <h2 className="text-2xl font-semibold">Timesheets</h2>
        </header>
        <div className="section-body">
          {timesheetsFromActivePersonnel.length > 0 ? (
            <div className="previous-timesheets py-4">
              <ul className="flex flex-col gap-y-2">
                {timesheetsFromActivePersonnel.map((_timesheet) =>
                  <li key={_timesheet.id} className="bg-stone-100 rounded cursor-pointer">
                    <Link href={`/review?${SearchParamsLabel.component}=${ComponentType.timesheet}&${SearchParamsLabel.key}=${_timesheet.key}`} className="timesheet-row px-4 py-2 flex items-center justify-between">
                      <div className="lhs-column flex items-center">
                        <div className="time-info flex flex-col p-3 border rounded items-center">
                          <h3 className="time-info-hours leading-none inline-flex flex-col items-center">
                            <span className="text-3xl leading-none font-bold">{_timesheet.totalHours.hour}</span>
                            <span className="text-[10px] leading-none italic text-center">hours</span>
                          </h3>
                          {_timesheet.totalHours.minute > 0 ?
                            <h4 className="time-info-minutes inline-flex">
                              <span className="text-[10px] leading-none font-medium">{_timesheet.totalHours.minute}</span>
                              <span className="text-[10px] leading-none text-center">mins</span>
                            </h4>
                            : ''}
                        </div>
                        <div>
                          <div className="period-info-group mx-2">
                            <div className="period-info flex gap-x-2 items-center">
                              <p className="text-sm">
                                <span className="italic">
                                  <span className="mr-1 px-1.5 py-1 rounded bg-slate-300">From</span>
                                  <span className="start-date">{_timesheet.records[0].date.basicFormat()}</span>
                                  <span className="mx-1 px-1.5 py-1 rounded bg-slate-300">to</span>
                                  <span className="finish-date">{_timesheet.records[_timesheet.records.length - 1].date.basicFormat()}</span>
                                </span>
                              </p>
                              <p>
                                <span className="total-days-of-work">
                                  <span>| </span>
                                  <span className="total-days-of-work-value text-sm font-bold">{_timesheet.totalDays}</span>
                                  <span className="text-[10px] ml-1">days</span>
                                </span>
                              </p>
                            </div>
                          </div>


                          <div className="personnel-and-customer-info mx-2">
                            <div className="flex gap-x-2 items-center">
                              <div className="user-info">
                                <h3 className="text-lg font-semibold">{_timesheet.personnel.name}</h3>
                              </div>
                              <div className="customer-info">
                                <p className="text-sm italic">
                                  <span className="site-info">{_timesheet.site.name}</span>
                                  <span>,</span>
                                  <span className="site-country-info ml-1">{_timesheet.site.country}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="rhs-column">
                        <div className="timesheet-status">
                          <div className="hidden">
                            <p className="inline-block  text-[12px] font-medium rounded-2xl bg-red-500 px-2 text-white">{"In Progress"}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <>{isTimesheetPartOfCollection(_timesheet) ?
                      <Link href={`/review?${SearchParamsLabel.component}=${ComponentType.timesheetCollection}&${SearchParamsLabel.key}=${getTimesheetCollectionKey(_timesheet)}`} className="px-3 py-0.5 text-xs italic bg-green-300">View Collection {getTimesheetCollectionKey(_timesheet)}</Link> : ''}
                    </>
                  </li>
                )}
              </ul>
            </div>
          ) : (
            <div className="empty-previous-timesheets py-8 border">
              <p className="text-center text-sm italic font-medium text-gray-500" >
                <span>There are no timesheet previously generated,</span>
                <Link href="/generate" className="underline text-purple-700">Generate a New One</Link>
              </p>
            </div>
          )}
        </div>
        <div className="mt-4">
        </div>
      </DefaultSection>
    </main>
  );
}
