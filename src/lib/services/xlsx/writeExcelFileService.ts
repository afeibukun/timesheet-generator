import writeXlsxFile, { SheetData } from 'write-excel-file'
import { Timesheet } from '../timesheet/timesheet'
import { TimesheetDate } from '../timesheet/timesheetDate'
import { LocationType, PeriodType } from '@/lib/constants'
import { TimesheetMeta } from '../timesheet/timesheetMeta'
import templateConfig from '../../../../main-timesheet-template'


export const createXlsxTimesheetStandardTemplateWithWriteExcelFile = async (timesheet: Timesheet) => {
    let groupedTimesheetEntry = timesheet.timesheetEntryCollectionByWeek
    let weeksInGroupedTimesheet: string[] = Object.keys(groupedTimesheetEntry)

    let timesheetMeta = timesheet.meta;

    let sheetCollection = sheetNameCollection(weeksInGroupedTimesheet);

    const timesheetExcelMultiSheetData = weeksInGroupedTimesheet.map((week) => {
        let timesheetEntryCollectionForCurrentWeek = groupedTimesheetEntry[week as any];
        let timesheetDateForLastDayOfCurrentWeek = timesheetEntryCollectionForCurrentWeek![timesheetEntryCollectionForCurrentWeek!.length - 1].date;
        let javascriptDateForLastDayOfCurrentWeek = timesheetDateForLastDayOfCurrentWeek.toJavascriptDate();

        // row has dynamic component
        // Row 1
        const metaRow1 = [
            {
                // column A
                value: '[Image]',
                span: 2,
                height: 30
            },
            // column B
            null,
            {
                // column C
                value: '',
            },
            {
                // column D
                value: '',
            }, {
                // column E
                value: '',
            },
            {
                // column F
                value: '',
            },
            {
                // column G
                value: '',
            },
            {
                // column H
                value: '',
            }, {
                // column I
                value: '',
            },
            {
                // column J
                value: '',
            },
            {
                // column K
                value: '',
            },
            {
                // column L
                value: '',
            }, {
                // column M
                value: '',
            },
            {
                // column N
                value: '',
            },
            {
                // column O
                value: '',
            },
            {
                // column P
                value: '',
            },
            {
                // column Q
                value: `WEEK ${week}`,
                span: 2,
                align: templateConfig.align.right,
                alignVertical: templateConfig.align.top,
                fontSize: templateConfig.fontSize.small,
                fontFamily: templateConfig.font.default,
                color: templateConfig.color.blue,
                fontWeight: templateConfig.fontStyle.bold,
            },
            // column R
            null,
        ]
        // Row 6
        const metaRow6 = [
            {
                // column A
                value: timesheetMeta.customerName.toUpperCase(), // customer name
                span: 6,
                fontSize: templateConfig.fontSize.default,
                fontFamily: templateConfig.font.default,
                fontWeight: templateConfig.fontStyle.bold,
                borderColor: templateConfig.color.black
            },
            // column B
            null,
            // column C
            null,
            // column D
            null,
            // column E
            null,
            // column F
            null,
            {
                // column G
                value: timesheetMeta.siteName.toUpperCase(), // site name
                span: 3,
                fontSize: templateConfig.fontSize.default,
                fontFamily: templateConfig.font.default,
                fontWeight: templateConfig.fontStyle.bold,
                borderColor: templateConfig.color.black
            },
            // column H
            null,
            // column I
            null,
            {
                // column J
                value: timesheetMeta.purchaseOrderNumber, // PO Number
                span: 3,
                fontSize: templateConfig.fontSize.default,
                fontFamily: templateConfig.font.default,
                fontWeight: templateConfig.fontStyle.bold,
                borderColor: templateConfig.color.black
            },
            // column K
            null,
            // column L
            null,
            {
                // column M
                value: timesheetMeta.siteCountry.toUpperCase(), // Site Country
                span: 2,
                fontSize: templateConfig.fontSize.default,
                fontFamily: templateConfig.font.default,
                fontWeight: templateConfig.fontStyle.bold,
                borderColor: templateConfig.color.black,
            },
            // column N
            null,
            {
                // column O
                value: TimesheetDate.addTimezoneOffsetToJavascriptDate(javascriptDateForLastDayOfCurrentWeek), // week ending date
                span: 4,
                type: Date,
                format: templateConfig.format.defaultDate,
                align: templateConfig.align.left,
                fontSize: templateConfig.fontSize.default,
                fontFamily: templateConfig.font.default,
                fontWeight: templateConfig.fontStyle.bold,
                borderColor: templateConfig.color.black,
            },
            // column P
            null,
            // column Q
            null,
            // column R
            null,
        ]

        // Row 9 - 22
        const timesheetCoreRows = timesheetEntryCollectionForCurrentWeek?.reduce((accumulator, currentTimesheetEntry, currentIndex, timesheetEntry) => {
            const timesheetEntryRowA = [
                {
                    // column A
                    value: currentTimesheetEntry.entryDateDayLabel.toUpperCase(),
                    fontSize: templateConfig.fontSize.small,
                    fontFamily: templateConfig.font.default,
                    borderColor: templateConfig.color.black,
                    backgroundColor: templateConfig.color.lightGray,
                    fontWeight: templateConfig.fontStyle.bold,
                    fontStyle: templateConfig.fontStyle.italic
                }, {
                    // column B
                    value: !currentTimesheetEntry.isEntryPeriodStartTimeNull ? PeriodType.start.toUpperCase() : '',
                    fontSize: templateConfig.fontSize.smaller,
                    fontFamily: templateConfig.font.default,
                    borderColor: !currentTimesheetEntry.isEntryPeriodStartTimeNull ? templateConfig.color.black : null,
                    backgroundColor: !currentTimesheetEntry.isEntryPeriodStartTimeNull ? null : templateConfig.color.white,
                    align: templateConfig.align.center,
                },
                {
                    // column C
                    value: !currentTimesheetEntry.isEntryPeriodStartTimeNull ? currentTimesheetEntry.entryPeriod?.startTime : '',
                    fontSize: templateConfig.fontSize.smaller,
                    fontFamily: templateConfig.font.default,
                    borderColor: !currentTimesheetEntry.isEntryPeriodStartTimeNull ? templateConfig.color.black : null,
                    backgroundColor: !currentTimesheetEntry.isEntryPeriodStartTimeNull ? null : templateConfig.color.white,
                    align: templateConfig.align.center,
                }, {
                    // column D
                    value: "",
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.black : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.white
                }, {
                    // column E
                    value: "",
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.black : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.white
                }, {
                    // column F
                    value: "",
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.black : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.white
                },
                {
                    // column G
                    value: "",
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.black : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.white
                }, {
                    // column H
                    value: "",
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.black : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.white
                },
                {
                    // column I
                    value: "",
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.black : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.white
                }, {
                    // column J
                    value: "",
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.black : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.white
                },
                {
                    // column K
                    value: currentTimesheetEntry.isEntryPeriodValid && currentTimesheetEntry.isLocationTypeOnshore ? `${currentTimesheetEntry.totalEntryPeriodHours}:00` : '',
                    fontSize: templateConfig.fontSize.small,
                    fontFamily: templateConfig.font.default,
                    borderColor: currentTimesheetEntry.isEntryPeriodValid ? templateConfig.color.black : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.white,
                    align: templateConfig.align.center,
                },
                {
                    // column L
                    value: currentTimesheetEntry.isEntryPeriodValid ? LocationType.onshore.toUpperCase() : '',
                    fontSize: templateConfig.fontSize.small,
                    fontFamily: templateConfig.font.default,
                    borderColor: currentTimesheetEntry.isEntryPeriodValid ? templateConfig.color.black : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.white
                },
                {
                    // column M
                    value: currentTimesheetEntry.isLocationTypeOnshore ? templateConfig.staticValues.locationTypeIndicator : '',
                    fontSize: templateConfig.fontSize.default,
                    fontFamily: templateConfig.font.default,
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.black : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.white,
                    align: templateConfig.align.center,
                },
                {
                    // column N
                    value: !currentTimesheetEntry.isCommentNull && currentTimesheetEntry.isLocationTypeOnshore ? currentTimesheetEntry.comment : "",
                    span: 5,
                    fontSize: templateConfig.fontSize.small,
                    fontFamily: templateConfig.font.default,
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.black : null,
                    rightBorderColor: templateConfig.color.black,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.white
                },
                // column O
                null,
                // column P
                null,
                // column Q
                null,
                // column R
                null,
            ]
            const timesheetEntryRowB = [
                {
                    // column A
                    value: currentTimesheetEntry.entryDateInDayMonthFormat,
                    fontSize: templateConfig.fontSize.small,
                    fontFamily: templateConfig.font.default,
                    borderColor: templateConfig.color.black,
                    align: templateConfig.align.right,
                }, {
                    // column B
                    value: !currentTimesheetEntry.isEntryPeriodFinishTimeNull ? PeriodType.finish.toUpperCase() : '',
                    fontSize: templateConfig.fontSize.smaller,
                    fontFamily: templateConfig.font.default,
                    borderColor: !currentTimesheetEntry.isEntryPeriodFinishTimeNull ? templateConfig.color.black : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.white,
                    align: templateConfig.align.center,
                },
                {
                    // column C
                    value: !currentTimesheetEntry.isEntryPeriodFinishTimeNull ? currentTimesheetEntry.entryPeriod?.finishTime : '',
                    fontSize: templateConfig.fontSize.smaller,
                    fontFamily: templateConfig.font.default,
                    borderColor: !currentTimesheetEntry.isEntryPeriodFinishTimeNull ? templateConfig.color.black : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.white,
                    align: templateConfig.align.center,
                }, {
                    // column D
                    value: "",
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.black : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.white
                }, {
                    // column E
                    value: "",
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.black : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.white
                }, {
                    // column F
                    value: "",
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.black : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.white
                },
                {
                    // column G
                    value: "",
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.black : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.white
                }, {
                    // column H
                    value: "",
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.black : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.white
                },
                {
                    // column I
                    value: "",
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.black : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.white
                }, {
                    // column J
                    value: "",
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.black : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.white
                },
                {
                    // column K
                    value: currentTimesheetEntry.isEntryPeriodValid && currentTimesheetEntry.isLocationTypeOffshore ? `${currentTimesheetEntry.totalEntryPeriodHours}:00` : "",
                    fontSize: templateConfig.fontSize.small,
                    fontFamily: templateConfig.font.default,
                    borderColor: currentTimesheetEntry.isEntryPeriodValid ? templateConfig.color.black : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.white,
                    align: templateConfig.align.center,
                },
                {
                    // column L
                    value: !currentTimesheetEntry.isNullEntry ? LocationType.offshore.toUpperCase() : "",
                    fontSize: templateConfig.fontSize.small,
                    fontFamily: templateConfig.font.default,
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.black : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.white
                },
                {
                    // column M
                    value: currentTimesheetEntry.isLocationTypeOffshore ? templateConfig.staticValues.locationTypeIndicator : '',
                    fontSize: templateConfig.fontSize.default,
                    fontFamily: templateConfig.font.default,
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.black : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.white,
                    align: templateConfig.align.center,
                },
                {
                    // column N
                    value: !currentTimesheetEntry.isCommentNull && currentTimesheetEntry.isLocationTypeOffshore ? currentTimesheetEntry.comment : "",
                    span: 5,
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.black : null,
                    rightBorderColor: templateConfig.color.black,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.white
                },
                // column O
                null,
                // column P
                null,
                // column Q
                null,
                // column R
                null,
            ]
            return [...accumulator, timesheetEntryRowA, timesheetEntryRowB]
        }, [] as any)

        return [
            metaRow1, ...generateExcelRowsForSemiDynamicMetaSection(timesheetMeta), metaRow6, ...generateExcelRowsForStaticHeaderSection(), ...timesheetCoreRows, ...generateExcelRowsForStaticFooterSection()]

    })

    const defaultColumns: any[] = [
        {
            // column A
            width: 8,
        },
        {
            // column B
            width: 8,
        },
        {
            // column C
            width: 5
        },
        {
            // column D
            width: 5
        },
        {
            // column E
            width: 5
        },
        {
            // column F
            width: 5
        },
        {
            // column G
            width: 5
        },
        {
            // column H
            width: 5
        },
        {
            // column I
            width: 5
        },
        {
            // column J
            width: 5
        },
        {
            // column K
            width: 8
        },
        {
            // column L
            // width: 9
            width: 12
        }, {
            // column M
            width: 4
        },
        {
            // column N
            // width: 9
            width: 12,
        },
        {
            // column O
            width: 8
        },
        {
            // column P            
            width: 7
        },
        {
            // column Q            
            width: 7,
        },
        {
            // column R            
            width: 8,
        },
    ]
    const timesheetColumnsForExcelMultiSheetData = weeksInGroupedTimesheet.map((week) => {
        return defaultColumns;
    });


    await writeXlsxFile(timesheetExcelMultiSheetData as SheetData[], {
        columns: timesheetColumnsForExcelMultiSheetData,
        sheets: sheetCollection,
        fileName: 'timesheet.xlsx',
        orientation: 'landscape',
        fontFamily: templateConfig.font.default
    })

}

