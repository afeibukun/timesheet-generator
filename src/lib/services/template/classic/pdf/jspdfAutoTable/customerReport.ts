import jsPDF from "jspdf";
import autoTable, { ColumnInput, VAlignType } from "jspdf-autotable";
import { DateDisplayExportOption, EntryTypeExportOption, LocationType, PeriodTypeLabel } from "@/lib/constants/constant";
import { defaultLogoBase64, originalDefaultImageDimension } from "@/lib/constants/defaultLogoBase64Image";
import { fontAwesomeSolidBase64String } from "@/lib/constants/fontAwesomeBase64Font";
import { ExportOptions } from "@/lib/types/timesheet";
import { Timesheet } from "@/lib/services/timesheet/timesheet";
import timesheetConfig from "../../../../../../../main-timesheet-template";
import templateConfig from "../../../../../../../main-timesheet-template";
import { TimesheetDate } from "@/lib/services/timesheet/timesheetDate";
import { ClassicTemplate } from "../../classic";
import { defaultSansProBase64, defaultSansProBoldBase64, defaultSansProBoldItalicBase64, defaultSansProItalicBase64 } from "@/lib/constants/defaultSansProBase64Font";
import { TimesheetRecord } from "@/lib/services/timesheet/timesheetRecord";

export const createPdfWithJsPdfAutoTable = (timesheets: Timesheet[], exportOptions: ExportOptions): void => {
    const doc = new jsPDF(
        {
            orientation: "landscape",
            unit: "pt",
            format: "a4",
            hotfixes: ["px_scaling"],
        }
    );

    enum a4DimensionInPt {
        width = 841.89,
        height = 595.28
    }

    enum columnWidthFromExcel {
        columnA = 6.973,
        columnB = 5.472,
        columnC = 3.971,
        columnD = 3.971,
        columnE = 3.971,
        columnF = 3.971,
        columnG = 3.971,
        columnH = 3.971,
        columnI = 3.971,
        columnJ = 3.971,
        columnK = 5.472,
        columnL = 8.475,
        columnM = 2.470,
        columnN = 8.475,
        columnO = 8.475,
        columnP = 6.973,
        columnQ = 6.973,
        columnR = 8.475,
    }

    enum marginInPt { top = 48, left = 64 };

    const mainContentWidthInPt = a4DimensionInPt.width - (2 * marginInPt.left);
    const mainContentWidth = mainContentWidthInPt

    const startingPointXInPt = marginInPt.left
    const finishPointXInPt = a4DimensionInPt.width - marginInPt.left;
    const startingPointYInPt = marginInPt.top

    const startingPointX = startingPointXInPt
    const finishPointX = finishPointXInPt
    const startingPointY = startingPointYInPt

    const defaultFontFamily = 'default_sans_pro'
    const fontAwesomeFontFamily = "font-awesome-6-free-solid-900"
    includeFontInPdf(doc, defaultFontFamily, fontAwesomeFontFamily);

    const normalBorderWidth = 0.5;
    const thickBorderWidth = 1;

    // const smallFontSize = templateConfig.font.small; //default = 8
    const smallFontSize = 6

    // const mediumFontSize = templateConfig.font.default //default = 10
    const fontSizeMedium = 8

    // const largeFontSize = templateConfig.font.large //default = 16
    const fontSizeLarge = 13

    const fontStyleItalic = templateConfig.style.fontStyle.italic
    const fontStyleBold = templateConfig.style.fontStyle.bold
    const fontStyleBoldItalic = templateConfig.style.fontStyle.boldItalic
    const fontStyleNormal = templateConfig.style.fontStyle.normal

    const colorBlue = templateConfig.style.color.blue
    const colorBlack = templateConfig.style.color.black
    const colorLightGray = templateConfig.style.color.lightGray
    const colorWhite = templateConfig.style.color.white

    const alignLeft = templateConfig.style.align.left
    const alignRight = templateConfig.style.align.right
    const alignMiddle = templateConfig.style.align.middle
    const alignCenter = templateConfig.style.align.center

    const signatureCellHeight = 24.84;

    const pngImageFormat = "PNG"
    const isLogoDefinedInTemplateConfig = templateConfig && templateConfig.logoBase64 != undefined && templateConfig.logoBase64 != '' && templateConfig.logoBase64 != null;
    const logoBase64 = isLogoDefinedInTemplateConfig ? templateConfig.logoBase64 : defaultLogoBase64;

    const originalImageDimension = isLogoDefinedInTemplateConfig ? templateConfig.originalImageDimension : originalDefaultImageDimension;
    const imageDimension = computeImageDimension(originalImageDimension);


    timesheets.forEach((_timesheet, index) => {
        const _weekDays = TimesheetDate.getWeekDays(_timesheet.weekEndingDate);

        let currentXPosition = startingPointX
        let currentYPosition = startingPointY

        doc.addImage({ imageData: logoBase64, format: 'PNG', x: currentXPosition, y: currentYPosition, width: imageDimension.width, height: imageDimension.height }) // 90, 32 // width: 120, height: 42.86

        currentXPosition = finishPointX;
        doc.setFontSize(smallFontSize)
        doc.setTextColor('0', `${32 / 255}`, `${96 / 255}`)
        doc.setFont(defaultFontFamily, fontStyleNormal, fontStyleBold)
        doc.text(`${templateConfig.label.customerReport.weekPrefix} ${_timesheet.weekNumber}`.toUpperCase(), currentXPosition, currentYPosition + 4, { align: alignRight as any });

        const columnDefinition: ColumnInput[] = [
            { dataKey: 'columnA' },
            { dataKey: 'columnB' },
            { dataKey: 'columnC' },
            { dataKey: 'columnD' },
            { dataKey: 'columnE' },
            { dataKey: 'columnF' },
            { dataKey: 'columnG' },
            { dataKey: 'columnH' },
            { dataKey: 'columnI' },
            { dataKey: 'columnJ' },
            { dataKey: 'columnK' },
            { dataKey: 'columnL' },
            { dataKey: 'columnM' },
            { dataKey: 'columnN' },
            { dataKey: 'columnO' },
            { dataKey: 'columnP' },
            { dataKey: 'columnQ' },
            { dataKey: 'columnR' }
        ]

        const generalColumnStyles = {
            columnA: { halign: alignLeft, cellWidth: columnWidthFromExcel.columnA * mainContentWidth / 100 },
            columnB: { halign: alignCenter, cellWidth: columnWidthFromExcel.columnB * mainContentWidth / 100 },
            columnC: { halign: alignCenter, cellWidth: columnWidthFromExcel.columnC * mainContentWidth / 100 },
            columnD: { halign: alignCenter, cellWidth: columnWidthFromExcel.columnD * mainContentWidth / 100 },
            columnE: { halign: alignLeft, cellWidth: columnWidthFromExcel.columnE * mainContentWidth / 100 },
            columnF: { halign: alignCenter, cellWidth: columnWidthFromExcel.columnF * mainContentWidth / 100 },
            columnG: { halign: alignLeft, cellWidth: columnWidthFromExcel.columnG * mainContentWidth / 100 },
            columnH: { halign: alignCenter, cellWidth: columnWidthFromExcel.columnH * mainContentWidth / 100 },
            columnI: { halign: alignLeft, cellWidth: columnWidthFromExcel.columnI * mainContentWidth / 100 },
            columnJ: { halign: alignLeft, cellWidth: columnWidthFromExcel.columnJ * mainContentWidth / 100 },
            columnK: { halign: alignCenter, cellWidth: columnWidthFromExcel.columnK * mainContentWidth / 100 },
            columnL: { halign: alignCenter, cellWidth: columnWidthFromExcel.columnL * mainContentWidth / 100 },
            columnM: { halign: alignLeft, cellWidth: columnWidthFromExcel.columnM * mainContentWidth / 100 },
            columnN: { halign: alignLeft, cellWidth: columnWidthFromExcel.columnN * mainContentWidth / 100 },
            columnO: { halign: alignLeft, cellWidth: columnWidthFromExcel.columnO * mainContentWidth / 100 },
            columnP: { halign: alignLeft, cellWidth: columnWidthFromExcel.columnP * mainContentWidth / 100 },
            columnQ: { halign: alignCenter, cellWidth: columnWidthFromExcel.columnQ * mainContentWidth / 100 }
            // column R's width is kinda left undefined so it can be auto.
        }

        const zeroLineWidth = { top: 0, left: 0, bottom: 0, right: 0 };
        const normalLineWidth = { top: normalBorderWidth, left: normalBorderWidth, bottom: normalBorderWidth, right: normalBorderWidth }
        const thickBottomLineWidth = { top: normalBorderWidth, left: normalBorderWidth, bottom: thickBorderWidth, right: normalBorderWidth }
        const thickTopLineWidth = { top: thickBorderWidth, left: normalBorderWidth, bottom: normalBorderWidth, right: normalBorderWidth }
        const onlyTopWidth = { left: 0, right: 0, top: normalBorderWidth, bottom: 0 }

        currentYPosition += 48;
        const _metaRows = generatePdfMetaRows(_timesheet, fontSizeMedium, fontSizeLarge, fontStyleBold, fontStyleItalic, colorBlue, colorLightGray, thickBottomLineWidth);

        const _entryHeaderRows = generatePdfEntryHeaderRows(fontAwesomeFontFamily, fontStyleItalic, fontStyleBoldItalic, fontSizeLarge, colorLightGray, alignLeft, alignCenter);

        const _entryRows = exportOptions.dateDisplay === DateDisplayExportOption.showOnlyDatesWithEntry ? generateEntryRowsAlternate(_timesheet, exportOptions, normalLineWidth, zeroLineWidth, normalBorderWidth, fontAwesomeFontFamily, fontStyleBoldItalic, colorLightGray, alignCenter) : generateEntryRows(_timesheet, _weekDays, exportOptions, normalLineWidth, zeroLineWidth, normalBorderWidth, fontAwesomeFontFamily, fontStyleBoldItalic, colorLightGray, colorWhite, alignCenter);

        const _signatureRows = generateSignatureRows(fontStyleItalic, colorLightGray, thickTopLineWidth, signatureCellHeight)

        const _footerRows = generateFooterRows(alignLeft);

        const timesheetTemplateBodyRows: PdfTemplateRowItem[][] = [
            ..._metaRows,
            ..._entryHeaderRows,
            ..._entryRows,
            ..._signatureRows,
            [{ content: '', colSpan: 18, styles: { lineWidth: onlyTopWidth } }],
            ..._footerRows
        ];

        autoTable(doc, {
            columns: columnDefinition,
            columnStyles: generalColumnStyles as any,
            body: timesheetTemplateBodyRows,
            startY: currentYPosition,
            theme: 'grid',
            margin: marginInPt.left,
            styles: {
                font: defaultFontFamily,
                fontSize: smallFontSize,
                lineColor: templateConfig.style.color.black,
                textColor: templateConfig.style.color.black,
                valign: templateConfig.style.align.middle as VAlignType,
                cellPadding: { horizontal: 2, vertical: 1.5 }
            }
        })

        if (index < timesheets.length - 1) {
            doc.addPage();
        }
    });

    const timesheetMonthWithZeroBasedIndex = timesheets[0].monthNumber;
    const timesheetMonthWithUnityBasedIndex = timesheetMonthWithZeroBasedIndex + 1;
    const _timesheetFilename = ClassicTemplate.generateFilename(templateConfig, timesheetMonthWithUnityBasedIndex, timesheets[0].yearNumber, timesheets[0].personnel.name, 'Customer_Timesheet');
    doc.save(`${_timesheetFilename}.pdf`);
}

