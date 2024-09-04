import writeXlsxFile, { SheetData } from 'write-excel-file'
import { Timesheet } from '../timesheet/timesheet'
import { TimesheetDate } from '../timesheet/timesheetDate'
import { TimesheetEntryPeriod } from '../timesheet/timesheetEntryPeriod'
import { LocationType } from '@/lib/constants'
import moment from 'moment'
import { TimesheetMeta } from '../timesheet/timesheetMeta'

import templateConfig from '../../../../main-timesheet-template'

export const createXlsxTimesheetWithDefaultTemplate = async (timesheet: Timesheet) => {
    let groupedTimesheetEntry = timesheet.timesheetEntryCollectionByWeek
    let weeksInGroupedTimesheet: string[] = Object.keys(groupedTimesheetEntry)

    let timesheetMeta = timesheet.meta;

    let startPoint = "A"
    let startPointNumber = startPoint.charCodeAt(0);
    let sheetCollection = weeksInGroupedTimesheet.map((week, index) => {
        return `Wk-${String.fromCharCode(startPointNumber + index)}(${week})`
    })

    const timesheetExcelMultiSheetData = weeksInGroupedTimesheet.map((week) => {
        let timesheetEntryCollectionForCurrentWeek = groupedTimesheetEntry[week as any];
        let timesheetDateForLastDayOfCurrentWeek = timesheetEntryCollectionForCurrentWeek![timesheetEntryCollectionForCurrentWeek!.length - 1].date;
        let javascriptDateForLastDayOfCurrentWeek = timesheetDateForLastDayOfCurrentWeek.toJavascriptDate();

        // row has dynamic component
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
                align: templateConfig.align.rightAlign,
                alignVertical: templateConfig.align.topAlign,
                fontSize: templateConfig.font.smallFontSize,
                fontFamily: templateConfig.font.defaultFontFamily,
                color: templateConfig.color.blueColor,
                fontWeight: templateConfig.font.boldFontWeight,
            },
            // column R
            null,
        ]
        const metaRow6 = [
            {
                // column A
                value: timesheetMeta.customerName.toUpperCase(), // customer name
                span: 6,
                fontSize: templateConfig.font.defaultFontSize,
                fontFamily: templateConfig.font.defaultFontFamily,
                fontWeight: templateConfig.font.boldFontWeight,
                borderColor: templateConfig.color.blackColor
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
                fontSize: templateConfig.font.defaultFontSize,
                fontFamily: templateConfig.font.defaultFontFamily,
                fontWeight: templateConfig.font.boldFontWeight,
                borderColor: templateConfig.color.blackColor
            },
            // column H
            null,
            // column I
            null,
            {
                // column J
                value: timesheetMeta.purchaseOrderNumber, // PO Number
                span: 3,
                fontSize: templateConfig.font.defaultFontSize,
                fontFamily: templateConfig.font.defaultFontFamily,
                fontWeight: templateConfig.font.boldFontWeight,
                borderColor: templateConfig.color.blackColor
            },
            // column K
            null,
            // column L
            null,
            {
                // column M
                value: timesheetMeta.siteCountry.toUpperCase(), // Site Country
                span: 2,
                fontSize: templateConfig.font.defaultFontSize,
                fontFamily: templateConfig.font.defaultFontFamily,
                fontWeight: templateConfig.font.boldFontWeight,
                borderColor: templateConfig.color.blackColor,
            },
            // column N
            null,
            {
                // column O
                value: TimesheetDate.addTimezoneOffsetToJavascriptDate(javascriptDateForLastDayOfCurrentWeek), // week ending date
                span: 4,
                type: Date,
                format: templateConfig.format.defaultDateFormat,
                align: templateConfig.align.leftAlign,
                fontSize: templateConfig.font.defaultFontSize,
                fontFamily: templateConfig.font.defaultFontFamily,
                fontWeight: templateConfig.font.boldFontWeight,
                borderColor: templateConfig.color.blackColor,
            },
            // column P
            null,
            // column Q
            null,
            // column R
            null,
        ]

        const timesheetCoreRows = timesheetEntryCollectionForCurrentWeek?.reduce((accumulator, currentTimesheetEntry, currentIndex, timesheetEntry) => {
            const timesheetEntryRowA = [
                {
                    // column A
                    value: currentTimesheetEntry.entryDateDayLabel.toUpperCase(),
                    fontSize: templateConfig.font.smallFontSize,
                    fontFamily: templateConfig.font.defaultFontFamily,
                    borderColor: templateConfig.color.blackColor,
                    backgroundColor: templateConfig.color.lightGrayColor,
                    fontWeight: templateConfig.font.boldFontWeight,
                    fontStyle: templateConfig.font.italicFontStyle
                }, {
                    // column B
                    value: !currentTimesheetEntry.isEntryPeriodStartTimeNull ? 'START' : '',
                    fontSize: templateConfig.font.smallerFontSize,
                    fontFamily: templateConfig.font.defaultFontFamily,
                    borderColor: !currentTimesheetEntry.isEntryPeriodStartTimeNull ? templateConfig.color.blackColor : null,
                    backgroundColor: !currentTimesheetEntry.isEntryPeriodStartTimeNull ? null : templateConfig.color.mildGrayColor,
                    align: templateConfig.align.centerAlign,
                },
                {
                    // column C
                    value: !currentTimesheetEntry.isEntryPeriodStartTimeNull ? currentTimesheetEntry.entryPeriod?.startTime : '',
                    fontSize: templateConfig.font.smallerFontSize,
                    fontFamily: templateConfig.font.defaultFontFamily,
                    borderColor: !currentTimesheetEntry.isEntryPeriodStartTimeNull ? templateConfig.color.blackColor : null,
                    backgroundColor: !currentTimesheetEntry.isEntryPeriodStartTimeNull ? null : templateConfig.color.mildGrayColor,
                    align: templateConfig.align.centerAlign,
                }, {
                    // column D
                    value: "",
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.blackColor : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.mildGrayColor
                }, {
                    // column E
                    value: "",
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.blackColor : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.mildGrayColor
                }, {
                    // column F
                    value: "",
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.blackColor : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.mildGrayColor
                },
                {
                    // column G
                    value: "",
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.blackColor : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.mildGrayColor
                }, {
                    // column H
                    value: "",
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.blackColor : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.mildGrayColor
                },
                {
                    // column I
                    value: "",
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.blackColor : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.mildGrayColor
                }, {
                    // column J
                    value: "",
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.blackColor : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.mildGrayColor
                },
                {
                    // column K
                    value: currentTimesheetEntry.isEntryPeriodValid && currentTimesheetEntry.isLocationTypeOnshore ? `${currentTimesheetEntry.totalEntryPeriodHours}:00` : '',
                    fontSize: templateConfig.font.smallFontSize,
                    fontFamily: templateConfig.font.defaultFontFamily,
                    borderColor: currentTimesheetEntry.isEntryPeriodValid ? templateConfig.color.blackColor : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.mildGrayColor,
                    align: templateConfig.align.centerAlign,
                },
                {
                    // column L
                    value: currentTimesheetEntry.isEntryPeriodValid ? "ONSHORE" : '',
                    fontSize: templateConfig.font.smallFontSize,
                    fontFamily: templateConfig.font.defaultFontFamily,
                    borderColor: currentTimesheetEntry.isEntryPeriodValid ? templateConfig.color.blackColor : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.mildGrayColor
                },
                {
                    // column M
                    value: currentTimesheetEntry.isLocationTypeOnshore ? templateConfig.staticValues.locationTypeIndicator : '',
                    fontSize: templateConfig.font.defaultFontSize,
                    fontFamily: templateConfig.font.defaultFontFamily,
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.blackColor : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.mildGrayColor,
                    align: templateConfig.align.centerAlign,
                },
                {
                    // column N
                    value: !currentTimesheetEntry.isCommentNull && currentTimesheetEntry.isLocationTypeOnshore ? currentTimesheetEntry.comment : "",
                    span: 5,
                    fontSize: templateConfig.font.smallFontSize,
                    fontFamily: templateConfig.font.defaultFontFamily,
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.blackColor : null,
                    rightBorderColor: templateConfig.color.blackColor,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.mildGrayColor
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
                    fontSize: templateConfig.font.smallFontSize,
                    fontFamily: templateConfig.font.defaultFontFamily,
                    borderColor: templateConfig.color.blackColor,
                    align: templateConfig.align.rightAlign,
                }, {
                    // column B
                    value: !currentTimesheetEntry.isEntryPeriodFinishTimeNull ? 'FINISH' : '',
                    fontSize: templateConfig.font.smallerFontSize,
                    fontFamily: templateConfig.font.defaultFontFamily,
                    borderColor: !currentTimesheetEntry.isEntryPeriodFinishTimeNull ? templateConfig.color.blackColor : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.mildGrayColor,
                    align: templateConfig.align.centerAlign,
                },
                {
                    // column C
                    value: !currentTimesheetEntry.isEntryPeriodFinishTimeNull ? currentTimesheetEntry.entryPeriod?.finishTime : '',
                    fontSize: templateConfig.font.smallerFontSize,
                    fontFamily: templateConfig.font.defaultFontFamily,
                    borderColor: !currentTimesheetEntry.isEntryPeriodFinishTimeNull ? templateConfig.color.blackColor : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.mildGrayColor,
                    align: templateConfig.align.centerAlign,
                }, {
                    // column D
                    value: "",
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.blackColor : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.mildGrayColor
                }, {
                    // column E
                    value: "",
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.blackColor : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.mildGrayColor
                }, {
                    // column F
                    value: "",
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.blackColor : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.mildGrayColor
                },
                {
                    // column G
                    value: "",
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.blackColor : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.mildGrayColor
                }, {
                    // column H
                    value: "",
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.blackColor : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.mildGrayColor
                },
                {
                    // column I
                    value: "",
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.blackColor : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.mildGrayColor
                }, {
                    // column J
                    value: "",
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.blackColor : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.mildGrayColor
                },
                {
                    // column K
                    value: currentTimesheetEntry.isEntryPeriodValid && currentTimesheetEntry.isLocationTypeOffshore ? `${currentTimesheetEntry.totalEntryPeriodHours}:00` : "",
                    fontSize: templateConfig.font.smallFontSize,
                    fontFamily: templateConfig.font.defaultFontFamily,
                    borderColor: currentTimesheetEntry.isEntryPeriodValid ? templateConfig.color.blackColor : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.mildGrayColor,
                    align: templateConfig.align.centerAlign,
                },
                {
                    // column L
                    value: !currentTimesheetEntry.isNullEntry ? "OFFSHORE" : "",
                    fontSize: templateConfig.font.smallFontSize,
                    fontFamily: templateConfig.font.defaultFontFamily,
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.blackColor : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.mildGrayColor
                },
                {
                    // column M
                    value: currentTimesheetEntry.isLocationTypeOffshore ? templateConfig.staticValues.locationTypeIndicator : '',
                    fontSize: templateConfig.font.defaultFontSize,
                    fontFamily: templateConfig.font.defaultFontFamily,
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.blackColor : null,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.mildGrayColor,
                    align: templateConfig.align.centerAlign,
                },
                {
                    // column N
                    value: !currentTimesheetEntry.isCommentNull && currentTimesheetEntry.isLocationTypeOffshore ? currentTimesheetEntry.comment : "",
                    span: 5,
                    borderColor: !currentTimesheetEntry.isNullEntry ? templateConfig.color.blackColor : null,
                    rightBorderColor: templateConfig.color.blackColor,
                    backgroundColor: !currentTimesheetEntry.isNullEntry ? null : templateConfig.color.mildGrayColor
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
        fontFamily: templateConfig.font.defaultFontFamily
    })

}

const generateExcelRowsForSemiDynamicMetaSection = (timesheetMeta: TimesheetMeta) => {
    // empty row
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

    const metaRow3 = [
        {
            // column A
            value: templateConfig.label.titleLabel.toUpperCase(), // title label
            span: 4,
            fontFamily: templateConfig.font.defaultFontFamily,
            fontSize: templateConfig.font.defaultFontSize,
            color: templateConfig.color.blueColor,
            borderColor: templateConfig.color.blackColor,
            fontWeight: templateConfig.font.boldFontWeight
        },
        // column B
        null,
        // column C
        null,
        // column D
        null,
        {
            // column E
            value: templateConfig.label.personnelNameLabel.toUpperCase(), // personel name label
            span: 5,
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            fontStyle: templateConfig.font.italicFontStyle,
            backgroundColor: templateConfig.color.lightGrayColor,
            borderColor: templateConfig.color.blackColor
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
            value: templateConfig.label.mobilizationDateLabel.toUpperCase(), // mobilization date label
            span: 3,
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            fontStyle: templateConfig.font.italicFontStyle,
            backgroundColor: templateConfig.color.lightGrayColor,
            borderColor: templateConfig.color.blackColor
        },
        // column K
        null,
        // column L
        null,
        {
            // column M
            value: templateConfig.label.demobilizationDateLabel.toUpperCase(), //demobilization date label
            span: 3,
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            fontStyle: templateConfig.font.italicFontStyle,
            backgroundColor: templateConfig.color.lightGrayColor,
            borderColor: templateConfig.color.blackColor
        },
        // column N
        null,
        // column O
        null,
        {
            // column P
            value: templateConfig.label.orderNumberLabel.toUpperCase(), // order number label
            span: 3,
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            fontStyle: templateConfig.font.italicFontStyle,
            backgroundColor: templateConfig.color.lightGrayColor,
            borderColor: templateConfig.color.blackColor,
        },
        // column Q
        null,
        // column R
        null,
    ]

    const metaRow4 = [
        {
            // column A
            value: templateConfig.staticValues.defaultTitle.toUpperCase(), //default title
            span: 4,
            fontSize: templateConfig.font.largeFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            fontWeight: templateConfig.font.boldFontWeight,
            color: templateConfig.color.blueColor,
            borderColor: templateConfig.color.blackColor
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
            fontSize: templateConfig.font.defaultFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            fontWeight: templateConfig.font.boldFontWeight,
            borderColor: templateConfig.color.blackColor
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
            format: templateConfig.format.defaultDateFormat,
            span: 3,
            align: templateConfig.align.leftAlign,
            fontSize: templateConfig.font.defaultFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            fontWeight: templateConfig.font.boldFontWeight,
            borderColor: templateConfig.color.blackColor
        },
        // column K
        null,
        // column L
        null,
        {
            // column M
            value: TimesheetDate.addTimezoneOffsetToJavascriptDate(timesheetMeta.demobilizationDate.toJavascriptDate()), // demob date
            type: Date,
            format: templateConfig.format.defaultDateFormat,
            span: 3,
            align: templateConfig.align.leftAlign,
            fontSize: templateConfig.font.defaultFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            fontWeight: templateConfig.font.boldFontWeight,
            borderColor: templateConfig.color.blackColor
        },
        // column N
        null,
        // column O
        null,
        {
            // column P
            value: '', // order number
            span: 3,
            fontSize: templateConfig.font.defaultFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            fontWeight: templateConfig.font.boldFontWeight,
            borderColor: templateConfig.color.blackColor
        },
        // column Q
        null,
        // column R
        null,
    ]

    const metaRow5 = [
        {
            // column A
            value: templateConfig.label.customerNameLabel.toUpperCase(), // customer name label
            span: 6,
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            fontStyle: templateConfig.font.italicFontStyle,
            backgroundColor: templateConfig.color.lightGrayColor,
            borderColor: templateConfig.color.blackColor
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
            value: templateConfig.label.siteNameLabel.toUpperCase(), // site name label
            span: 3,
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            fontStyle: templateConfig.font.italicFontStyle,
            backgroundColor: templateConfig.color.lightGrayColor,
            borderColor: templateConfig.color.blackColor
        },
        // column H
        null,
        // column I
        null,
        {
            // column J
            value: templateConfig.label.purchaseOrderNumberLabel.toUpperCase(), // purchase order number label
            span: 3,
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            fontStyle: templateConfig.font.italicFontStyle,
            backgroundColor: templateConfig.color.lightGrayColor,
            borderColor: templateConfig.color.blackColor
        },
        // column K
        null,
        // column L
        null,
        {
            // column M
            value: templateConfig.label.countryNameLabel.toUpperCase(), // country label
            span: 2,
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            fontStyle: templateConfig.font.italicFontStyle,
            backgroundColor: templateConfig.color.lightGrayColor,
            borderColor: templateConfig.color.blackColor,
        },
        // column N
        null,
        {
            // column O
            value: templateConfig.label.weekEndingDateLabel.toUpperCase(), // week ending date label
            span: 4,
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            fontStyle: templateConfig.font.italicFontStyle,
            backgroundColor: templateConfig.color.lightGrayColor,
            borderColor: templateConfig.color.blackColor,
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
            value: templateConfig.label.dateTitleLabel.toUpperCase(),
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            topBorderStyle: templateConfig.border.thickBorderStyle,
            borderColor: templateConfig.color.blackColor,
            backgroundColor: templateConfig.color.lightGrayColor,
            fontWeight: templateConfig.font.boldFontWeight,
            fontStyle: templateConfig.font.italicFontStyle
        }, {
            // column B
            value: templateConfig.label.workingTimeTitleLabel.toUpperCase(),
            span: 5,
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            topBorderStyle: templateConfig.border.thickBorderStyle,
            borderColor: templateConfig.color.blackColor,
            backgroundColor: templateConfig.color.lightGrayColor,
            fontStyle: templateConfig.font.italicFontStyle
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
            value: templateConfig.label.waitingTimeTitleLabel.toUpperCase(),
            span: 2,
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            topBorderStyle: templateConfig.border.thickBorderStyle,
            borderColor: templateConfig.color.blackColor,
            backgroundColor: templateConfig.color.lightGrayColor,
            fontStyle: templateConfig.font.italicFontStyle
        },
        // column H
        null,
        {
            // column I
            value: templateConfig.label.travelTimeTitleLabel.toUpperCase(),
            span: 2,
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            topBorderStyle: templateConfig.border.thickBorderStyle,
            borderColor: templateConfig.color.blackColor,
            backgroundColor: templateConfig.color.lightGrayColor,
            fontStyle: templateConfig.font.italicFontStyle
        },
        // column J
        null,
        {
            // column K
            value: templateConfig.label.totalHoursTitleLabel.toUpperCase(),
            rowSpan: 2,
            wrap: true,
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            borderColor: templateConfig.color.blackColor,
            topBorderStyle: templateConfig.border.thickBorderStyle,
            backgroundColor: templateConfig.color.lightGrayColor,
            fontStyle: templateConfig.font.italicFontStyle,
            align: templateConfig.align.centerAlign,
        },
        {
            // column L
            value: templateConfig.label.locationTypeIndicatorLabel,
            rowSpan: 2,
            wrap: true,
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            topBorderStyle: templateConfig.border.thickBorderStyle,
            borderColor: templateConfig.color.blackColor,
        },
        {
            // column M
            value: '',
            borderColor: templateConfig.color.blackColor,
            topBorderStyle: templateConfig.border.thickBorderStyle,
        },
        {
            // column N
            value: templateConfig.label.commentTitleLabel.toUpperCase(),
            span: 5,
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            topBorderStyle: templateConfig.border.thickBorderStyle,
            borderColor: templateConfig.color.blackColor,
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
            borderColor: templateConfig.color.blackColor,
        }, {
            // column B
            value: templateConfig.label.periodTitleLabel.toUpperCase(),
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            borderColor: templateConfig.color.blackColor,
            align: templateConfig.align.centerAlign
        },
        {
            // column C
            value: templateConfig.staticValues.workingTimeFirstPeriodTitle,
            type: Number,
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            borderColor: templateConfig.color.blackColor,
            align: templateConfig.align.centerAlign
        }, {
            // column D
            value: templateConfig.staticValues.workingTimeSecondPeriodTitle,
            type: Number,
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            borderColor: templateConfig.color.blackColor,
            align: templateConfig.align.centerAlign
        }, {
            // column E
            value: templateConfig.staticValues.workingTimeThirdPeriodTitle,
            type: Number,
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            borderColor: templateConfig.color.blackColor,
            align: templateConfig.align.centerAlign
        }, {
            // column F
            value: templateConfig.staticValues.workingTimeFourthPeriodTitle,
            type: Number,
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            borderColor: templateConfig.color.blackColor,
            align: templateConfig.align.centerAlign
        },
        {
            // column G
            value: templateConfig.staticValues.waitingTimeFirstPeriodTitle,
            type: Number,
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            borderColor: templateConfig.color.blackColor,
            align: templateConfig.align.centerAlign
        }, {
            // column H
            value: templateConfig.staticValues.waitingTimeSecondPeriodTitle,
            type: Number,
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            borderColor: templateConfig.color.blackColor,
            align: templateConfig.align.centerAlign
        },
        {
            // column I
            value: templateConfig.staticValues.travelTimeFirstPeriodTitle,
            type: Number,
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            borderColor: templateConfig.color.blackColor,
            align: templateConfig.align.centerAlign
        }, {
            // column J
            value: templateConfig.staticValues.travelTimeSecondPeriodTitle,
            type: Number,
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            borderColor: templateConfig.color.blackColor,
            align: templateConfig.align.centerAlign
        },
        // column K
        null,
        // column L
        null,
        {
            // column M
            value: templateConfig.staticValues.locationTypeIndicator,
            borderColor: templateConfig.color.blackColor,
            align: templateConfig.align.centerAlign
        },
        {
            // column N
            value: "",
            span: 5,
            borderColor: templateConfig.color.blackColor,
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
    const timesheetFooterRow1 = [
        {
            // column A
            value: templateConfig.label.personnelSignatureLabel.toUpperCase(),
            span: 4,
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            topBorderStyle: templateConfig.border.thickBorderStyle,
            borderColor: templateConfig.color.blackColor,
            fontStyle: templateConfig.font.italicFontStyle,
            backgroundColor: templateConfig.color.lightGrayColor
        },
        // column B
        null,
        // column C
        null,
        // column D
        null,
        {
            // column E
            value: templateConfig.staticValues.customerVerificationNote.toUpperCase(),
            span: 14,
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            topBorderStyle: templateConfig.border.thickBorderStyle,
            borderColor: templateConfig.color.blackColor,
            fontStyle: templateConfig.font.italicFontStyle,
            backgroundColor: templateConfig.color.lightGrayColor
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

    const timesheetFooterRow2 = [
        {
            // column A
            value: templateConfig.staticValues.signatureAttestationNote.toUpperCase(),
            span: 4,
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            borderColor: templateConfig.color.blackColor,
            fontStyle: templateConfig.font.italicFontStyle,
        },
        // column B
        null,
        // column C
        null,
        // column D
        null,
        {
            // column E
            value: templateConfig.label.customerRepresentativeNameLabel.toUpperCase(),
            span: 4,
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            borderColor: templateConfig.color.blackColor,
            fontStyle: templateConfig.font.italicFontStyle,
            backgroundColor: templateConfig.color.lightGrayColor
        },
        // column F
        null,
        // column G
        null,
        // column H
        null,
        {
            // column I
            value: templateConfig.label.customerRepresentativeTitleLabel.toUpperCase(),
            span: 4,
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            borderColor: templateConfig.color.blackColor,
            fontStyle: templateConfig.font.italicFontStyle,
            backgroundColor: templateConfig.color.lightGrayColor
        },
        // column J
        null,
        // column K
        null,
        // column L
        null,
        {
            // column M
            value: templateConfig.label.customerRepresentativeSignatureLabel.toUpperCase(),
            span: 6,
            align: templateConfig.align.centerAlign,
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            borderColor: templateConfig.color.blackColor,
            fontStyle: templateConfig.font.italicFontStyle,
            backgroundColor: templateConfig.color.lightGrayColor
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

    const timesheetFooterRow3 = [
        {
            // column A
            value: '',
            span: 4,
            rowSpan: 2,
            borderColor: templateConfig.color.blackColor
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
            borderColor: templateConfig.color.blackColor
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
            borderColor: templateConfig.color.blackColor
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
            borderColor: templateConfig.color.blackColor
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

    const timesheetFooterRow5 = [
        {
            // column A
            value: templateConfig.staticValues.defaultAgreementStatement,
            span: 18,
            fontSize: templateConfig.font.smallFontSize,
            fontFamily: templateConfig.font.defaultFontFamily,
            borderColor: templateConfig.color.blackColor,
            fontStyle: templateConfig.font.italicFontStyle,
            backgroundColor: templateConfig.color.lightGrayColor
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
    // empty row
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
                fontSize: templateConfig.font.smallFontSize,
                fontFamily: templateConfig.font.defaultFontFamily,
                fontStyle: templateConfig.font.italicFontStyle,
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