const generateExcelRowsForSemiDynamicMetaSection = (timesheetMeta: TimesheetMeta) => {
    // Row 2 - empty row
    const metaRow2 = [
        {
            // column A
            value: '',
        },
        {
            // column B
            value: '',
        },
        {
            // column C
            value: '',
        },
        {
            // column D
            value: '',
        }, {
            // column E
            value: '',
        },
        {
            // column F
            value: '',
        },
        {
            // column G
            value: '',
        },
        {
            // column H
            value: '',
        }, {
            // column I
            value: '',
        },
        {
            // column J
            value: '',
        },
        {
            // column K
            value: '',
        },
        {
            // column L
            value: '',
        }, {
            // column M
            value: '',
        },
        {
            // column N
            value: '',
        },
        {
            // column O
            value: '',
        },
        {
            // column P
            value: '',
        },
        {
            // column Q
            value: '',
        },
        {
            // column R
            value: '',
        },
    ]

    // Row 3
    const metaRow3 = [
        {
            // column A
            value: templateConfig.label.title.toUpperCase(), // title label
            span: 4,
            fontFamily: templateConfig.font.default,
            fontSize: templateConfig.fontSize.default,
            color: templateConfig.color.blue,
            borderColor: templateConfig.color.black,
            fontWeight: templateConfig.fontStyle.bold
        },
        // column B
        null,
        // column C
        null,
        // column D
        null,
        {
            // column E
            value: templateConfig.label.personnelName.toUpperCase(), // personel name label
            span: 5,
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            fontStyle: templateConfig.fontStyle.italic,
            backgroundColor: templateConfig.color.lightGray,
            borderColor: templateConfig.color.black
        },
        // column F
        null,
        // column G
        null,
        // column H
        null,
        // column I
        null,
        {
            // column J
            value: templateConfig.label.mobilizationDate.toUpperCase(), // mobilization date label
            span: 3,
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            fontStyle: templateConfig.fontStyle.italic,
            backgroundColor: templateConfig.color.lightGray,
            borderColor: templateConfig.color.black
        },
        // column K
        null,
        // column L
        null,
        {
            // column M
            value: templateConfig.label.demobilizationDate.toUpperCase(), //demobilization date label
            span: 3,
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            fontStyle: templateConfig.fontStyle.italic,
            backgroundColor: templateConfig.color.lightGray,
            borderColor: templateConfig.color.black
        },
        // column N
        null,
        // column O
        null,
        {
            // column P
            value: templateConfig.label.orderNumber.toUpperCase(), // order number label
            span: 3,
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            fontStyle: templateConfig.fontStyle.italic,
            backgroundColor: templateConfig.color.lightGray,
            borderColor: templateConfig.color.black,
        },
        // column Q
        null,
        // column R
        null,
    ]

    // Row 4
    const metaRow4 = [
        {
            // column A
            value: templateConfig.staticValues.defaultTitle.toUpperCase(), //default title
            span: 4,
            fontSize: templateConfig.fontSize.large,
            fontFamily: templateConfig.font.default,
            fontWeight: templateConfig.fontStyle.bold,
            color: templateConfig.color.blue,
            borderColor: templateConfig.color.black
        },
        // column B
        null,
        // column C
        null,
        // column D
        null,
        {
            // column E
            value: timesheetMeta.personnelName.toUpperCase(), // personnel name
            span: 5,
            fontSize: templateConfig.fontSize.default,
            fontFamily: templateConfig.font.default,
            fontWeight: templateConfig.fontStyle.bold,
            borderColor: templateConfig.color.black
        },
        // column F
        null,
        // column G
        null,
        // column H
        null,
        // column I
        null,
        {
            // column J
            value: TimesheetDate.addTimezoneOffsetToJavascriptDate(timesheetMeta.mobilizationDate.toJavascriptDate()), // mobilization date
            type: Date,
            format: templateConfig.format.defaultDate,
            span: 3,
            align: templateConfig.align.left,
            fontSize: templateConfig.fontSize.default,
            fontFamily: templateConfig.font.default,
            fontWeight: templateConfig.fontStyle.bold,
            borderColor: templateConfig.color.black
        },
        // column K
        null,
        // column L
        null,
        {
            // column M
            value: TimesheetDate.addTimezoneOffsetToJavascriptDate(timesheetMeta.demobilizationDate.toJavascriptDate()), // demob date
            type: Date,
            format: templateConfig.format.defaultDate,
            span: 3,
            align: templateConfig.align.left,
            fontSize: templateConfig.fontSize.default,
            fontFamily: templateConfig.font.default,
            fontWeight: templateConfig.fontStyle.bold,
            borderColor: templateConfig.color.black
        },
        // column N
        null,
        // column O
        null,
        {
            // column P
            value: '', // order number
            span: 3,
            fontSize: templateConfig.fontSize.default,
            fontFamily: templateConfig.font.default,
            fontWeight: templateConfig.fontStyle.bold,
            borderColor: templateConfig.color.black
        },
        // column Q
        null,
        // column R
        null,
    ]

    // Row 5
    const metaRow5 = [
        {
            // column A
            value: templateConfig.label.customerName.toUpperCase(), // customer name label
            span: 6,
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            fontStyle: templateConfig.fontStyle.italic,
            backgroundColor: templateConfig.color.lightGray,
            borderColor: templateConfig.color.black
        },
        // column B
        null,
        // column C
        null,
        // column D
        null,
        // column E
        null,
        // column F
        null,
        {
            // column G
            value: templateConfig.label.siteName.toUpperCase(), // site name label
            span: 3,
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            fontStyle: templateConfig.fontStyle.italic,
            backgroundColor: templateConfig.color.lightGray,
            borderColor: templateConfig.color.black
        },
        // column H
        null,
        // column I
        null,
        {
            // column J
            value: templateConfig.label.purchaseOrderNumber.toUpperCase(), // purchase order number label
            span: 3,
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            fontStyle: templateConfig.fontStyle.italic,
            backgroundColor: templateConfig.color.lightGray,
            borderColor: templateConfig.color.black
        },
        // column K
        null,
        // column L
        null,
        {
            // column M
            value: templateConfig.label.countryName.toUpperCase(), // country label
            span: 2,
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            fontStyle: templateConfig.fontStyle.italic,
            backgroundColor: templateConfig.color.lightGray,
            borderColor: templateConfig.color.black,
        },
        // column N
        null,
        {
            // column O
            value: templateConfig.label.weekEndingDate.toUpperCase(), // week ending date label
            span: 4,
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            fontStyle: templateConfig.fontStyle.italic,
            backgroundColor: templateConfig.color.lightGray,
            borderColor: templateConfig.color.black,
        },
        // column P
        null,
        // column Q
        null,
        // column R
        null,
    ]

    return [metaRow2, metaRow3, metaRow4, metaRow5];
}