const computeImageDimension = (_originalImageDimension: { width: number, height: number }) => {
    const imageAspectRatio = _originalImageDimension.width / _originalImageDimension.height;
    const limitHeight = 32;
    const limitWidth = 128;
    let testHeight = limitHeight;
    let testWidth = testHeight * imageAspectRatio;
    if (testWidth > limitWidth) {
        testWidth = limitWidth
        testHeight = testWidth / imageAspectRatio;
    }
    return { width: testWidth, height: testHeight }
}

const includeFontInPdf = (doc: any, textFontFamily: string, iconFontFamily: string) => {
    // I bundled a default font with this template to ensure it prints with a familiar font
    const defaultSansFontFamily = textFontFamily
    doc.addFileToVFS(`${defaultSansFontFamily}-normal.ttf`, defaultSansProBase64);
    doc.addFont(`${defaultSansFontFamily}-normal.ttf`, defaultSansFontFamily, 'normal');

    doc.addFileToVFS(`${defaultSansFontFamily}-italic.ttf`, defaultSansProItalicBase64);
    doc.addFont(`${defaultSansFontFamily}-italic.ttf`, defaultSansFontFamily, 'italic');

    doc.addFileToVFS(`${defaultSansFontFamily}-bold.ttf`, defaultSansProBoldBase64);
    doc.addFont(`${defaultSansFontFamily}-bold.ttf`, defaultSansFontFamily, 'bold');

    doc.addFileToVFS(`${defaultSansFontFamily}-bolditalic.ttf`, defaultSansProBoldItalicBase64);
    doc.addFont(`${defaultSansFontFamily}-bolditalic.ttf`, defaultSansFontFamily, 'bolditalic');

    const fontAwesomeFontFamily = iconFontFamily
    doc.addFileToVFS(`${fontAwesomeFontFamily}-normal.ttf`, fontAwesomeSolidBase64String);
    doc.addFont(`${fontAwesomeFontFamily}-normal.ttf`, fontAwesomeFontFamily, 'normal');

    // const defaultFontFamily = templateConfig.font.defaultFontFamily
}

