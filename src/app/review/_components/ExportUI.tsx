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
export default function ExportUI({ timesheet }: ExportUIProps) {

    const [exportOption, setExportOption] = useState(defaultExportOption);

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
            <div className="flex gap-x-2">
                <button className="py-1 px-3 text-sm rounded shadow-sm bg-blue-700 hover:bg-blue-500 transition-all duration-500 ease-in-out text-white" type="button" onClick={(e) => timesheet.exportXlsxTimesheet(ReportType.customer, TemplateType.classic, exportOption)}>Export Classic Excel Report</button>

                <button className="py-1 px-3 text-sm rounded shadow-sm bg-purple-700 hover:bg-purple-500 transition-all duration-500 ease-in-out text-white" type="button" onClick={(e) => timesheet.exportPdfTimesheet(ReportType.customer, TemplateType.classic, exportOption)}>Export Classic PDF Report</button>
            </div>
            <div>
                <ManageExportOption updateParentExportOption={(updatedExportOption: ExportOptions) => setExportOption(updatedExportOption)} />
            </div>

        </div>
    );
}