const generateExcelRowsForStaticHeaderSection = () => {
    const timesheetHeaderRow1 = [
        {
            // column A
            value: templateConfig.label.dateTitle.toUpperCase(),
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            topBorderStyle: templateConfig.border.thickBorderStyle,
            borderColor: templateConfig.color.black,
            backgroundColor: templateConfig.color.lightGray,
            fontWeight: templateConfig.fontStyle.bold,
            fontStyle: templateConfig.fontStyle.italic
        }, {
            // column B
            value: templateConfig.label.workingTimeTitle.toUpperCase(),
            span: 5,
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            topBorderStyle: templateConfig.border.thickBorderStyle,
            borderColor: templateConfig.color.black,
            backgroundColor: templateConfig.color.lightGray,
            fontStyle: templateConfig.fontStyle.italic
        },
        // column C
        null,
        // column D
        null,
        // column E
        null,
        // column F
        null,
        {
            // column G
            value: templateConfig.label.waitingTimeTitle.toUpperCase(),
            span: 2,
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            topBorderStyle: templateConfig.border.thickBorderStyle,
            borderColor: templateConfig.color.black,
            backgroundColor: templateConfig.color.lightGray,
            fontStyle: templateConfig.fontStyle.italic
        },
        // column H
        null,
        {
            // column I
            value: templateConfig.label.travelTimeTitle.toUpperCase(),
            span: 2,
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            topBorderStyle: templateConfig.border.thickBorderStyle,
            borderColor: templateConfig.color.black,
            backgroundColor: templateConfig.color.lightGray,
            fontStyle: templateConfig.fontStyle.italic
        },
        // column J
        null,
        {
            // column K
            value: templateConfig.label.totalHoursTitle.toUpperCase(),
            rowSpan: 2,
            wrap: true,
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            borderColor: templateConfig.color.black,
            topBorderStyle: templateConfig.border.thickBorderStyle,
            backgroundColor: templateConfig.color.lightGray,
            fontStyle: templateConfig.fontStyle.italic,
            align: templateConfig.align.center,
        },
        {
            // column L
            value: templateConfig.label.locationTypeIndicatorTitle,
            rowSpan: 2,
            wrap: true,
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            topBorderStyle: templateConfig.border.thickBorderStyle,
            borderColor: templateConfig.color.black,
        },
        {
            // column M
            value: '',
            borderColor: templateConfig.color.black,
            topBorderStyle: templateConfig.border.thickBorderStyle,
        },
        {
            // column N
            value: templateConfig.label.commentTitle.toUpperCase(),
            span: 5,
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            topBorderStyle: templateConfig.border.thickBorderStyle,
            borderColor: templateConfig.color.black,
        },
        // column O
        null,
        // column P
        null,
        // column Q
        null,
        // column R
        null,
    ]

    const timesheetHeaderRow2 = [
        {
            // column A
            value: '',
            borderColor: templateConfig.color.black,
        }, {
            // column B
            value: templateConfig.label.periodTitle.toUpperCase(),
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            borderColor: templateConfig.color.black,
            align: templateConfig.align.center
        },
        {
            // column C
            value: templateConfig.staticValues.workingTimeFirstPeriodTitle,
            type: Number,
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            borderColor: templateConfig.color.black,
            align: templateConfig.align.center
        }, {
            // column D
            value: templateConfig.staticValues.workingTimeSecondPeriodTitle,
            type: Number,
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            borderColor: templateConfig.color.black,
            align: templateConfig.align.center
        }, {
            // column E
            value: templateConfig.staticValues.workingTimeThirdPeriodTitle,
            type: Number,
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            borderColor: templateConfig.color.black,
            align: templateConfig.align.center
        }, {
            // column F
            value: templateConfig.staticValues.workingTimeFourthPeriodTitle,
            type: Number,
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            borderColor: templateConfig.color.black,
            align: templateConfig.align.center
        },
        {
            // column G
            value: templateConfig.staticValues.waitingTimeFirstPeriodTitle,
            type: Number,
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            borderColor: templateConfig.color.black,
            align: templateConfig.align.center
        }, {
            // column H
            value: templateConfig.staticValues.waitingTimeSecondPeriodTitle,
            type: Number,
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            borderColor: templateConfig.color.black,
            align: templateConfig.align.center
        },
        {
            // column I
            value: templateConfig.staticValues.travelTimeFirstPeriodTitle,
            type: Number,
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            borderColor: templateConfig.color.black,
            align: templateConfig.align.center
        }, {
            // column J
            value: templateConfig.staticValues.travelTimeSecondPeriodTitle,
            type: Number,
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            borderColor: templateConfig.color.black,
            align: templateConfig.align.center
        },
        // column K
        null,
        // column L
        null,
        {
            // column M
            value: templateConfig.staticValues.locationTypeIndicator,
            borderColor: templateConfig.color.black,
            align: templateConfig.align.center
        },
        {
            // column N
            value: "",
            span: 5,
            borderColor: templateConfig.color.black,
        },
        // column O
        null,
        // column P
        null,
        // column Q
        null,
        // column R
        null,
    ]
    return [timesheetHeaderRow1, timesheetHeaderRow2]
}