const generatePdfMetaRows = (timesheet: Timesheet, fontSizeMedium: number, fontSizeLarge: number, fontStyleBold: string, fontStyleItalic: string, colorBlue: string, colorLightGray: string, thickBottomLineWidth: any): PdfTemplateRowItem[][] => {
    const timesheetDateForLastDayOfCurrentWeek = timesheet.weekEndingDate;
    return [
        // Excel Row 3
        [
            { content: templateConfig.label.customerReport.title.toUpperCase(), colSpan: 4, styles: { fontSize: fontSizeMedium, textColor: colorBlue, fontStyle: fontStyleBold } },
            { content: templateConfig.label.customerReport.personnelName.toUpperCase(), colSpan: 5, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray } },
            { content: templateConfig.label.customerReport.mobilizationDate.toUpperCase(), colSpan: 3, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray } },
            { content: templateConfig.label.customerReport.demobilizationDate.toUpperCase(), colSpan: 3, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray } },
            { content: templateConfig.label.customerReport.orderNumber.toUpperCase(), colSpan: 3, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray } }
        ],
        // Excel Row 4
        [
            { content: templateConfig.data.customerReport.defaultTitle.toUpperCase(), colSpan: 4, styles: { fontSize: fontSizeLarge, textColor: colorBlue, fontStyle: fontStyleBold } },
            { content: timesheet.personnel.name.toUpperCase(), colSpan: 5, styles: { fontSize: fontSizeMedium, fontStyle: fontStyleBold } },
            { content: timesheet.mobilizationDate ? timesheet.mobilizationDate.longFormat() : '', colSpan: 3, styles: { fontSize: fontSizeMedium, fontStyle: fontStyleBold } },
            { content: timesheet.demobilizationDate ? timesheet.demobilizationDate.longFormat() : '', colSpan: 3, styles: { fontSize: fontSizeMedium, fontStyle: fontStyleBold } },
            { content: !!timesheet.project.orderNumber ? timesheet.project.orderNumber.toString() : '', colSpan: 3, styles: { fontSize: fontSizeMedium, fontStyle: fontStyleBold } }
        ],
        // Excel Row 5
        [
            { content: templateConfig.label.customerReport.customerName.toUpperCase(), colSpan: 6, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray } },
            { content: templateConfig.label.customerReport.siteName.toUpperCase(), colSpan: 3, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray } },
            { content: templateConfig.label.customerReport.purchaseOrderNumber.toUpperCase(), colSpan: 3, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray } },
            { content: templateConfig.label.customerReport.countryName.toUpperCase(), colSpan: 2, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray } },
            { content: templateConfig.label.customerReport.weekEndingDate.toUpperCase(), colSpan: 4, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray } }
        ],
        // Excel Row 6
        [
            { content: timesheet.customer.name.toUpperCase(), colSpan: 6, styles: { fontSize: fontSizeMedium, fontStyle: fontStyleBold, lineWidth: thickBottomLineWidth } },
            { content: timesheet.site.name.toUpperCase(), colSpan: 3, styles: { fontSize: fontSizeMedium, fontStyle: fontStyleBold, lineWidth: thickBottomLineWidth } },
            { content: timesheet.project.purchaseOrderNumber, colSpan: 3, styles: { fontSize: fontSizeMedium, fontStyle: fontStyleBold, lineWidth: thickBottomLineWidth } },
            { content: timesheet.site.country.toUpperCase(), colSpan: 2, styles: { fontSize: fontSizeMedium, fontStyle: fontStyleBold, lineWidth: thickBottomLineWidth } },
            { content: timesheetDateForLastDayOfCurrentWeek.longFormat(), colSpan: 4, styles: { fontSize: fontSizeMedium, fontStyle: fontStyleBold, lineWidth: thickBottomLineWidth } }
        ]
    ]
}

