import { DateDisplayExportOption, DateDisplayExportOptionKey, EntryTypeExportOption, EntryTypeExportOptionKey, FormState, Status } from "@/lib/constants/constant"
import { defaultExportOption } from "@/lib/constants/default"
import { camelCaseToWords, titleize } from "@/lib/helpers"
import { AppOption } from "@/lib/services/meta/appOption"
import { useEffect, useState } from "react"

type ManageExportOptionProps = {
    updateParentExportOption: Function,
    closeExportOption?: Function
}
export default function ManageExportOption({ updateParentExportOption, closeExportOption }: any) {
    const [primitiveExportOption, setPrimitiveExportOption] = useState(defaultExportOption);
    const _initialFormState = { status: FormState.default, message: '' }
    const [exportOptionFormNotice, setExportOptionFormNotice] = useState(_initialFormState);

    useEffect(() => {
        const initializer = async () => {
            try {
                const _exportOption = await AppOption.getExportOption();
                setPrimitiveExportOption(_exportOption);
            } catch (e) { }
        }
        initializer();
    }, []);

    const handleSaveExportOption = (e: any) => {
        e.preventDefault();
        if (primitiveExportOption.allowMultipleTimeEntries !== undefined && primitiveExportOption.dateDisplay && primitiveExportOption.entryTypeDisplay) {
            AppOption.saveExportOption(primitiveExportOption);
            updateParentExportOption(primitiveExportOption);
            setExportOptionFormNotice({ status: FormState.success, message: 'Export Option Saved Successfully' })
            resetFormNotice(2000)
        }
    }

    const resetFormNotice = (resetTime: number = 1000) => {
        setTimeout(() => {
            setExportOptionFormNotice(_initialFormState)
        }, resetTime);
    }

    return (
        <div className="py-2">
            <div>
                <div className="mb-2">
                    <h3 className="text-xl font-bold">Manage Export Options</h3>
                </div>
                <div className="flex gap-x-2 items-center">
                    <label htmlFor="allow-multiple-time-entries-for-same-time-type">Allow Multiple Time entries</label>
                    <input type="checkbox" name="allow-multiple-time-entries-for-same-time-type" id="allow-multiple-time-entries-for-same-time-type" checked={primitiveExportOption.allowMultipleTimeEntries} onChange={(e) => setPrimitiveExportOption({ ...primitiveExportOption, allowMultipleTimeEntries: e.target.checked })} />
                </div>
                <div className="flex flex-col mb-2">
                    <label htmlFor="invalid-time-entry-display-option">How To Display Days that do not have valid time entries</label>
                    <select name="invalid-time-entry-display-option" id="invalid-time-entry-display-option" value={primitiveExportOption.dateDisplay} onChange={(e) => setPrimitiveExportOption({ ...primitiveExportOption, dateDisplay: e.target.value as DateDisplayExportOption })} >
                        {Object.keys(DateDisplayExportOption).map((_dateDisplayOptionKey) =>
                            <option key={_dateDisplayOptionKey} value={DateDisplayExportOption[_dateDisplayOptionKey as DateDisplayExportOptionKey]}>{camelCaseToWords(_dateDisplayOptionKey)}</option>
                        )}
                    </select>
                </div>
                <div className="flex flex-col mb-2">
                    <label htmlFor="can-include-other-entry-types-in-report">Include Other Entry Type Options In Report</label>
                    <select name="can-include-other-entry-types-in-report" id="can-include-other-entry-types-in-report" value={primitiveExportOption.entryTypeDisplay} onChange={(e) => setPrimitiveExportOption({ ...primitiveExportOption, entryTypeDisplay: e.target.value as EntryTypeExportOption })}>
                        {Object.keys(EntryTypeExportOption).map((_entryTypeOptionKey) =>
                            <option key={_entryTypeOptionKey} value={EntryTypeExportOption[_entryTypeOptionKey as EntryTypeExportOptionKey]}>{camelCaseToWords(_entryTypeOptionKey)}</option>
                        )}
                    </select>
                </div>
                <div className="mt-3">
                    <div className="flex gap-x-2">
                        <button type="button" className="px-3 py-1 bg-slate-500 rounded" onClick={(e) => handleSaveExportOption(e)}>Save</button>
                        <>{!!closeExportOption ?
                            <button type="button" className="px-3 py-1 bg-red-500 rounded" onClick={(e) => closeExportOption(e)}>Close</button>
                            : ''}
                        </>
                        {exportOptionFormNotice.status === FormState.success ?
                            <div className="inline-block">
                                <div className="inline-block px-2 py-1 rounded bg-green-50">
                                    <p className="text-sm text-green-900">{exportOptionFormNotice.message} ✅</p>
                                </div>
                            </div>
                            : ''}
                    </div>
                </div>
            </div>

        </div>
    )
}