const generateExcelRowsForStaticFooterSection = () => {
    // Row 1
    const timesheetFooterRow1 = [
        {
            // column A
            value: templateConfig.label.personnelSignature.toUpperCase(),
            span: 4,
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            topBorderStyle: templateConfig.border.thickBorderStyle,
            borderColor: templateConfig.color.black,
            fontStyle: templateConfig.fontStyle.italic,
            backgroundColor: templateConfig.color.lightGray
        },
        // column B
        null,
        // column C
        null,
        // column D
        null,
        {
            // column E
            value: templateConfig.label.customerVerificationNote.toUpperCase(),
            span: 14,
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            topBorderStyle: templateConfig.border.thickBorderStyle,
            borderColor: templateConfig.color.black,
            fontStyle: templateConfig.fontStyle.italic,
            backgroundColor: templateConfig.color.lightGray
        },
        // column F
        null,
        // column G
        null,
        // column H
        null,
        // column I
        null,
        // column J
        null,
        // column K
        null,
        // column L
        null,
        // column M
        null,
        // column N
        null,
        // column O
        null,
        // column P
        null,
        // column Q
        null,
        // column R
        null,
    ]

    // Row 2
    const timesheetFooterRow2 = [
        {
            // column A
            value: templateConfig.staticValues.personnelSignatureCertificationNote.toUpperCase(),
            span: 4,
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            borderColor: templateConfig.color.black,
            fontStyle: templateConfig.fontStyle.italic,
        },
        // column B
        null,
        // column C
        null,
        // column D
        null,
        {
            // column E
            value: templateConfig.label.customerRepresentativeName.toUpperCase(),
            span: 4,
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            borderColor: templateConfig.color.black,
            fontStyle: templateConfig.fontStyle.italic,
            backgroundColor: templateConfig.color.lightGray
        },
        // column F
        null,
        // column G
        null,
        // column H
        null,
        {
            // column I
            value: templateConfig.label.customerRepresentativeTitle.toUpperCase(),
            span: 4,
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            borderColor: templateConfig.color.black,
            fontStyle: templateConfig.fontStyle.italic,
            backgroundColor: templateConfig.color.lightGray
        },
        // column J
        null,
        // column K
        null,
        // column L
        null,
        {
            // column M
            value: templateConfig.label.customerRepresentativeSignature.toUpperCase(),
            span: 6,
            align: templateConfig.align.center,
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            borderColor: templateConfig.color.black,
            fontStyle: templateConfig.fontStyle.italic,
            backgroundColor: templateConfig.color.lightGray
        },
        // column N
        null,
        // column O
        null,
        // column P
        null,
        // column Q
        null,
        // column R
        null,
    ]

    // Row 3
    const timesheetFooterRow3 = [
        {
            // column A
            value: '',
            span: 4,
            rowSpan: 2,
            borderColor: templateConfig.color.black
        },
        // column B
        null,
        // column C
        null,
        // column D
        null,
        {
            // column E
            value: "",
            span: 4,
            rowSpan: 2,
            borderColor: templateConfig.color.black
        },
        // column F
        null,
        // column G
        null,
        // column H
        null,
        {
            // column I
            value: "",
            span: 4,
            rowSpan: 2,
            borderColor: templateConfig.color.black
        },
        // column J
        null,
        // column K
        null,
        // column L
        null,
        {
            // column M
            value: "",
            span: 6,
            rowSpan: 2,
            borderColor: templateConfig.color.black
        },
        // column N
        null,
        // column O
        null,
        // column P
        null,
        // column Q
        null,
        // column R
        null,
    ]

    // about row 26
    const timesheetFooterRow4 = [
        // column A
        null,
        // column B
        null,
        // column C
        null,
        // column D
        null,
        // column E
        null,
        // column F
        null,
        // column G
        null,
        // column H
        null,
        // column I
        null,
        // column J
        null,
        // column K
        null,
        // column L
        null,
        // column M
        null,
        // column N
        null,
        // column O
        null,
        // column P
        null,
        // column Q
        null,
        // column R
        null,
    ]
    // Row 27
    const timesheetFooterRow5 = [
        {
            // column A
            value: templateConfig.staticValues.defaultAgreementStatement,
            span: 18,
            fontSize: templateConfig.fontSize.small,
            fontFamily: templateConfig.font.default,
            borderColor: templateConfig.color.black,
            fontStyle: templateConfig.fontStyle.italic,
            backgroundColor: templateConfig.color.lightGray
        },
        // column B
        null,
        // column C
        null,
        // column D
        null,
        // column E
        null,
        // column F
        null,
        // column G
        null,
        // column H
        null,
        // column I
        null,
        // column J
        null,
        // column K
        null,
        // column L
        null,
        // column M
        null,
        // column N
        null,
        // column O
        null,
        // column P
        null,
        // column Q
        null,
        // column R
        null,
    ]
    // empty row - Row 28
    const timesheetFooterRow6 = [
        {
            // column A
            value: "",
            span: 18,
        },
        // column B
        null,
        // column C
        null,
        // column D
        null,
        // column E
        null,
        // column F
        null,
        // column G
        null,
        // column H
        null,
        // column I
        null,
        // column J
        null,
        // column K
        null,
        // column L
        null,
        // column M
        null,
        // column N
        null,
        // column O
        null,
        // column P
        null,
        // column Q
        null,
        // column R
        null,
    ]

    // from Row 29
    const footerAddressList = templateConfig.footerAddress.map((address) => {
        const footerAddressRow = [
            {
                // column A
                value: "",
            },
            // column B
            null,
            // column C
            null,
            {
                // column D
                value: address,
                fontSize: templateConfig.fontSize.small,
                fontFamily: templateConfig.font.default,
                fontStyle: templateConfig.fontStyle.italic,
            },
            // column E
            null,
            // column F
            null,
            // column G
            null,
            // column H
            null,
            // column I
            null,
            // column J
            null,
            // column K
            null,
            // column L
            null,
            // column M
            null,
            // column N
            null,
            // column O
            null,
            // column P
            null,
            // column Q
            null,
            // column R
            null,
        ]
        return footerAddressRow;
    })

    return [timesheetFooterRow1, timesheetFooterRow2, timesheetFooterRow3, timesheetFooterRow4, timesheetFooterRow5, timesheetFooterRow6, ...footerAddressList];
}