const generatePdfEntryHeaderRows = (fontAwesomeFontFamily: string, fontStyleItalic: string, fontStyleBoldItalic: string, fontSizeLarge: number, colorLightGray: string, alignLeft: string, alignCenter: string): PdfTemplateRowItem[][] => {
    return [
        // Excel Row 7
        [
            { content: templateConfig.label.customerReport.dateTitle.toUpperCase(), colSpan: 1, rowSpan: 2, styles: { fontStyle: fontStyleBoldItalic, fillColor: colorLightGray } },
            { content: templateConfig.label.customerReport.workingTimeTitle.toUpperCase(), colSpan: 5, styles: { halign: alignLeft, fontStyle: fontStyleItalic, fillColor: colorLightGray } },
            { content: templateConfig.label.customerReport.waitingTimeTitle.toUpperCase(), colSpan: 2, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray } },
            { content: templateConfig.label.customerReport.travelTimeTitle.toUpperCase(), colSpan: 2, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray } },
            { content: templateConfig.label.customerReport.totalHoursTitle.toUpperCase(), colSpan: 1, rowSpan: 2, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray } },
            { content: templateConfig.label.customerReport.locationTypeIndicatorTitle, colSpan: 1, rowSpan: 2, styles: { fontStyle: fontStyleItalic } },
            { content: '\uf00c', colSpan: 1, rowSpan: 2, styles: { halign: alignCenter, font: fontAwesomeFontFamily, fontStyle: fontStyleItalic, fontSize: fontSizeLarge } }, // check mark indicator
            { content: templateConfig.label.customerReport.commentTitle.toUpperCase(), colSpan: 5, rowSpan: 2, styles: { fontStyle: fontStyleItalic } }
        ],
        // Excel Row 8
        [
            { content: templateConfig.label.customerReport.periodTitle.toUpperCase(), colSpan: 1, styles: {} },
            { content: templateConfig.data.customerReport.workingTimeFirstPeriodTitle.toString(), colSpan: 1, styles: {} },
            { content: templateConfig.data.customerReport.workingTimeSecondPeriodTitle.toString(), colSpan: 1 },
            { content: templateConfig.data.customerReport.workingTimeThirdPeriodTitle.toString(), colSpan: 1, styles: { halign: alignCenter } },
            { content: templateConfig.data.customerReport.workingTimeFourthPeriodTitle.toString(), colSpan: 1, styles: { halign: alignCenter } },
            { content: templateConfig.data.customerReport.waitingTimeFirstPeriodTitle.toString(), colSpan: 1, styles: { halign: alignCenter } },
            { content: templateConfig.data.customerReport.waitingTimeSecondPeriodTitle.toString(), colSpan: 1, styles: { halign: alignCenter } },
            { content: templateConfig.data.customerReport.travelTimeFirstPeriodTitle.toString(), colSpan: 1, styles: { halign: alignCenter } },
            { content: templateConfig.data.customerReport.travelTimeSecondPeriodTitle.toString(), colSpan: 1, styles: { halign: alignCenter } }
        ],
    ]
}

