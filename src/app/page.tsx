import Link from "next/link";
import DefaultSection from "./_components/DefaultSection";
import DefaultSectionHeader from "./_components/DefaultSectionHeader";


export default function Home() {
  let isTimesheetEmpty: boolean = true;
  return (
    <main className="container">
      <DefaultSection>
        <DefaultSectionHeader>
          <h1 className="text-5xl font-black">Timesheet Generator</h1>
        </DefaultSectionHeader>
        <div className="section-body general-label">
          <div className="py-8 px-8 border">
            <p>Welcome to my simple customer timesheet generator. Hope it works for you. </p>
          </div>
        </div>
        <footer className="section-footer section-action">
          <div className="button-group py-4 flex gap-x-4">
            <Link href="/generate" className="py-3 px-6 rounded bg-slate-400">Generate Timesheet</Link>
            <Link href="/default-information" className="py-3 px-6 rounded border">Update Default Info</Link>
          </div>
        </footer>
      </DefaultSection>

      <div className="spacer h-8"></div>

      <DefaultSection>
        <header className="section-header py-4">
          <h2 className="text-2xl font-semibold">Previous Timesheet</h2>
        </header>
        <div className="section-body">
          {isTimesheetEmpty ? (
            <div className="empty-previous-timesheets py-8 border">
              <p className="text-center text-sm italic font-medium text-gray-500" >
                <span>There are no timesheet previously generated,</span>
                <Link href="/generate" className="underline text-purple-700">Generate a New One</Link>
              </p>
            </div>
          ) : (
            <div className="previous-timesheets py-4">
              <ul>
                <li className="bg-stone-100 rounded cursor-pointer">
                  <div className="timesheet-row px-4 py-2 flex items-center justify-between">
                    <div className="lhs-column flex items-center">
                      <div className="time-info flex flex-col p-3 border rounded items-center">
                        <h3 className="time-info-hours leading-none inline-flex flex-col items-center">
                          <span className="text-3xl leading-none font-bold">{120}</span>
                          <span className="text-[10px] leading-none italic text-center">hours</span>
                        </h3>
                        <h4 className="time-info-minutes inline-flex">
                          <span className="text-[10px] leading-none font-medium">{20}</span>
                          <span className="text-[10px] leading-none text-center">mins</span>
                        </h4>
                      </div>
                      <div className="period-info-group mx-2">
                        <div className="period-info">
                          <p className="text-sm">
                            <span className="italic">
                              <span className="start-date">{'03/19/2021'}</span>
                              <span className="ml-1">-</span>
                              <span className="finish-date ml-1">{'05/03/2021'}</span>
                            </span>
                          </p>
                          <p>
                            <span className="total-days-of-work">
                              <span className="total-days-of-work-value text-sm font-bold">{40}</span>
                              <span className="text-[10px] ml-1">days</span>
                            </span>
                          </p>
                        </div>
                      </div>


                      <div className="fsr-and-customer-info mx-2">

                        <div className="user-info">
                          <h3 className="text-lg font-semibold">{'John Lagbaja'}</h3>
                        </div>
                        <div className="customer-info">
                          <p className="text-sm italic">
                            <span className="site-info">{'QIT'}</span>
                            <span>,</span>
                            <span className="site-country-info ml-1">{'Nigeria'}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="rhs-column">
                      <div className="timesheet-status">
                        <p className="inline-block text-[12px] font-medium rounded-2xl bg-red-500 px-2 text-white">{"In Progress"}</p>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="mt-4">
          <Link href="/preview" className="inline-block px-8 py-2 rounded border">Sample Preview</Link>
        </div>
      </DefaultSection>
    </main>
  );
}