export const createXlsxTimesheetWithDefaultTemplateB = async () => {

    const HEADER_ROW = [
        {
            value: 'Name',
            fontWeight: 'bold'
        },
        {
            value: 'Date of Birth',
            fontWeight: 'bold'
        },
        {
            value: 'Cost',
            fontWeight: 'bold'
        },
        {
            value: 'Paid',
            fontWeight: 'bold'
        }
    ]

    const DATA_ROW_1 = [
        // "Name"
        {
            type: String,
            value: 'John Smith'
        },

        // "Date of Birth"
        {
            type: Date,
            value: new Date(),
            format: 'mm/dd/yyyy'
        },

        // "Cost"
        {
            type: Number,
            value: 1800
        },

        // "Paid"
        {
            type: Boolean,
            value: true
        }
    ]


    const data = [
        HEADER_ROW,
        DATA_ROW_1,
        //...
    ] as any;

    await writeXlsxFile(data as SheetData[], {
        // columns, // (optional) column widths, etc.
        fileName: 'file.xlsx'
    })
}

export const createXlsxTimesheetWithDefaultTemplateC = async () => {

    const objects = [
        {
            name: 'John Smith',
            dateOfBirth: new Date(),
            cost: 1800,
            paid: true
        },
        {
            name: 'Alice Brown',
            dateOfBirth: new Date(),
            cost: 2600,
            paid: false
        }
    ]

    const schema = [
        {

            type: String,
            value: (student: { name: any }) => student.name
        },
        {

            type: Date,
            format: 'mm/dd/yyyy',
            value: (student: { dateOfBirth: any }) => student.dateOfBirth
        },
        {

            type: Number,
            format: '#,##0.00',
            value: (student: { cost: any }) => student.cost
        },
        {

            type: Boolean,
            value: (student: { paid: any }) => student.paid
        }
    ]


    await writeXlsxFile(objects as Object[], {
        schema,
        fileName: 'file2.xlsx'
    })

}

const sheetNameCollection = (weeksInGroupedTimesheet: any[]) => {
    let startPoint = "A"
    let startPointNumber = startPoint.charCodeAt(0);
    let _sheetNameCollection = weeksInGroupedTimesheet.map((week, index) => {
        return `${String.fromCharCode(startPointNumber + index)}-Week(${week})`
    })
    return _sheetNameCollection
}

export const createXlsTimesheet = () => {
    // const xls
}