const generateEntryRows = (timesheet: Timesheet, weekDays: TimesheetDate[], exportOptions: ExportOptions, normalLineWidth: PdfLineWidth, zeroLineWidth: PdfLineWidth, normalBorderWidth: number, fontAwesomeFontFamily: string, fontStyleBoldItalic: string, colorLightGray: string, colorWhite: string, alignCenter: string): PdfTemplateRowItem[][] => {
    let counterForInvalidEntries = 0;
    // Excel Row 9 - 22
    const _entryRows = weekDays.reduce((timesheetArrayWithPdfFormat: PdfTemplateRowItem[][], _day: TimesheetDate) => {
        const _timesheetRecord = timesheet.records.filter((_record) => _record.date.date === _day.date)[0];

        let _updatedRow;
        if (_timesheetRecord && ClassicTemplate.isValid(_timesheetRecord, exportOptions)) {
            counterForInvalidEntries = 0; // reset the nu day counter
            const _recordRows = generateFunctionalEntryRow(_timesheetRecord, exportOptions, fontAwesomeFontFamily, fontStyleBoldItalic, colorLightGray, normalLineWidth, normalBorderWidth, alignCenter);
            _updatedRow = [
                ...timesheetArrayWithPdfFormat,
                ..._recordRows
            ]

        } else {
            counterForInvalidEntries += 1
            const isFirstDayOfInvalidEntry = counterForInvalidEntries == 1
            const lineWidthForInvalidEntry = isFirstDayOfInvalidEntry ? { ...zeroLineWidth, top: normalBorderWidth } : zeroLineWidth;

            if (exportOptions.dateDisplay === DateDisplayExportOption.showAllDatesInTimesheet) {
                const _emptyEntryRows = generateEmptyEntryRow(normalLineWidth, zeroLineWidth, lineWidthForInvalidEntry, normalBorderWidth, colorLightGray, colorWhite, _day.dayLabel.toUpperCase(), _day.dateInDayMonthFormat.toUpperCase());
                _updatedRow = [...timesheetArrayWithPdfFormat, ..._emptyEntryRows]

            } else {
                const _emptyEntryRows = generateEmptyEntryRow(normalLineWidth, zeroLineWidth, lineWidthForInvalidEntry, normalBorderWidth, colorLightGray, colorWhite);
                _updatedRow = [...timesheetArrayWithPdfFormat, ..._emptyEntryRows]
            }
        }
        return _updatedRow

    }, [])
    return _entryRows;
}

/**
 * Returns entry rows for the pdf template when only valid dates should be printed
 * @param timesheet 
 * @param normalLineWidth 
 * @param zeroLineWidth 
 * @param normalBorderWidth 
 * @param fontAwesomeFontFamily 
 * @param fontStyleBoldItalic 
 * @param colorLightGray 
 * @param alignCenter 
 * @param exportOptions 
 * @returns 
 */
const generateEntryRowsAlternate = (timesheet: Timesheet, exportOptions: ExportOptions, normalLineWidth: PdfLineWidth, zeroLineWidth: PdfLineWidth, normalBorderWidth: number, fontAwesomeFontFamily: string, fontStyleBoldItalic: string, colorLightGray: string, alignCenter: string) => {
    // Excel Row 9 - 22
    const _entryRows = timesheet.records.reduce((timesheetArrayWithPdfFormat: any[], _record: TimesheetRecord) => {
        let lineWidthConfig = _record && ClassicTemplate.isValid(_record, exportOptions) ? normalLineWidth : zeroLineWidth;
        let firstLineWidthConfig = lineWidthConfig

        if (ClassicTemplate.isValid(_record, exportOptions)) {
            const _recordRows = generateFunctionalEntryRow(_record, exportOptions, fontAwesomeFontFamily, fontStyleBoldItalic, colorLightGray, normalLineWidth, normalBorderWidth, alignCenter);
            return [
                ...timesheetArrayWithPdfFormat,
                ..._recordRows
            ]
        } else {
            return [...timesheetArrayWithPdfFormat]
        }

    }, []);
    return _entryRows;
}

