import jsPDF from "jspdf";
import autoTable, { ColumnInput, VAlignType } from "jspdf-autotable";
import { defaultSansProBase64, defaultSansProItalicBase64, defaultSansProBoldBase64, defaultSansProBoldItalicBase64 } from '../../constants/defaultSansProBase64Font'
import templateConfig from '../../../../main-timesheet-template'
import { TimesheetMeta } from "../timesheet/timesheetMeta";
import { TimesheetEntry } from "../timesheet/timesheetEntry";
import { LocationType, PeriodType } from "@/lib/constants";
import { Timesheet } from "../timesheet/timesheet";
import { defaultLogoBase64, originalDefaultImageDimension } from "@/lib/constants/defaultLogoBase64Image";
import { fontAwesomeSolidBase64String } from "@/lib/constants/fontAwesomeBase64Font";

export const createPdfWithJsPdfAutoTable = (timesheet: Timesheet): void => {
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

    // I bundled a default font with this template to ensure it prints with a familiar font
    const defaultSansFontFamily = 'default_sans_pro'
    doc.addFileToVFS(`${defaultSansFontFamily}-normal.ttf`, defaultSansProBase64);
    doc.addFont(`${defaultSansFontFamily}-normal.ttf`, defaultSansFontFamily, 'normal');

    doc.addFileToVFS(`${defaultSansFontFamily}-italic.ttf`, defaultSansProItalicBase64);
    doc.addFont(`${defaultSansFontFamily}-italic.ttf`, defaultSansFontFamily, 'italic');

    doc.addFileToVFS(`${defaultSansFontFamily}-bold.ttf`, defaultSansProBoldBase64);
    doc.addFont(`${defaultSansFontFamily}-bold.ttf`, defaultSansFontFamily, 'bold');

    doc.addFileToVFS(`${defaultSansFontFamily}-bolditalic.ttf`, defaultSansProBoldItalicBase64);
    doc.addFont(`${defaultSansFontFamily}-bolditalic.ttf`, defaultSansFontFamily, 'bolditalic');

    const fontAwesomeFontFamily = "font-awesome-6-free-solid-900"
    doc.addFileToVFS(`${fontAwesomeFontFamily}-normal.ttf`, fontAwesomeSolidBase64String);
    doc.addFont(`${fontAwesomeFontFamily}-normal.ttf`, fontAwesomeFontFamily, 'normal');

    // const defaultFontFamily = templateConfig.font.defaultFontFamily
    const defaultFontFamily = defaultSansFontFamily

    const normalBorderWidth = 0.5;
    const thickBorderWidth = 1;

    // const smallFontSize = templateConfig.font.small; //default = 8
    const smallFontSize = 6

    // const mediumFontSize = templateConfig.font.default //default = 10
    const fontSizeMedium = 8

    // const largeFontSize = templateConfig.font.large //default = 16
    const fontSizeLarge = 13

    const fontStyleItalic = templateConfig.fontStyle.italic
    const fontStyleBold = templateConfig.fontStyle.bold
    const fontStyleBoldItalic = templateConfig.fontStyle.boldItalic
    const fontStyleNormal = templateConfig.fontStyle.normal

    const colorBlue = templateConfig.color.blue
    const colorBlack = templateConfig.color.black
    const colorLightGray = templateConfig.color.lightGray

    const alignLeft = templateConfig.align.left
    const alignRight = templateConfig.align.right
    const alignMiddle = templateConfig.align.middle
    const alignCenter = templateConfig.align.center

    const signatureCellHeight = 24.84;

    const pngImageFormat = "PNG"
    const isLogoDefinedInTemplateConfig = templateConfig && templateConfig.logoBase64 != undefined && templateConfig.logoBase64 != '' && templateConfig.logoBase64 != null;
    const logoBase64 = isLogoDefinedInTemplateConfig ? templateConfig.logoBase64 : defaultLogoBase64;

    const originalImageDimension = isLogoDefinedInTemplateConfig ? templateConfig.originalImageDimension : originalDefaultImageDimension;
    const imageDimension = computeImageDimension(originalImageDimension);

    let timesheetMeta: TimesheetMeta = timesheet.meta;

    let groupedTimesheet: any = timesheet.timesheetEntryCollectionByWeek
    let weeksInGroupedTimesheet: string[] = Object.keys(groupedTimesheet)

    weeksInGroupedTimesheet.forEach((week, index) => {
        let timesheetEntryCollectionForCurrentWeek = groupedTimesheet[week as any];
        let timesheetDateForLastDayOfCurrentWeek = timesheetEntryCollectionForCurrentWeek![timesheetEntryCollectionForCurrentWeek!.length - 1].date;

        let currentXPosition = startingPointX
        let currentYPosition = startingPointY

        doc.addImage({ imageData: logoBase64, format: 'PNG', x: currentXPosition, y: currentYPosition, width: imageDimension.width, height: imageDimension.height }) // 90, 32 // width: 120, height: 42.86

        currentXPosition = finishPointX;
        doc.setFontSize(smallFontSize)
        doc.setTextColor('0', `${32 / 255}`, `${96 / 255}`)
        doc.setFont(defaultFontFamily, fontStyleNormal, fontStyleBold)
        doc.text(`${templateConfig.label.weekPrefix} ${week}`.toUpperCase(), currentXPosition, currentYPosition + 4, { align: alignRight as any });

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

        let nullEntryDayCounter = 0;

        let checkMarkPlacementCounter = 6;
        let checkMarkRowPlacementArray = timesheetEntryCollectionForCurrentWeek.reduce((checkMarkArray: any[], currentTimesheetEntry: TimesheetEntry) => {
            let updatedCheckMarkArray = [
                ...checkMarkArray,
                { 'rowIndex': checkMarkPlacementCounter, 'hasCheckMark': currentTimesheetEntry.isLocationTypeOnshore }, //Row 1
                { 'rowIndex': checkMarkPlacementCounter + 1, 'hasCheckMark': currentTimesheetEntry.isLocationTypeOffshore }, //Row 2
            ]
            checkMarkPlacementCounter += 2
            return updatedCheckMarkArray
        }, []);

        currentYPosition += 48;

        const timesheetTemplateBodyRows = [
            // Excel Row 3
            [
                { content: templateConfig.label.title.toUpperCase(), colSpan: 4, styles: { fontSize: fontSizeMedium, textColor: colorBlue, fontStyle: fontStyleBold } },
                { content: templateConfig.label.personnelName.toUpperCase(), colSpan: 5, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray } },
                { content: templateConfig.label.mobilizationDate.toUpperCase(), colSpan: 3, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray } },
                { content: templateConfig.label.demobilizationDate.toUpperCase(), colSpan: 3, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray } },
                { content: templateConfig.label.orderNumber.toUpperCase(), colSpan: 3, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray } }
            ],
            // Excel Row 4
            [
                { content: templateConfig.staticValues.defaultTitle.toUpperCase(), colSpan: 4, styles: { fontSize: fontSizeLarge, textColor: colorBlue, fontStyle: fontStyleBold } },
                { content: timesheetMeta.personnelName.toUpperCase(), colSpan: 5, styles: { fontSize: fontSizeMedium, fontStyle: fontStyleBold } },
                { content: timesheetMeta.mobilizationDate.longFormat(), colSpan: 3, styles: { fontSize: fontSizeMedium, fontStyle: fontStyleBold } },
                { content: timesheetMeta.demobilizationDate.longFormat(), colSpan: 3, styles: { fontSize: fontSizeMedium, fontStyle: fontStyleBold } },
                { content: timesheetMeta.orderNumber?.toString(), colSpan: 3, styles: { fontSize: fontSizeMedium, fontStyle: fontStyleBold } }
            ],
            // Excel Row 5
            [
                { content: templateConfig.label.customerName.toUpperCase(), colSpan: 6, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray } },
                { content: templateConfig.label.siteName.toUpperCase(), colSpan: 3, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray } },
                { content: templateConfig.label.purchaseOrderNumber.toUpperCase(), colSpan: 3, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray } },
                { content: templateConfig.label.countryName.toUpperCase(), colSpan: 2, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray } },
                { content: templateConfig.label.weekEndingDate.toUpperCase(), colSpan: 4, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray } }
            ],
            // Excel Row 6
            [
                { content: timesheetMeta.customerName.toUpperCase(), colSpan: 6, styles: { fontSize: fontSizeMedium, fontStyle: fontStyleBold, lineWidth: thickBottomLineWidth } },
                { content: timesheetMeta.siteName.toUpperCase(), colSpan: 3, styles: { fontSize: fontSizeMedium, fontStyle: fontStyleBold, lineWidth: thickBottomLineWidth } },
                { content: timesheetMeta.purchaseOrderNumber, colSpan: 3, styles: { fontSize: fontSizeMedium, fontStyle: fontStyleBold, lineWidth: thickBottomLineWidth } },
                { content: timesheetMeta.siteCountry.toUpperCase(), colSpan: 2, styles: { fontSize: fontSizeMedium, fontStyle: fontStyleBold, lineWidth: thickBottomLineWidth } },
                { content: timesheetDateForLastDayOfCurrentWeek.longFormat(), colSpan: 4, styles: { fontSize: fontSizeMedium, fontStyle: fontStyleBold, lineWidth: thickBottomLineWidth } }
            ],
            // Excel Row 7
            [
                { content: templateConfig.label.dateTitle.toUpperCase(), colSpan: 1, rowSpan: 2, styles: { fontStyle: fontStyleBoldItalic, fillColor: colorLightGray } },
                { content: templateConfig.label.workingTimeTitle.toUpperCase(), colSpan: 5, styles: { halign: alignLeft, fontStyle: fontStyleItalic, fillColor: colorLightGray } },
                { content: templateConfig.label.waitingTimeTitle.toUpperCase(), colSpan: 2, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray } },
                { content: templateConfig.label.travelTimeTitle.toUpperCase(), colSpan: 2, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray } },
                { content: templateConfig.label.totalHoursTitle.toUpperCase(), colSpan: 1, rowSpan: 2, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray } },
                { content: templateConfig.label.locationTypeIndicatorTitle, colSpan: 1, rowSpan: 2, styles: { fontStyle: fontStyleItalic } },
                { content: '\uf00c', colSpan: 1, rowSpan: 2, styles: { halign: alignCenter, font: fontAwesomeFontFamily, fontStyle: fontStyleItalic, fontSize: fontSizeLarge } }, // check mark indicator
                { content: templateConfig.label.commentTitle.toUpperCase(), colSpan: 5, rowSpan: 2, styles: { fontStyle: fontStyleItalic } }
            ],
            // Excel Row 8
            [
                { content: templateConfig.label.periodTitle.toUpperCase(), colSpan: 1, styles: {} },
                { content: templateConfig.staticValues.workingTimeFirstPeriodTitle.toString(), colSpan: 1, styles: {} },
                { content: templateConfig.staticValues.workingTimeSecondPeriodTitle.toString(), colSpan: 1 },
                { content: templateConfig.staticValues.workingTimeThirdPeriodTitle.toString(), colSpan: 1, styles: { halign: alignCenter } },
                { content: templateConfig.staticValues.workingTimeFourthPeriodTitle.toString(), colSpan: 1, styles: { halign: alignCenter } },
                { content: templateConfig.staticValues.waitingTimeFirstPeriodTitle.toString(), colSpan: 1, styles: { halign: alignCenter } },
                { content: templateConfig.staticValues.waitingTimeSecondPeriodTitle.toString(), colSpan: 1, styles: { halign: alignCenter } },
                { content: templateConfig.staticValues.travelTimeFirstPeriodTitle.toString(), colSpan: 1, styles: { halign: alignCenter } },
                { content: templateConfig.staticValues.travelTimeSecondPeriodTitle.toString(), colSpan: 1, styles: { halign: alignCenter } }
            ],
            // Excel Row 9 - 22
            ...timesheetEntryCollectionForCurrentWeek.reduce((timesheetArrayWithPdfFormat: any[], currentTimesheetEntry: TimesheetEntry) => {
                let lineWidthConfig = !currentTimesheetEntry.isNullEntry ? normalLineWidth : zeroLineWidth;
                let firstLineWidthConfig = lineWidthConfig
                if (currentTimesheetEntry.isNullEntry) {
                    nullEntryDayCounter += 1
                    firstLineWidthConfig = nullEntryDayCounter == 1 ? { ...lineWidthConfig, top: normalBorderWidth } : lineWidthConfig;
                }

                return [
                    ...timesheetArrayWithPdfFormat,
                    //Row 1
                    [
                        { content: currentTimesheetEntry.entryDateDayLabel.toUpperCase(), colSpan: 1, styles: { fontStyle: fontStyleBoldItalic, fillColor: colorLightGray, lineWidth: normalLineWidth } /*Col A*/ },
                        { content: !currentTimesheetEntry.isEntryPeriodStartTimeNull ? PeriodType.start.toUpperCase() : '', colSpan: 1, styles: { lineWidth: { ...firstLineWidthConfig, left: normalBorderWidth } } /*Col B*/ },
                        { content: !currentTimesheetEntry.isEntryPeriodStartTimeNull ? currentTimesheetEntry.entryPeriod?.startTime : '', colSpan: 1, styles: { lineWidth: firstLineWidthConfig } /*Col C*/ },
                        { content: '', colSpan: 1, styles: { lineWidth: firstLineWidthConfig } /*Col D*/ },
                        { content: '', colSpan: 1, styles: { lineWidth: firstLineWidthConfig } /*Col E*/ },
                        { content: '', colSpan: 1, styles: { lineWidth: firstLineWidthConfig } /*Col F*/ },
                        { content: '', colSpan: 1, styles: { lineWidth: firstLineWidthConfig } /*Col G*/ },
                        { content: '', colSpan: 1, styles: { lineWidth: firstLineWidthConfig } /*Col H*/ },
                        { content: '', colSpan: 1, styles: { lineWidth: firstLineWidthConfig } /*Col I*/ },
                        { content: '', colSpan: 1, styles: { lineWidth: firstLineWidthConfig } /*Col J*/ },
                        { content: currentTimesheetEntry.isEntryPeriodValid && currentTimesheetEntry.isLocationTypeOnshore ? `${currentTimesheetEntry.totalEntryPeriodHours}:00` : '', colSpan: 1, styles: { lineWidth: firstLineWidthConfig } /*Col K*/ },
                        { content: currentTimesheetEntry.isEntryPeriodValid ? LocationType.onshore.toUpperCase() : '', colSpan: 1, styles: { lineWidth: firstLineWidthConfig } /*Col L*/ },
                        { content: currentTimesheetEntry.isEntryPeriodValid && currentTimesheetEntry.isLocationTypeOnshore ? '\uf00c' : '', colSpan: 1, styles: { halign: alignCenter, font: fontAwesomeFontFamily, lineWidth: firstLineWidthConfig } /*Col M*/ },// the check mark is added elsewhere
                        { content: !currentTimesheetEntry.isCommentNull && currentTimesheetEntry.isLocationTypeOnshore ? currentTimesheetEntry.comment : "", colSpan: 5, styles: { lineWidth: { ...firstLineWidthConfig, right: normalBorderWidth } }/*Col N*/ }
                    ],
                    // Row 2
                    [
                        { content: currentTimesheetEntry.entryDateInDayMonthFormat, colSpan: 1, styles: {} /*Col A*/ },
                        { content: !currentTimesheetEntry.isEntryPeriodFinishTimeNull ? PeriodType.finish.toUpperCase() : '', colSpan: 1, styles: { lineWidth: { ...lineWidthConfig, left: normalBorderWidth } } /*Col B*/ },
                        { content: !currentTimesheetEntry.isEntryPeriodFinishTimeNull ? currentTimesheetEntry.entryPeriod?.finishTime : '', colSpan: 1, styles: { lineWidth: lineWidthConfig } /*Col C*/ },
                        { content: '', colSpan: 1, styles: { lineWidth: lineWidthConfig } /*Col D*/ },
                        { content: '', colSpan: 1, styles: { lineWidth: lineWidthConfig }/*Col E*/ },
                        { content: '', colSpan: 1, styles: { lineWidth: lineWidthConfig } /*Col F*/ },
                        { content: '', colSpan: 1, styles: { lineWidth: lineWidthConfig }/*Col G*/ },
                        { content: '', colSpan: 1, styles: { lineWidth: lineWidthConfig } /*Col H*/ },
                        { content: '', colSpan: 1, styles: { lineWidth: lineWidthConfig }/*Col I*/ },
                        { content: '', colSpan: 1, styles: { lineWidth: lineWidthConfig }/*Col J*/ },
                        { content: currentTimesheetEntry.isEntryPeriodValid && currentTimesheetEntry.isLocationTypeOffshore ? `${currentTimesheetEntry.totalEntryPeriodHours}:00` : '', colSpan: 1, styles: { lineWidth: lineWidthConfig }/*Col K*/ },
                        { content: currentTimesheetEntry.isEntryPeriodValid ? LocationType.offshore.toUpperCase() : '', colSpan: 1, styles: { lineWidth: lineWidthConfig }/*Col L*/ },
                        { content: currentTimesheetEntry.isEntryPeriodValid && currentTimesheetEntry.isLocationTypeOffshore ? '\uf00c' : '', colSpan: 1, styles: { halign: alignCenter, lineWidth: lineWidthConfig } /*Col M*/ }, // the check mark is added elsewhere
                        { content: !currentTimesheetEntry.isCommentNull && currentTimesheetEntry.isLocationTypeOffshore ? currentTimesheetEntry.comment : "", colSpan: 5, styles: { lineWidth: { ...lineWidthConfig, right: normalBorderWidth } } /*Col N*/ }
                    ],
                ]
            }, []),
            // Excel Row 23
            [
                { content: templateConfig.label.personnelSignature.toUpperCase(), colSpan: 4, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray, lineWidth: thickTopLineWidth } },
                { content: templateConfig.label.customerVerificationNote.toUpperCase(), colSpan: 14, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray, lineWidth: thickTopLineWidth } }
            ],
            // Excel Row 24
            [
                { content: templateConfig.staticValues.personnelSignatureCertificationNote.toUpperCase(), colSpan: 4, styles: { fontStyle: fontStyleItalic } },
                { content: templateConfig.label.customerRepresentativeName.toUpperCase(), colSpan: 4, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray } },
                { content: templateConfig.label.customerRepresentativeTitle.toUpperCase(), colSpan: 4, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray } },
                { content: templateConfig.label.customerRepresentativeSignature.toUpperCase(), colSpan: 6, styles: { fontStyle: fontStyleItalic, fillColor: colorLightGray } }
            ],
            // Excel Row 25 and 26
            [
                { content: ' ', colSpan: 4, styles: { minCellHeight: signatureCellHeight } },
                { content: ' ', colSpan: 4, },
                { content: ' ', colSpan: 4, },
                { content: ' ', colSpan: 6, }
            ],
            [
                { content: templateConfig.staticValues.defaultAgreementStatement, colSpan: 18, styles: { fontStyle: fontStyleItalic } }
            ],
            [
                { content: '', colSpan: 18, styles: { lineWidth: onlyTopWidth } }
            ],
            ...templateConfig.footerAddress.map((address) => {
                return [{ content: '', colSpan: 3, styles: { lineWidth: 0 } }, { content: address, colSpan: 15, styles: { lineWidth: 0, halign: alignLeft } }]
            })
        ];

        autoTable(doc, {
            // head: [['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R']],
            columns: columnDefinition,
            columnStyles: generalColumnStyles as any,
            body: timesheetTemplateBodyRows,
            startY: currentYPosition,
            theme: 'grid',
            margin: marginInPt.left,
            styles: {
                font: defaultFontFamily,
                fontSize: smallFontSize,
                lineColor: templateConfig.color.black,
                textColor: templateConfig.color.black,
                valign: templateConfig.align.middle as VAlignType,
                cellPadding: { horizontal: 2, vertical: 1.5 }
            }
        })

        if (index < weeksInGroupedTimesheet.length - 1) {
            doc.addPage();
        }
    });

    const fileNameSuffix = templateConfig.fileNameSuffix == undefined || templateConfig.fileNameSuffix == null || templateConfig.fileNameSuffix == '' || !templateConfig.fileNameSuffix ? '' : `-${templateConfig.fileNameSuffix}`
    const timesheetFileName = `${timesheet.entryCollection[0].date.dateInMonthYearFormat}-Timesheet-${timesheet.meta.personnelName}${fileNameSuffix}`;
    doc.save(`${timesheetFileName}.pdf`);
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