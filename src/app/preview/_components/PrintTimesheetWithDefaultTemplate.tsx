import { LocationType } from "@/lib/constants";
import { TimesheetEntry } from "@/lib/services/timesheet/timesheetEntry";
import { TimesheetMeta } from "@/lib/services/timesheet/timesheetMeta";
import templateConfig from '../../../../main-timesheet-template';

/* NOTE: It uses the print to PDF function of the browsers - note the best option, but I'll manage */
interface PrintTimesheetProps {
    currentWeek: string,
    groupedTimesheet: any,
    timesheetMeta: TimesheetMeta
}

export default function PrintTimesheetWithDefaultTemplate({ currentWeek, groupedTimesheet, timesheetMeta }: PrintTimesheetProps) {

    const mainPaddingClass = "py-3"
    const cellPaddingForTimesheetTable = "py-px px-0.5"

    const imageWidthClass = "w-28"
    const heightOfSignatureSectionClass = "min-h-8"

    const smallTextFontClass = "text-8px"
    const mediumTextFontClass = "text-10px"
    const baseTextFontClass = "text-base"
    const xsTextFontClass = "text-xs"

    const blueTextDark = "text-blue-900"
    const blueTextMedium = "text-blue-800"
    const grayBackground = "bg-gray-200"
    const darkerGrayBackground = "bg-gray-400"

    const marginUnderTimesheetRowClass = "mb-2"
    const marginUnderImageRowClass = "mb-2"
    const marginUnderAddressClass = "mb-4"

    const gridColsForTimesheetTable = "grid-cols-120"

    const verticallyCenteredContentClass = "flex items-center"
    const horizontallyCenteredContentClass = "flex justify-center"
    const rightAlignedContentClass = "flex justify-end"

    const thickTopBorder = "border-t-2"

    const footerSpacerHeightClass = `h-${templateConfig.footerOffsetForPrintToPdf}`

    const lastDayOfCurrentWeek = groupedTimesheet[currentWeek][groupedTimesheet[currentWeek].length - 1] as TimesheetEntry;

    return (
        <div className="hidden print:block">
            <div className={`${mainPaddingClass} bg-white`}>

                {/* header offset */}
                <div className={`header-offset-row w-full`} style={{ height: `${templateConfig.headerOffsetForPrintToPdf}rem` }}></div>

                {/* Logo and Week Number row */}
                <div className={`top-meta-row flex justify-between ${marginUnderImageRowClass}`}>
                    <div className="meta-image">
                        {/* cols - A, B */}
                        <img src={templateConfig.companyLogoPath} alt={templateConfig.companyLogoAlt} className={`${imageWidthClass}`} />
                    </div>
                    <div className="week-data">
                        {/* cols - Q, R */}
                        <span className={`${smallTextFontClass} uppercase font-bold ${blueTextDark}`}>{`${templateConfig.label.weekLabel} ${currentWeek}`}</span>
                    </div>
                </div>
                <div className={`border-b border-black ${marginUnderTimesheetRowClass} `}>
                    {/* Timesheet Meta Information Rows */}
                    <div className="meta-row-container">
                        <div className={`meta-row row-01 grid ${gridColsForTimesheetTable} uppercase`}>
                            <div className={`meta-field-label col-span-26 ${cellPaddingForTimesheetTable} border-t border-l border-black ${verticallyCenteredContentClass} `}>
                                {/* cols - A, B, C, D */}
                                <p className={` ${mediumTextFontClass} font-bold not-italic ${blueTextMedium}`}>{templateConfig.label.titleLabel}</p>
                            </div>
                            <div className={`meta-field-label col-span-25 ${cellPaddingForTimesheetTable} border-t border-l border-black ${grayBackground} ${verticallyCenteredContentClass}`}>
                                {/* cols - E, F, G, H, I */}
                                <p className={`${smallTextFontClass} italic`}>{templateConfig.label.personnelNameLabel}</p>
                            </div>
                            <div className={`meta-field-label col-span-23 ${cellPaddingForTimesheetTable} border-t border-l border-black ${grayBackground} ${verticallyCenteredContentClass}`}>
                                {/* cols - J, K, L */}
                                <p className={`${smallTextFontClass} italic`}>{templateConfig.label.mobilizationDateLabel}</p>
                            </div>
                            <div className={`meta-field-label col-span-22 ${cellPaddingForTimesheetTable} border-t border-l border-black ${grayBackground} ${verticallyCenteredContentClass}`}>
                                {/* cols - M, N, O */}
                                <p className={`${smallTextFontClass} italic`}>{templateConfig.label.demobilizationDateLabel}</p>
                            </div>
                            <div className={`meta-field-label col-span-24  ${cellPaddingForTimesheetTable} border-t border-x border-black ${grayBackground} ${verticallyCenteredContentClass}`}>
                                {/* cols - P, Q, R */}
                                <p className={`${smallTextFontClass} italic`}>{templateConfig.label.orderNumberLabel}</p>
                            </div>
                        </div>
                        <div className={`meta-row row-02 grid ${gridColsForTimesheetTable}`}>
                            <div className={`meta-field-value col-span-26  ${cellPaddingForTimesheetTable} border-t border-l border-black ${verticallyCenteredContentClass}`}>
                                {/* cols - A, B, C, D */}
                                <p className={` ${baseTextFontClass} uppercase font-bold ${blueTextDark}`}>{templateConfig.staticValues.defaultTitle}</p>
                            </div>
                            <div className={`meta-field-value col-span-25 ${cellPaddingForTimesheetTable} border-t border-l border-black ${verticallyCenteredContentClass}`}>
                                {/* cols - E, F, G, H, I */}
                                <p className={`${mediumTextFontClass} uppercase font-bold`}>{timesheetMeta.personnelName.toUpperCase()}</p>
                            </div>
                            <div className={`meta-field-value col-span-23 border-t border-l  ${cellPaddingForTimesheetTable}  border-black ${verticallyCenteredContentClass}`}>
                                {/* cols - J, K, L */}
                                <p className={`${mediumTextFontClass} font-bold`}>{timesheetMeta.mobilizationDate.simpleFormat()}</p>
                            </div>
                            <div className={`meta-field-value col-span-22 border-t border-l  border-black ${cellPaddingForTimesheetTable} ${verticallyCenteredContentClass}`}>
                                {/* cols - M, N, O */}
                                <p className={`${mediumTextFontClass} font-bold`}>{timesheetMeta.demobilizationDate.simpleFormat()}</p>
                            </div>
                            <div className={`meta-field-value col-span-24 border-t border-x  border-black ${cellPaddingForTimesheetTable} ${verticallyCenteredContentClass}`}>
                                {/* cols - P, Q, R */}
                                <p className={`${mediumTextFontClass} font-bold`}>{''}</p>
                            </div>
                        </div>
                    </div>

                    <div className="meta-row-container">
                        <div className={`meta-row grid ${gridColsForTimesheetTable}`}>
                            <div className={`meta-field-label col-span-36 border-t border-l  border-black ${cellPaddingForTimesheetTable} ${grayBackground} ${verticallyCenteredContentClass}`}>
                                {/* cols - A, B, C, D, E, F */}
                                <p className={`${smallTextFontClass} uppercase italic`}>{templateConfig.label.customerNameLabel}</p>
                            </div>
                            <div className={`meta-field-label col-span-15 border-t border-l  border-black ${cellPaddingForTimesheetTable} ${grayBackground} ${verticallyCenteredContentClass}`}>
                                {/* cols - G, H, I */}
                                <p className={`${smallTextFontClass} uppercase italic`}>{templateConfig.label.siteNameLabel}</p>
                            </div>
                            <div className={`meta-field-label col-span-23 border-t border-l  border-black ${cellPaddingForTimesheetTable} ${grayBackground} ${verticallyCenteredContentClass}`}>
                                {/* cols - J, K, L */}
                                <p className={`${smallTextFontClass} uppercase italic `}>{templateConfig.label.purchaseOrderNumberLabel}</p>
                            </div>
                            <div className={`meta-field-label col-span-14 border-t border-l  border-black ${cellPaddingForTimesheetTable} ${grayBackground} ${verticallyCenteredContentClass}`}>
                                {/* cols - M, N */}
                                <p className={`${smallTextFontClass} uppercase italic `}>{templateConfig.label.countryNameLabel}</p>
                            </div>
                            <div className={`meta-field-label col-span-32 border-t border-x  border-black ${cellPaddingForTimesheetTable} ${grayBackground} ${verticallyCenteredContentClass}`}>
                                {/* cols - O, P, Q, R */}
                                <p className={`${smallTextFontClass} uppercase italic `}>{templateConfig.label.weekEndingDateLabel}</p>
                            </div>
                        </div>
                        <div className={`meta-row grid ${gridColsForTimesheetTable}`}>
                            <div className={`meta-field-value col-span-36 border-t border-l ${cellPaddingForTimesheetTable} ${verticallyCenteredContentClass} border-black`}>
                                {/* cols - A, B, C, D, E, F */}
                                <p className={`${mediumTextFontClass} uppercase font-bold`}>{timesheetMeta.customerName}</p>
                            </div>
                            <div className={`meta-field-value col-span-15 border-t border-l border-black ${cellPaddingForTimesheetTable} ${verticallyCenteredContentClass}`}>
                                {/* cols - G, H, I */}
                                <p className={`${mediumTextFontClass} uppercase font-bold`}>{timesheetMeta.siteName}</p>
                            </div>
                            <div className={`meta-field-value col-span-23 border-t border-l border-black ${cellPaddingForTimesheetTable} ${verticallyCenteredContentClass}`}>
                                {/* cols - J, K, L */}
                                <p className={`${mediumTextFontClass} font-bold`}>{timesheetMeta.purchaseOrderNumber}</p>
                            </div>
                            <div className={`meta-field-value col-span-14 border-t border-l border-black ${cellPaddingForTimesheetTable} ${verticallyCenteredContentClass}`}>
                                {/* cols - M, N */}
                                <p className={`${mediumTextFontClass} uppercase font-bold`}>{timesheetMeta.siteCountry}</p>
                            </div>
                            <div className={`meta-field-value col-span-32 border-t border-x  border-black ${cellPaddingForTimesheetTable} ${verticallyCenteredContentClass}`}>
                                {/* cols - O, P, Q, R */}
                                <p className={`${mediumTextFontClass} font-bold`}>{lastDayOfCurrentWeek.date.simpleFormat()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Header for the main timesheet days */}
                    <div className="timesheet-heading-row-container">
                        <div className={`timesheet-heading--row grid ${gridColsForTimesheetTable} border-b ${thickTopBorder} border-black`}>
                            {/* Row 1 */}
                            <div className={`core-timesheet-meta-cell col-span-8 border-l border-black ${cellPaddingForTimesheetTable} ${grayBackground} ${verticallyCenteredContentClass}`}>
                                {/* cols - A */}
                                <p className={`${smallTextFontClass} uppercase italic`}>{templateConfig.label.dateTitleLabel}</p>
                            </div>
                            <div className={`core-timesheet-meta-cell col-span-28 border-l  border-black ${cellPaddingForTimesheetTable} ${grayBackground} ${verticallyCenteredContentClass}`}>
                                {/* cols - B, C, D, E, F */}
                                <p className={`${smallTextFontClass} uppercase italic`}>{templateConfig.label.workingTimeTitleLabel}</p>
                            </div>
                            <div className={`core-timesheet-meta-cell col-span-10 border-l  border-black ${cellPaddingForTimesheetTable} ${grayBackground} ${verticallyCenteredContentClass}`}>
                                {/* cols - G, H */}
                                <p className={`${smallTextFontClass} uppercase italic`}>{templateConfig.label.waitingTimeTitleLabel}</p>
                            </div>
                            <div className={`core-timesheet-meta-cell col-span-10 border-l  border-black ${cellPaddingForTimesheetTable} ${grayBackground} ${verticallyCenteredContentClass}`}>
                                {/* cols - I, J */}
                                <p className={`${smallTextFontClass} uppercase italic`}>{templateConfig.label.travelTimeTitleLabel}</p>
                            </div>
                            <div className={`core-timesheet-meta-cell col-span-8 row-span-2  border-l ${cellPaddingForTimesheetTable} ${grayBackground} ${verticallyCenteredContentClass} border-black`}>
                                {/* cols - K */}
                                <p className={`${smallTextFontClass} uppercase italic`}>{templateConfig.label.totalHoursTitleLabel}</p>
                            </div>
                            <div className={`core-timesheet-meta-cell col-span-10 row-span-2  border-l border-black ${cellPaddingForTimesheetTable} ${verticallyCenteredContentClass}`}>
                                {/* cols - L */}
                                <p className={`${smallTextFontClass} italic`} >{templateConfig.label.locationTypeIndicatorLabel}</p>
                            </div>
                            <div className={`core-timesheet-meta-cell col-span-4 row-span-2 border-l border-black ${cellPaddingForTimesheetTable} ${verticallyCenteredContentClass} ${horizontallyCenteredContentClass}`}>
                                {/* cols - M */}
                                <p className={`${xsTextFontClass} text-center`}>{templateConfig.staticValues.locationTypeIndicator}</p>
                            </div>
                            <div className={`core-timesheet-meta-cell col-span-42 row-span-2  border-x border-black ${cellPaddingForTimesheetTable} ${grayBackground} ${verticallyCenteredContentClass}`}>
                                {/* cols - N, O, P, Q, R */}
                                <p className={`${smallTextFontClass} uppercase italic`}>{templateConfig.label.commentTitleLabel}</p>
                            </div>
                            {/* Second Row Start */}
                            <div className={`core-timesheet-meta-cell col-span-8 border-t border-l border-black ${cellPaddingForTimesheetTable} ${verticallyCenteredContentClass}`}>
                                {/* cols - A */}
                                <p></p>
                            </div>
                            <div className={`core-timesheet-meta-cell col-span-8 border-t border-l border-black ${cellPaddingForTimesheetTable} ${verticallyCenteredContentClass}`}>
                                {/* cols - B */}
                                <p className={`${smallTextFontClass} uppercase text-center`}>{templateConfig.label.periodTitleLabel}</p>
                            </div>
                            <div className={`core-timesheet-meta-cell col-span-5 border-t border-l  border-black ${cellPaddingForTimesheetTable} ${verticallyCenteredContentClass}`}>
                                {/* cols - C */}
                                <p className={`${smallTextFontClass} uppercase text-center`}>{templateConfig.staticValues.workingTimeFirstPeriodTitle}</p>
                            </div>
                            <div className={`core-timesheet-meta-cell col-span-5 border-t border-l border-black ${cellPaddingForTimesheetTable} ${verticallyCenteredContentClass}`}>
                                {/* cols - D */}
                                <p className={`${smallTextFontClass} uppercase text-center`}>{templateConfig.staticValues.workingTimeSecondPeriodTitle}</p>
                            </div>
                            <div className={`core-timesheet-meta-cell col-span-5 border-t border-l border-black ${cellPaddingForTimesheetTable} ${verticallyCenteredContentClass}`}>
                                {/* cols - E */}
                                <p className={`${smallTextFontClass} uppercase text-center`}>{templateConfig.staticValues.workingTimeThirdPeriodTitle}</p>
                            </div>
                            <div className={`core-timesheet-meta-cell col-span-5 border-t border-l ${cellPaddingForTimesheetTable} ${verticallyCenteredContentClass} border-black`}>
                                {/* cols - F */}
                                <p className={`${smallTextFontClass} uppercase text-center`}>{templateConfig.staticValues.workingTimeFourthPeriodTitle}</p>
                            </div>
                            <div className={`core-timesheet-meta-cell col-span-5 border-t border-l  border-black ${cellPaddingForTimesheetTable} ${verticallyCenteredContentClass}`}>
                                {/* cols - G */}
                                <p className={`${smallTextFontClass} uppercase text-center`}>{templateConfig.staticValues.waitingTimeFirstPeriodTitle}</p>
                            </div>
                            <div className={`core-timesheet-meta-cell col-span-5 border-t border-l  border-black ${cellPaddingForTimesheetTable} ${verticallyCenteredContentClass}`}>
                                {/* cols - H */}
                                <p className={`${smallTextFontClass} uppercase text-center`}>{templateConfig.staticValues.waitingTimeSecondPeriodTitle}</p>
                            </div>
                            <div className={`core-timesheet-meta-cell col-span-5 border-t border-l border-black ${cellPaddingForTimesheetTable} ${verticallyCenteredContentClass}`}>
                                {/* cols - I */}
                                <p className={`${smallTextFontClass} uppercase text-center`}>{templateConfig.staticValues.travelTimeFirstPeriodTitle}</p>
                            </div>
                            <div className={`core-timesheet-meta-cell col-span-5 border-t border-l  border-black ${cellPaddingForTimesheetTable} ${verticallyCenteredContentClass}`}>
                                {/* cols - J */}
                                <p className={`${smallTextFontClass} uppercase text-center`}>{templateConfig.staticValues.travelTimeSecondPeriodTitle}</p>
                            </div>
                            {/* cols - K (null)*/}
                            {/* cols - L (null) */}
                            {/* cols - M (null) */}
                            {/* cols - N,O, P, Q, R - (null) */}
                        </div>
                    </div>

                    {/* Main timesheet data */}
                    <div className="main-timesheet-row-container">
                        <div className="main-timesheet-row-group">
                            {groupedTimesheet[currentWeek].map((timesheetEntry: TimesheetEntry) =>
                                <div key={timesheetEntry.id}>
                                    <div className={`main-timesheet-row grid ${gridColsForTimesheetTable}`}>
                                        <div className={`col-span-8 border-b border-l border-black  ${cellPaddingForTimesheetTable} ${grayBackground} ${verticallyCenteredContentClass}`}>
                                            {/* cols - A */}
                                            <p className={`${smallTextFontClass} uppercase italic font-bold`}>{timesheetEntry.entryDateDayLabel}</p>
                                        </div>
                                        <div className={`col-span-8 ${cellPaddingForTimesheetTable}  border-l border-black ${!timesheetEntry.isNullEntry ? 'border-b' : darkerGrayBackground} ${verticallyCenteredContentClass} ${horizontallyCenteredContentClass}`}>
                                            {/* cols - B */}
                                            {!timesheetEntry.isNullEntry ? <p className={`${smallTextFontClass} uppercase text-center`}>{'Start'}</p> : ''}
                                        </div>
                                        <div className={`col-span-5 ${cellPaddingForTimesheetTable} border-black ${!timesheetEntry.isNullEntry ? 'border-b border-l' : darkerGrayBackground} ${verticallyCenteredContentClass} ${horizontallyCenteredContentClass}`}>
                                            {/* cols - C */}
                                            {!timesheetEntry.isNullEntry ? <p className={`${smallTextFontClass} uppercase text-center`}>{timesheetEntry.entryPeriodStartTime}</p> : ''}
                                        </div>
                                        <div className={`col-span-5 ${cellPaddingForTimesheetTable} border-black ${!timesheetEntry.isNullEntry ? 'border-b border-l' : darkerGrayBackground} ${verticallyCenteredContentClass} ${horizontallyCenteredContentClass} `}>
                                            {/* cols - D */}
                                            {!timesheetEntry.isNullEntry ? <p className={`${smallTextFontClass} uppercase`}></p> : ''}
                                        </div>
                                        <div className={`col-span-5 ${cellPaddingForTimesheetTable} border-black ${!timesheetEntry.isNullEntry ? 'border-b border-l' : darkerGrayBackground} ${verticallyCenteredContentClass} ${horizontallyCenteredContentClass}`}>
                                            {/* cols - E */}
                                            {!timesheetEntry.isNullEntry ? <p className={`${smallTextFontClass} uppercase`}></p> : ''}
                                        </div>
                                        <div className={`col-span-5 ${cellPaddingForTimesheetTable} border-black ${!timesheetEntry.isNullEntry ? 'border-b border-l' : darkerGrayBackground} ${verticallyCenteredContentClass} ${horizontallyCenteredContentClass}`}>
                                            {/* cols - F */}
                                            {!timesheetEntry.isNullEntry ? <p className={`${smallTextFontClass} uppercase`}></p> : ''}
                                        </div>
                                        <div className={`col-span-5 ${cellPaddingForTimesheetTable} border-black ${!timesheetEntry.isNullEntry ? 'border-b border-l' : darkerGrayBackground} ${verticallyCenteredContentClass} ${horizontallyCenteredContentClass}`}>
                                            {/* cols - G */}
                                            {!timesheetEntry.isNullEntry ? <p className={`${smallTextFontClass} uppercase`}></p> : ''}
                                        </div>
                                        <div className={`col-span-5 ${cellPaddingForTimesheetTable} border-black ${!timesheetEntry.isNullEntry ? 'border-b border-l' : darkerGrayBackground} ${verticallyCenteredContentClass} ${horizontallyCenteredContentClass}`}>
                                            {/* cols - H */}
                                            {!timesheetEntry.isNullEntry ? <p className={`${smallTextFontClass} uppercase`}></p> : ''}
                                        </div>
                                        <div className={`col-span-5 ${cellPaddingForTimesheetTable} border-black ${!timesheetEntry.isNullEntry ? 'border-b border-l' : darkerGrayBackground} ${verticallyCenteredContentClass} ${horizontallyCenteredContentClass}`}>
                                            {/* cols - I */}
                                            {!timesheetEntry.isNullEntry ? <p className={`${smallTextFontClass} uppercase`}></p> : ''}
                                        </div>
                                        <div className={`col-span-5 ${cellPaddingForTimesheetTable} border-black ${!timesheetEntry.isNullEntry ? 'border-b border-l' : darkerGrayBackground} ${verticallyCenteredContentClass} ${horizontallyCenteredContentClass}`}>
                                            {/* cols - J */}
                                            {!timesheetEntry.isNullEntry ? <p className={`${smallTextFontClass} uppercase`}></p> : ''}
                                        </div>
                                        <div className={`col-span-8 ${cellPaddingForTimesheetTable} border-black ${!timesheetEntry.isNullEntry ? 'border-b border-l' : darkerGrayBackground} ${verticallyCenteredContentClass} ${horizontallyCenteredContentClass}`}>
                                            {/* cols - K */}
                                            {!timesheetEntry.isNullEntry ? <p className={`${smallTextFontClass} uppercase text-center`}>{timesheetEntry.totalEntryPeriodHours}</p> : ''}
                                        </div>
                                        <div className={`col-span-10 ${cellPaddingForTimesheetTable} border-black ${!timesheetEntry.isNullEntry ? 'border-b border-l' : darkerGrayBackground} ${verticallyCenteredContentClass} ${horizontallyCenteredContentClass}`}>
                                            {/* cols - L */}
                                            {!timesheetEntry.isNullEntry ? <p className={`${smallTextFontClass} uppercase text-center`}>{'Onshore'}</p> : ''}
                                        </div>
                                        <div className={`col-span-4 ${cellPaddingForTimesheetTable} border-black ${!timesheetEntry.isNullEntry ? 'border-b border-l' : darkerGrayBackground} ${verticallyCenteredContentClass} ${horizontallyCenteredContentClass}`}>
                                            {/* cols - M */}
                                            {!timesheetEntry.isNullEntry ? <p className={`${xsTextFontClass} text-center`}>{timesheetEntry.locationType == LocationType.onshore ? '✔' : ''}</p> : ''}
                                        </div>
                                        <div className={`col-span-42 ${cellPaddingForTimesheetTable} border-r border-black ${!timesheetEntry.isNullEntry ? 'border-b border-l' : darkerGrayBackground} ${verticallyCenteredContentClass}`}>
                                            {/* cols - N, O, P, Q, R */}
                                            {!timesheetEntry.isNullEntry ? <p className={`${smallTextFontClass}`}>{timesheetEntry.locationType == LocationType.onshore ? timesheetEntry.comment : ''}</p> : ''}
                                        </div>
                                    </div>
                                    <div className={`timesheet-row grid ${gridColsForTimesheetTable}`}>
                                        <div className={`col-span-8 border-b border-l ${cellPaddingForTimesheetTable} border-black ${verticallyCenteredContentClass} ${rightAlignedContentClass}`}>
                                            {/* cols - A */}
                                            <p className={`${smallTextFontClass} text-right`}>{timesheetEntry.entryDateInDayMonthFormat}</p>
                                        </div>
                                        <div className={`col-span-8 border-l border-black ${cellPaddingForTimesheetTable} ${!timesheetEntry.isNullEntry ? 'border-b' : darkerGrayBackground} ${verticallyCenteredContentClass} ${horizontallyCenteredContentClass}`}>
                                            {/* cols - B */}
                                            {!timesheetEntry.isNullEntry ? <p className={`${smallTextFontClass} uppercase text-center`}>{'Finish'}</p> : ''}
                                        </div>
                                        <div className={`col-span-5 border-black ${cellPaddingForTimesheetTable} ${!timesheetEntry.isNullEntry ? 'border-b border-l' : darkerGrayBackground} ${verticallyCenteredContentClass} ${horizontallyCenteredContentClass}`}>
                                            {/* cols - C */}
                                            {!timesheetEntry.isNullEntry ? <p className={`${smallTextFontClass} text-center`}>{timesheetEntry.entryPeriodFinishTime}</p> : ''}
                                        </div>
                                        <div className={`col-span-5 border-black ${cellPaddingForTimesheetTable} ${!timesheetEntry.isNullEntry ? 'border-b border-l' : darkerGrayBackground} ${verticallyCenteredContentClass} ${horizontallyCenteredContentClass}`}>
                                            {/* cols - D */}
                                            {!timesheetEntry.isNullEntry ? <p className={`${smallTextFontClass} uppercase`}></p> : ''}
                                        </div>
                                        <div className={`col-span-5 border-black ${cellPaddingForTimesheetTable} ${!timesheetEntry.isNullEntry ? 'border-b border-l' : darkerGrayBackground} ${verticallyCenteredContentClass} ${horizontallyCenteredContentClass}`}>
                                            {/* cols - E */}
                                            {!timesheetEntry.isNullEntry ? <p className={`${smallTextFontClass} uppercase text-center`}></p> : ''}
                                        </div>
                                        <div className={`col-span-5 border-black ${cellPaddingForTimesheetTable} ${!timesheetEntry.isNullEntry ? 'border-b border-l' : darkerGrayBackground} ${verticallyCenteredContentClass} ${horizontallyCenteredContentClass}`}>
                                            {/* cols - F */}
                                            {!timesheetEntry.isNullEntry ? <p className={`${smallTextFontClass} uppercase text-center`}></p> : ''}
                                        </div>
                                        <div className={`col-span-5 border-black ${cellPaddingForTimesheetTable} ${!timesheetEntry.isNullEntry ? 'border-b border-l' : darkerGrayBackground} ${verticallyCenteredContentClass} ${horizontallyCenteredContentClass}`} >
                                            {/* cols - G */}
                                            {!timesheetEntry.isNullEntry ? <p className={`${smallTextFontClass} uppercase text-center`}></p> : ''}
                                        </div>
                                        <div className={`col-span-5 border-black ${cellPaddingForTimesheetTable} ${!timesheetEntry.isNullEntry ? 'border-b border-l' : darkerGrayBackground} ${verticallyCenteredContentClass} ${horizontallyCenteredContentClass}`}>
                                            {/* cols - H */}
                                            {!timesheetEntry.isNullEntry ? <p className={`${smallTextFontClass} uppercase text-center`}></p> : ''}
                                        </div>
                                        <div className={`col-span-5 border-black ${cellPaddingForTimesheetTable} ${!timesheetEntry.isNullEntry ? 'border-b border-l' : darkerGrayBackground} ${verticallyCenteredContentClass} ${horizontallyCenteredContentClass}`}>
                                            {/* cols - I */}
                                            {!timesheetEntry.isNullEntry ? <p className={` ${smallTextFontClass} uppercase text-center`}></p> : ''}
                                        </div>
                                        <div className={`col-span-5 border-black ${cellPaddingForTimesheetTable} ${!timesheetEntry.isNullEntry ? 'border-b border-l' : darkerGrayBackground} ${verticallyCenteredContentClass} ${horizontallyCenteredContentClass}`}>
                                            {/* cols - J */}
                                            {!timesheetEntry.isNullEntry ? <p className={` ${smallTextFontClass} uppercase text-center`}></p> : ''}
                                        </div>
                                        <div className={`col-span-8 border-black ${cellPaddingForTimesheetTable} ${!timesheetEntry.isNullEntry ? 'border-b border-l' : darkerGrayBackground} ${verticallyCenteredContentClass} ${horizontallyCenteredContentClass}`}>
                                            {/* cols - K */}
                                            {!timesheetEntry.isNullEntry ? <p className={` ${smallTextFontClass} uppercase text-center`}>{''}</p> : ''}
                                        </div>
                                        <div className={`col-span-10 border-black ${cellPaddingForTimesheetTable} ${!timesheetEntry.isNullEntry ? 'border-b border-l' : darkerGrayBackground} ${verticallyCenteredContentClass} ${horizontallyCenteredContentClass}`}>
                                            {/* cols - L */}
                                            {!timesheetEntry.isNullEntry ? <p className={`${smallTextFontClass} uppercase text-center`}>{'Offshore'}</p> : ''}
                                        </div>
                                        <div className={`col-span-4 border-black ${cellPaddingForTimesheetTable} ${!timesheetEntry.isNullEntry ? 'border-b border-l' : darkerGrayBackground} ${verticallyCenteredContentClass} ${horizontallyCenteredContentClass}`}>
                                            {/* cols - M */}
                                            {!timesheetEntry.isNullEntry ? <p className={` ${xsTextFontClass} text-center`}>{timesheetEntry.locationType == LocationType.offshore ? '✔' : ''}</p> : ''}
                                        </div>
                                        <div className={`col-span-42 border-r border-black ${!timesheetEntry.isNullEntry ? 'border-b border-l' : darkerGrayBackground} ${verticallyCenteredContentClass} ${horizontallyCenteredContentClass}`}>
                                            {/* cols - N, O, P, Q, R */}
                                            {!timesheetEntry.isNullEntry ? <p className={` ${xsTextFontClass}`}>{timesheetEntry.locationType == LocationType.offshore ? timesheetEntry.comment : ''}</p> : ''}
                                        </div>
                                    </div>
                                </div>)}
                        </div>
                    </div>

                    {/* Verification Rows */}
                    <div className="verification-row-container">
                        <div className={`verification-heading-row grid ${gridColsForTimesheetTable} ${thickTopBorder} border-black`}>
                            <div className={`heading-label col-span-26 border-l border-black  ${cellPaddingForTimesheetTable} ${grayBackground} ${verticallyCenteredContentClass}`}>
                                {/* cols - A, B, C, D, */}
                                <p className={`${smallTextFontClass} uppercase italic `}>{templateConfig.label.personnelSignatureLabel}</p>
                            </div>
                            <div className={`heading-label col-span-94 border-x p-1 border-black ${cellPaddingForTimesheetTable} ${grayBackground} ${verticallyCenteredContentClass}`}>
                                {/* cols - G, H, I, J, K, L, M, N, O, P, Q, R */}
                                <p className={`${smallTextFontClass} uppercase italic`}>{templateConfig.staticValues.customerVerificationNote}</p>
                            </div>
                        </div>
                        <div className={`verification-sub-heading-row grid ${gridColsForTimesheetTable}`}>
                            <div className={`sub-heading-label col-span-26 border-t border-l  border-black ${cellPaddingForTimesheetTable} ${verticallyCenteredContentClass}`}>
                                {/* cols - A, B, C, D */}
                                <p className={`${smallTextFontClass} uppercase italic`}>{templateConfig.staticValues.signatureAttestationNote}</p>
                            </div>
                            <div className={`sub-heading-label col-span-20 border-t border-l ${cellPaddingForTimesheetTable} border-black ${grayBackground} ${verticallyCenteredContentClass}`}>
                                {/* cols - E, F, G, H, */}
                                <p className={`${smallTextFontClass} uppercase italic`}>{templateConfig.label.customerRepresentativeNameLabel}</p>
                            </div>
                            <div className={`sub-heading-label col-span-28 border-t border-l ${cellPaddingForTimesheetTable} border-black ${grayBackground} ${verticallyCenteredContentClass}`}>
                                {/* cols - I, J, K, L */}
                                <p className={`${smallTextFontClass} uppercase italic`}>{templateConfig.label.customerRepresentativeTitleLabel}</p>
                            </div>
                            <div className={`sub-heading-label col-span-46 border-t border-x ${cellPaddingForTimesheetTable} border-black ${grayBackground} ${verticallyCenteredContentClass}`}>
                                {/* cols - M, N, O, P, Q, R */}
                                <p className={`${smallTextFontClass} uppercase text-center italic`}>{templateConfig.label.customerRepresentativeSignatureLabel}</p>
                            </div>
                        </div>

                        <div className={`verification-value-row grid ${gridColsForTimesheetTable}`}>
                            <div className={`verification-value col-span-26 ${heightOfSignatureSectionClass} border-t border-l ${cellPaddingForTimesheetTable} border-black`}>
                                {/* cols - A, B, C, D */}
                                <p className={`${smallTextFontClass} uppercase`}></p>
                            </div>
                            <div className={`verification-value col-span-20 ${heightOfSignatureSectionClass} border-t border-l ${cellPaddingForTimesheetTable} border-black`}>
                                {/* cols - E, F, G, H, */}
                                <p className={`${smallTextFontClass} uppercase`}></p>
                            </div>
                            <div className={`verification-value col-span-28 ${heightOfSignatureSectionClass} border-t border-l ${cellPaddingForTimesheetTable} border-black`}>
                                {/* cols - I, J, K, L */}
                                <p className={`${smallTextFontClass} uppercase`}></p>
                            </div>
                            <div className={`verification-value col-span-46  ${heightOfSignatureSectionClass} border-t border-x ${cellPaddingForTimesheetTable} border-black`}>
                                {/* cols - M, N, O, P, Q, R */}
                                <p className={`${mediumTextFontClass} font-bold`}></p>
                            </div>
                        </div>

                        <div className={`verification-footer-row grid ${gridColsForTimesheetTable}`}>
                            <div className={`footer-label col-span-full border-t border-x ${cellPaddingForTimesheetTable} border-black ${grayBackground} ${verticallyCenteredContentClass}`}>
                                {/* cols - A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R*/}
                                <p className={`${smallTextFontClass} italic `}>{templateConfig.staticValues.defaultAgreementStatement}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address Rows */}
                <div className={`address-rows-container`}>
                    {templateConfig.footerAddress.map((address, index) => (
                        <div className={`address-row grid ${gridColsForTimesheetTable}`} key={index}>
                            <div className={`heading-label col-span-21 border-l ${cellPaddingForTimesheetTable} border-transparent`}>
                                {/* cols - A, B, C, */}
                            </div>
                            <div className={`heading-label col-span-99 border-x ${cellPaddingForTimesheetTable} border-transparent`}>
                                {/* cols -D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R */}
                                <p className={`${smallTextFontClass} italic`}>{address}</p>
                            </div>
                        </div>))}
                </div>
                <div className={`footer-offset-row w-full`} style={{ height: `${templateConfig.footerOffsetForPrintToPdf}rem` }}></div>
            </div>
        </div>

    )
}