const generateFunctionalEntryRow = (timesheetRecord: TimesheetRecord, exportOptions: ExportOptions, fontAwesomeFontFamily: string, fontStyleBoldItalic: string, colorLightGray: string, normalLineWidth: PdfLineWidth, normalBorderWidth: number, alignCenter: string): PdfTemplateRowItem[][] => {
    // a productive day, with time records, regardless of where
    const canIncludeMultipleTimeType = exportOptions.allowMultipleTimeEntries;

    const canIncludeTravelPeriod = exportOptions.entryTypeDisplay === EntryTypeExportOption.includeTravelTimeInReport || exportOptions.entryTypeDisplay === EntryTypeExportOption.includeTravelAndWaitingTimeInReport;

    const canIncludeWaitingPeriod = exportOptions.entryTypeDisplay === EntryTypeExportOption.includeWaitingTimeInReport || exportOptions.entryTypeDisplay === EntryTypeExportOption.includeTravelAndWaitingTimeInReport;
    const _entryRow: PdfTemplateRowItem[][] = [
        //Row 1
        [
            { content: timesheetRecord.dayLabel.toUpperCase(), colSpan: 1, styles: { fontStyle: fontStyleBoldItalic, fillColor: colorLightGray, lineWidth: normalLineWidth } /*Col A*/ },
            { content: PeriodTypeLabel.start.toUpperCase(), colSpan: 1, styles: { lineWidth: { ...normalLineWidth, left: normalBorderWidth } } /*Col B*/ },
            { content: ClassicTemplate.hasWorkingPeriod1(timesheetRecord) ? ClassicTemplate.workingPeriod1(timesheetRecord).startTime : '', colSpan: 1, styles: { lineWidth: normalLineWidth } /*Col C*/ },
            { content: canIncludeMultipleTimeType && ClassicTemplate.hasWorkingPeriod2(timesheetRecord) ? ClassicTemplate.workingPeriod2(timesheetRecord).startTime : '', colSpan: 1, styles: { lineWidth: normalLineWidth } /*Col D*/ },
            { content: canIncludeMultipleTimeType && ClassicTemplate.hasWorkingPeriod3(timesheetRecord) ? ClassicTemplate.workingPeriod3(timesheetRecord).startTime : '', colSpan: 1, styles: { lineWidth: normalLineWidth } /*Col E*/ },
            { content: canIncludeMultipleTimeType && ClassicTemplate.hasWorkingPeriod4(timesheetRecord) ? ClassicTemplate.workingPeriod4(timesheetRecord).startTime : '', colSpan: 1, styles: { lineWidth: normalLineWidth } /*Col F*/ },
            { content: canIncludeWaitingPeriod && ClassicTemplate.hasWaitingPeriod1(timesheetRecord) ? ClassicTemplate.waitingPeriod1(timesheetRecord).startTime : '', colSpan: 1, styles: { lineWidth: normalLineWidth } /*Col G*/ },
            { content: canIncludeWaitingPeriod && canIncludeMultipleTimeType && ClassicTemplate.hasWaitingPeriod2(timesheetRecord) ? ClassicTemplate.waitingPeriod2(timesheetRecord).startTime : '', colSpan: 1, styles: { lineWidth: normalLineWidth } /*Col H*/ },
            { content: canIncludeTravelPeriod && ClassicTemplate.hasTravelPeriod1(timesheetRecord) ? ClassicTemplate.travelPeriod1(timesheetRecord).startTime : '', colSpan: 1, styles: { lineWidth: normalLineWidth } /*Col I*/ },
            { content: canIncludeTravelPeriod && canIncludeMultipleTimeType && ClassicTemplate.hasTravelPeriod2(timesheetRecord) ? ClassicTemplate.travelPeriod2(timesheetRecord).startTime : '', colSpan: 1, styles: { lineWidth: normalLineWidth } /*Col J*/ },
            { content: timesheetRecord.isLocationTypeOnshore ? `${ClassicTemplate.getTotalHours(timesheetRecord, exportOptions)}` : '', colSpan: 1, styles: { lineWidth: normalLineWidth } /*Col K - total hours */ },
            { content: LocationType.onshore.toUpperCase(), colSpan: 1, styles: { lineWidth: normalLineWidth } /*Col L*/ },
            { content: timesheetRecord.isLocationTypeOnshore ? '\uf00c' : '', colSpan: 1, styles: { halign: alignCenter, font: fontAwesomeFontFamily, lineWidth: normalLineWidth } /*Col M*/ },// the check mark is added elsewhere
            { content: !!timesheetRecord.consolidatedComment && timesheetRecord.isLocationTypeOnshore ? ClassicTemplate.getComment(timesheetRecord, exportOptions) : "", colSpan: 5, styles: { lineWidth: { ...normalLineWidth, right: normalBorderWidth } }/*Col N*/ }
        ],
        // Row 2
        [
            { content: timesheetRecord.dateInDayMonthFormat, colSpan: 1, styles: {} /*Col A*/ },
            { content: PeriodTypeLabel.finish.toUpperCase(), colSpan: 1, styles: { lineWidth: { ...normalLineWidth, left: normalBorderWidth } } /*Col B*/ },
            { content: ClassicTemplate.hasWorkingPeriod1(timesheetRecord) ? ClassicTemplate.workingPeriod1(timesheetRecord).finishTime : '', colSpan: 1, styles: { lineWidth: normalLineWidth } /*Col C*/ },
            { content: canIncludeMultipleTimeType && ClassicTemplate.hasWorkingPeriod2(timesheetRecord) ? ClassicTemplate.workingPeriod2(timesheetRecord).finishTime : '', colSpan: 1, styles: { lineWidth: normalLineWidth } /*Col D*/ },
            { content: canIncludeMultipleTimeType && ClassicTemplate.hasWorkingPeriod3(timesheetRecord) ? ClassicTemplate.workingPeriod3(timesheetRecord).finishTime : '', colSpan: 1, styles: { lineWidth: normalLineWidth } /*Col E*/ },
            { content: canIncludeMultipleTimeType && ClassicTemplate.hasWorkingPeriod4(timesheetRecord) ? ClassicTemplate.workingPeriod4(timesheetRecord).finishTime : '', colSpan: 1, styles: { lineWidth: normalLineWidth } /*Col F*/ },
            { content: canIncludeWaitingPeriod && ClassicTemplate.hasWaitingPeriod1(timesheetRecord) ? ClassicTemplate.waitingPeriod1(timesheetRecord).finishTime : '', colSpan: 1, styles: { lineWidth: normalLineWidth } /*Col G*/ },
            { content: canIncludeWaitingPeriod && canIncludeMultipleTimeType && ClassicTemplate.hasWaitingPeriod2(timesheetRecord) ? ClassicTemplate.waitingPeriod2(timesheetRecord).finishTime : '', colSpan: 1, styles: { lineWidth: normalLineWidth } /*Col H*/ },
            { content: canIncludeTravelPeriod && ClassicTemplate.hasTravelPeriod1(timesheetRecord) ? ClassicTemplate.travelPeriod1(timesheetRecord).finishTime : '', colSpan: 1, styles: { lineWidth: normalLineWidth } /*Col I*/ },
            { content: canIncludeTravelPeriod && canIncludeMultipleTimeType && ClassicTemplate.hasTravelPeriod2(timesheetRecord) ? ClassicTemplate.travelPeriod2(timesheetRecord).finishTime : '', colSpan: 1, styles: { lineWidth: normalLineWidth } /*Col J*/ },
            { content: timesheetRecord.isLocationTypeOffshore ? `${ClassicTemplate.getTotalHours(timesheetRecord, exportOptions)}` : '', colSpan: 1, styles: { lineWidth: normalLineWidth }/*Col K - total hours*/ },
            { content: LocationType.offshore.toUpperCase(), colSpan: 1, styles: { lineWidth: normalLineWidth }/*Col L*/ },
            { content: timesheetRecord.isLocationTypeOffshore ? '\uf00c' : '', colSpan: 1, styles: { halign: alignCenter, lineWidth: normalLineWidth } /*Col M*/ }, // the check mark is added elsewhere
            { content: !!timesheetRecord.consolidatedComment && timesheetRecord.isLocationTypeOffshore ? ClassicTemplate.getComment(timesheetRecord, exportOptions) : "", colSpan: 5, styles: { lineWidth: { ...normalLineWidth, right: normalBorderWidth } } /*Col N*/ }
        ],
    ]
    return _entryRow
}

