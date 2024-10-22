import ManageExportOption from "@/app/_components/ManageExportOption";
import { ReportType, TemplateType } from "@/lib/constants/constant";
import { defaultExportOption } from "@/lib/constants/default";
import { AppOption } from "@/lib/services/meta/appOption";
import { Timesheet } from "@/lib/services/timesheet/timesheet";
import { ExportOptions } from "@/lib/types/timesheet";
import { useEffect, useState } from "react";

type ExportUIProps = {
    timesheet: Timesheet
}
export default function TimesheetExportUI({ timesheet }: ExportUIProps) {

    const [exportOption, setExportOption] = useState(defaultExportOption);
    const [displayManageExportView, setDisplayManageExportView] = useState(false);

    useEffect(() => {
        const initializer = async () => {
            try {
                const _exportOption = await AppOption.getExportOption();
                setExportOption(_exportOption);
            } catch (e) { }
        }
        initializer();
    }, []);

    return (
        <div className="export-ui">
            <div className="flex justify-between">
                <div className="flex gap-x-2">
                    <button className="py-1 px-3 text-sm rounded shadow-sm bg-blue-700 hover:bg-blue-500 transition-all duration-500 ease-in-out text-white" type="button" onClick={(e) => timesheet.exportXlsxTimesheet(ReportType.customer, TemplateType.classic, exportOption)}>Export Classic Excel Report</button>

                    <button className="py-1 px-3 text-sm rounded shadow-sm bg-purple-700 hover:bg-purple-500 transition-all duration-500 ease-in-out text-white" type="button" onClick={(e) => timesheet.exportPdfTimesheet(ReportType.customer, TemplateType.classic, exportOption)}>Export Classic PDF Report</button>
                </div>
                <div>
                    <button type="button" className="px-3 py-1 rounded text-sm bg-slate-800 text-white" onClick={() => setDisplayManageExportView(!displayManageExportView)}>{displayManageExportView ? 'Close' : 'Update Export Options'}</button>
                </div>
            </div>
            <div>
                <>{displayManageExportView ?
                    <div className="mt-3 mb-3 px-3 py-3 bg-slate-100 rounded-sm">
                        <ManageExportOption updateParentExportOption={(updatedExportOption: ExportOptions) => setExportOption(updatedExportOption)} closeExportOption={() => setDisplayManageExportView(false)} />
                    </div>
                    : ''}
                </>
            </div>

        </div>
    );
}