const generateEmptyEntryRow = (normalLineWidth: PdfLineWidth, zeroLineWidth: PdfLineWidth, lineWidthForInvalidEntry: PdfLineWidth, normalBorderWidth: number, colorLightGray: string, colorWhite: string, dayLabel?: string, dateInMonthYearFormat?: string): PdfTemplateRowItem[][] => {
    const _topEmptyEntryRow = [
        { content: !!dayLabel ? dayLabel : '', colSpan: 1, styles: { lineWidth: !!dayLabel ? normalLineWidth : { ...lineWidthForInvalidEntry, left: normalBorderWidth }, fillColor: !!dayLabel ? colorLightGray : colorWhite, } /*Col A*/ },
        { content: '', colSpan: 1, styles: { lineWidth: !!dayLabel ? { ...lineWidthForInvalidEntry, left: normalBorderWidth } : lineWidthForInvalidEntry } /*Col B*/ },
        { content: '', colSpan: 1, styles: { lineWidth: lineWidthForInvalidEntry } /*Col C*/ },
        { content: '', colSpan: 1, styles: { lineWidth: lineWidthForInvalidEntry } /*Col D*/ },
        { content: '', colSpan: 1, styles: { lineWidth: lineWidthForInvalidEntry } /*Col E*/ },
        { content: '', colSpan: 1, styles: { lineWidth: lineWidthForInvalidEntry } /*Col F*/ },
        { content: '', colSpan: 1, styles: { lineWidth: lineWidthForInvalidEntry } /*Col G*/ },
        { content: '', colSpan: 1, styles: { lineWidth: lineWidthForInvalidEntry } /*Col H*/ },
        { content: '', colSpan: 1, styles: { lineWidth: lineWidthForInvalidEntry } /*Col I*/ },
        { content: '', colSpan: 1, styles: { lineWidth: lineWidthForInvalidEntry } /*Col J*/ },
        { content: '', colSpan: 1, styles: { lineWidth: lineWidthForInvalidEntry } /*Col K*/ },
        { content: '', colSpan: 1, styles: { lineWidth: lineWidthForInvalidEntry } /*Col L*/ },
        { content: '', colSpan: 1, styles: { lineWidth: lineWidthForInvalidEntry } /*Col M*/ },
        { content: '', colSpan: 5, styles: { lineWidth: { ...lineWidthForInvalidEntry, right: normalBorderWidth } }/*Col N*/ }
    ];
    const _bottomEmptyEntryRow = [
        { content: !!dateInMonthYearFormat ? dateInMonthYearFormat : '', colSpan: 1, styles: { lineWidth: !!dateInMonthYearFormat ? normalLineWidth : { ...zeroLineWidth, left: normalBorderWidth } } /*Col A*/ },
        { content: '', colSpan: 1, styles: { lineWidth: !!dateInMonthYearFormat ? { ...zeroLineWidth, left: normalBorderWidth } : zeroLineWidth } /*Col B*/ },
        { content: '', colSpan: 1, styles: { lineWidth: zeroLineWidth } /*Col C*/ },
        { content: '', colSpan: 1, styles: { lineWidth: zeroLineWidth } /*Col D*/ },
        { content: '', colSpan: 1, styles: { lineWidth: zeroLineWidth } /*Col E*/ },
        { content: '', colSpan: 1, styles: { lineWidth: zeroLineWidth } /*Col F*/ },
        { content: '', colSpan: 1, styles: { lineWidth: zeroLineWidth } /*Col G*/ },
        { content: '', colSpan: 1, styles: { lineWidth: zeroLineWidth } /*Col H*/ },
        { content: '', colSpan: 1, styles: { lineWidth: zeroLineWidth } /*Col I*/ },
        { content: '', colSpan: 1, styles: { lineWidth: zeroLineWidth } /*Col J*/ },
        { content: '', colSpan: 1, styles: { lineWidth: zeroLineWidth } /*Col K*/ },
        { content: '', colSpan: 1, styles: { lineWidth: zeroLineWidth } /*Col L*/ },
        { content: '', colSpan: 1, styles: { lineWidth: zeroLineWidth } /*Col M*/ },
        { content: '', colSpan: 5, styles: { lineWidth: { ...zeroLineWidth, right: normalBorderWidth } }/*Col N*/ }
    ];
    return [_topEmptyEntryRow, _bottomEmptyEntryRow];
}

const generateSignatureRows = (fontStyleItalic: string, colorLightGray: string, thickTopLineWidth: PdfLineWidth, signatureCellHeight: number): PdfTemplateRowItem[][] => {
    return [
        // Excel Row 23
        [
            { content: templateConfig.label.customerReport.personnelSignature.toUpperCase(), colSpan: 4, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray, lineWidth: thickTopLineWidth } },
            { content: templateConfig.label.customerReport.customerVerificationNote.toUpperCase(), colSpan: 14, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray, lineWidth: thickTopLineWidth } }
        ],
        // Excel Row 24
        [
            { content: templateConfig.data.customerReport.personnelSignatureCertificationNote.toUpperCase(), colSpan: 4, styles: { fontStyle: fontStyleItalic } },
            { content: templateConfig.label.customerReport.customerRepresentativeName.toUpperCase(), colSpan: 4, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray } },
            { content: templateConfig.label.customerReport.customerRepresentativeTitle.toUpperCase(), colSpan: 4, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray } },
            { content: templateConfig.label.customerReport.customerRepresentativeSignature.toUpperCase(), colSpan: 6, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray } }
        ],
        // Excel Row 25 and 26
        [
            { content: ' ', colSpan: 4, styles: { minCellHeight: signatureCellHeight } },
            { content: ' ', colSpan: 4, },
            { content: ' ', colSpan: 4, },
            { content: ' ', colSpan: 6, }
        ],
        [
            { content: templateConfig.data.customerReport.defaultAgreementStatement, colSpan: 18, styles: { fontStyle: fontStyleItalic } }
        ]
    ]
}

const generateFooterRows = (alignLeft: string): PdfTemplateRowItem[][] => {
    const _footerRows = templateConfig.data.customerReport.footerAddress.map((address) => {
        return [{ content: '', colSpan: 3, styles: { lineWidth: 0 } }, { content: address, colSpan: 15, styles: { lineWidth: 0, halign: alignLeft } }]
    })
    return _footerRows;
}

type PdfTemplateRowItem = {
    content: any,
    colSpan?: number,
    rowSpan?: number,
    styles?: PdfTemplateStyle,
}

type PdfTemplateStyle = {
    font?: any,
    fontSize?: any,
    textColor?: any,
    fontStyle?: any,
    fillColor?: any,
    lineWidth?: any,
    halign?: any,
    minCellHeight?: any
}

type PdfLineWidth = {
    top: number,
    left: number,
    bottom: number,
    right: number
}