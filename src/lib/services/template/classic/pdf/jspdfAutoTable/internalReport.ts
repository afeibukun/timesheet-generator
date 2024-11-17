import jsPDF from "jspdf";
import autoTable, { ColumnInput, VAlignType } from "jspdf-autotable";
import { LocationType } from "@/lib/constants/constant";
import { defaultLogoBase64, originalDefaultImageDimension } from "@/lib/constants/defaultLogoBase64Image";
import { ExportOptions } from "@/lib/types/timesheet";
import templateConfig from "../../template.config";
import { ClassicTemplate, InternalReportTimesheetCollection, InternalReportTimesheetRecord } from "../../classic";
import { defaultSansProBase64, defaultSansProBoldBase64, defaultSansProBoldItalicBase64, defaultSansProItalicBase64 } from "@/lib/constants/defaultSansProBase64Font";
import { Align, Color, Font, FontSize, FontStyle } from "../../../type";
import { capitalize } from "@/lib/helpers";
import { logoBase64 as templateLogoInBase64 } from "../../asset/logo";

export const createInternalPdfReportWithJsPdfAutoTable = (internalReportTimesheet: InternalReportTimesheetCollection, exportOptions: ExportOptions): void => {
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

    const columnWidthFromExcel = {
        columnA: 9.29,
        columnB: 12.29,
        columnC: 15.29,
        columnD: 9.29,
        columnE: 15.29,
        columnF: 8.43,
        columnG: 9.29,
        columnH: 17.29,
        columnI: 15.29,
        columnJ: 16.29,
        columnK: 7.29,
        columnL: 7.29,
        columnM: 9.29,
        columnN: 0.58,
        columnO: 5.29,
        columnP: 19.29,
        columnQ: 1.29,
    }

    const totalColumnWidth = Object.values(columnWidthFromExcel).reduce((widthAccumulator, width) => {
        return Number(width) + widthAccumulator
    }, 0)

    enum marginInPt { top = 32, left = 24 };

    const mainContentWidthInPt = a4DimensionInPt.width - (2 * marginInPt.left);
    const mainContentWidth = mainContentWidthInPt

    const startingPointXInPt = marginInPt.left
    const finishPointXInPt = a4DimensionInPt.width - marginInPt.left;
    const startingPointYInPt = marginInPt.top

    const startingPointX = startingPointXInPt
    const finishPointX = finishPointXInPt
    const startingPointY = startingPointYInPt

    const defaultFontFamily = 'default_sans_pro'
    /* const fontAwesomeFontFamily = "font-awesome-6-free-solid-900" */
    includeFontInPdf(doc, defaultFontFamily);

    const normalBorderWidth: PdfBorderWidth = 0.5;
    const thickBorderWidth: PdfBorderWidth = 1;

    const signatureCellHeight = 24.84;

    const pngImageFormat = "PNG"
    const logoBase64 = templateLogoInBase64 ? templateLogoInBase64 : defaultLogoBase64;

    const originalImageDimension = logoBase64 ? templateConfig.originalImageDimension : originalDefaultImageDimension;
    const imageDimension = computeImageDimension(originalImageDimension);


    let currentXPosition = startingPointX
    let currentYPosition = startingPointY

    // doc.addImage({ imageData: logoBase64, format: 'PNG', x: currentXPosition, y: currentYPosition, width: imageDimension.width, height: imageDimension.height }) // 90, 32 // width: 120, height: 42.86

    // currentXPosition = finishPointX;
    doc.setFontSize(FontSize.tiny)
    doc.setTextColor('0', `${32 / 255}`, `${96 / 255}`)
    doc.setFont(defaultFontFamily, FontStyle.normal, FontStyle.bold)

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
        { dataKey: 'columnQ' }
    ]

    const getActualCellWidth = (column: keyof typeof columnWidthFromExcel, totalColumnWidth: number, mainContentWidth: number) => {
        return (columnWidthFromExcel[column] / totalColumnWidth) * mainContentWidth
    }

    const generalColumnStyles = {
        columnA: { halign: Align.left, cellWidth: getActualCellWidth('columnA', totalColumnWidth, mainContentWidth) },
        columnB: { halign: Align.left, cellWidth: getActualCellWidth('columnB', totalColumnWidth, mainContentWidth) },
        columnC: { halign: Align.right, cellWidth: getActualCellWidth('columnC', totalColumnWidth, mainContentWidth) },
        columnD: { halign: Align.right, cellWidth: getActualCellWidth('columnD', totalColumnWidth, mainContentWidth) },
        columnE: { halign: Align.right, cellWidth: getActualCellWidth('columnE', totalColumnWidth, mainContentWidth) },
        columnF: { halign: Align.right, cellWidth: getActualCellWidth('columnF', totalColumnWidth, mainContentWidth) },
        columnG: { halign: Align.right, cellWidth: getActualCellWidth('columnG', totalColumnWidth, mainContentWidth) },
        columnH: { halign: Align.right, cellWidth: getActualCellWidth('columnH', totalColumnWidth, mainContentWidth) },
        columnI: { halign: Align.right, cellWidth: getActualCellWidth('columnI', totalColumnWidth, mainContentWidth) },
        columnJ: { halign: Align.right, cellWidth: getActualCellWidth('columnJ', totalColumnWidth, mainContentWidth) },
        columnK: { halign: Align.right, cellWidth: getActualCellWidth('columnK', totalColumnWidth, mainContentWidth) },
        columnL: { halign: Align.right, cellWidth: getActualCellWidth('columnL', totalColumnWidth, mainContentWidth) },
        columnM: { halign: Align.right, cellWidth: getActualCellWidth('columnM', totalColumnWidth, mainContentWidth) },
        columnN: { halign: Align.left, cellWidth: getActualCellWidth('columnN', totalColumnWidth, mainContentWidth) },
        columnO: { halign: Align.left, cellWidth: getActualCellWidth('columnO', totalColumnWidth, mainContentWidth) },
        columnP: { halign: Align.left, cellWidth: getActualCellWidth('columnP', totalColumnWidth, mainContentWidth) },
        // column Q's width is kinda left undefined so it can be auto.
        /* columnQ: { halign: Align.center, cellWidth: getActualCellWidth('columnQ', totalColumnWidth, mainContentWidth) } */

    }

    const allNormalBorder: PdfBorder = { top: normalBorderWidth, left: normalBorderWidth, bottom: normalBorderWidth, right: normalBorderWidth }
    const allThickBorder: PdfBorder = { top: thickBorderWidth, left: thickBorderWidth, bottom: thickBorderWidth, right: thickBorderWidth }

    // currentYPosition += 48;
    const _headerRows = generateHeaderRows(allNormalBorder)
    const _metaRows = generatePdfMetaRows(internalReportTimesheet, allNormalBorder);

    const _entryHeaderRows = generatePdfEntryHeaderRows(allNormalBorder);

    const _entryRows = generateEntryRows(internalReportTimesheet, exportOptions, allNormalBorder);
    const _entryTotalRows = generateTimeEntryTotalRows(internalReportTimesheet.records, allThickBorder, allNormalBorder)

    const _signatureRows = generateSignatureRows(internalReportTimesheet, allNormalBorder, thickBorderWidth, signatureCellHeight)


    const timesheetTemplateBodyRows: PdfTemplateRowItem[][] = [
        ..._headerRows,
        ..._metaRows,
        ..._entryHeaderRows,
        ..._entryRows,
        ..._entryTotalRows,
        ..._signatureRows,
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
            fontSize: FontSize.tiny,
            lineColor: Color.black,
            textColor: Color.black,
            valign: Align.middle as VAlignType,
            cellPadding: { horizontal: 2, vertical: 1.5 }
        },
        didDrawCell: function (data) {
            if ((data.row.index === 0 && data.column.index == 0) && logoBase64) {
                const newImageHeight = data.cell.height - 4
                const newImageWidth = (newImageHeight) * (imageDimension.width / imageDimension.height)
                doc.addImage(
                    logoBase64,
                    'PNG',
                    data.cell.x + 3,
                    data.cell.y + 2,
                    newImageWidth,
                    newImageHeight
                )
            }
        },
    })

    const timesheetMonthWithZeroBasedIndex = internalReportTimesheet.month;
    const timesheetMonthWithUnityBasedIndex = timesheetMonthWithZeroBasedIndex + 1;
    const _timesheetFilename = ClassicTemplate.generateFilename(templateConfig, timesheetMonthWithUnityBasedIndex, internalReportTimesheet.year, internalReportTimesheet.personnel.name, 'Internal_Report');
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

const includeFontInPdf = (doc: any, textFontFamily: string) => {
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

    /* const fontAwesomeFontFamily = iconFontFamily
    doc.addFileToVFS(`${fontAwesomeFontFamily}-normal.ttf`, fontAwesomeSolidBase64String);
    doc.addFont(`${fontAwesomeFontFamily}-normal.ttf`, fontAwesomeFontFamily, 'normal'); */

    // const defaultFontFamily = templateConfig.font.defaultFontFamily
}

const generateHeaderRows = (allNormalBorder: PdfBorder): PdfTemplateRowItem[][] => {
    return [
        // Excel Row 1
        [
            { content: '', colSpan: 2, rowSpan: 2, styles: { lineWidth: { ...allNormalBorder, right: 0 } } },
            { content: templateConfig.label.internalReport.documentHeaderA, colSpan: 3, styles: { fontSize: FontSize.small, fontStyle: FontStyle.bold, halign: Align.left, lineWidth: { ...allNormalBorder, bottom: 0, left: 0 } } },
            { content: templateConfig.label.internalReport.pagination, colSpan: 4, rowSpan: 2, styles: { fontSize: FontSize.small, fontStyle: FontStyle.bold, lineWidth: { ...allNormalBorder, right: 0 }, halign: Align.left, valign: Align.top } },
            { content: templateConfig.label.internalReport.department.toUpperCase(), colSpan: 4, rowSpan: 2, styles: { fontSize: FontSize.small, fontStyle: FontStyle.bold, textColor: Color.tealBlue, lineWidth: { ...allNormalBorder, left: 0 }, halign: Align.left, valign: Align.top } },
            { content: '', rowSpan: 3, styles: { lineWidth: { ...allNormalBorder, bottom: 0 } } },
            { content: templateConfig.label.internalReport.notesTitle.toUpperCase(), colSpan: 2, styles: { fontSize: FontSize.smaller, fontStyle: FontStyle.bold, halign: Align.center, } },
            { content: '', rowSpan: 3, styles: { lineWidth: { ...allNormalBorder, bottom: 0 } } }
        ],
        // Excel Row 2
        [
            { content: templateConfig.label.internalReport.documentHeaderB, colSpan: 3, styles: { fontSize: FontSize.small, fontStyle: FontStyle.bold, lineWidth: { ...allNormalBorder, top: 0, left: 0 }, halign: Align.left } },
            { content: templateConfig.data.internalReport.notes[0], colSpan: 2, styles: { fontSize: FontSize.tiny, fontStyle: FontStyle.bold, lineWidth: { ...allNormalBorder, bottom: 0 }, halign: Align.left } },
        ],
        // Excel Row 3
        [
            { content: templateConfig.label.internalReport.documentTitle + ": " + templateConfig.data.internalReport.documentTitle, colSpan: 4, rowSpan: 2, styles: { fontSize: FontSize.small, fontStyle: FontStyle.bold, halign: Align.left } },
            { content: templateConfig.label.internalReport.documentReference + ": " + templateConfig.data.internalReport.documentReference, colSpan: 3, rowSpan: 2, styles: { fontSize: FontSize.small, fontStyle: FontStyle.bold, lineWidth: { ...allNormalBorder, right: 0 }, halign: Align.left } },
            { content: templateConfig.label.internalReport.costCenter + ": " + templateConfig.data.internalReport.costCenter, colSpan: 2, rowSpan: 2, styles: { fontSize: FontSize.small, fontStyle: FontStyle.bold, lineWidth: { ...allNormalBorder, right: 0, left: 0 }, halign: Align.left } },
            { content: templateConfig.label.internalReport.requisitionNoTitle + ": ", colSpan: 4, rowSpan: 2, styles: { fontSize: FontSize.small, fontStyle: FontStyle.bold, lineWidth: { ...allNormalBorder, left: 0 }, halign: Align.left } },
            { content: templateConfig.data.internalReport.notes[1], colSpan: 2, styles: { fontSize: FontSize.tiny, fontStyle: FontStyle.bold, lineWidth: { ...allNormalBorder, top: 0 } } }

        ],
        // Excel Row 4
        [
            { content: '', styles: { lineWidth: { ...allNormalBorder, top: 0, right: 0, bottom: 0 } } },
            { content: '', colSpan: 2, styles: { lineWidth: { ...allNormalBorder, left: 0, right: 0, bottom: 0 } } },
            { content: '', styles: { lineWidth: { ...allNormalBorder, left: 0, top: 0, bottom: 0 } } }
        ],

    ]
}

const generatePdfMetaRows = (internalReportTimesheet: InternalReportTimesheetCollection, allNormalBorder: PdfBorder): PdfTemplateRowItem[][] => {
    return [
        // Excel Row 5
        [
            { content: capitalize(templateConfig.label.internalReport.orderNumber.toLowerCase()) + ': ', colSpan: 2, styles: { fontSize: FontSize.smaller, fontStyle: FontStyle.bold, halign: Align.right, lineWidth: { ...allNormalBorder, right: 0 } } },
            { content: ClassicTemplate.getOrderNumberForInternalReport(internalReportTimesheet), colSpan: 2, styles: { fontSize: FontSize.smaller, fontStyle: FontStyle.normal, fillColor: Color.lightGray, halign: Align.left, lineWidth: { ...allNormalBorder, left: 0 } } },

            { content: capitalize(templateConfig.label.internalReport.customerName.toLowerCase()) + ': ', styles: { fontSize: FontSize.smaller, fontStyle: FontStyle.bold, halign: Align.right, lineWidth: { ...allNormalBorder, right: 0 } } },
            { content: ClassicTemplate.getCustomerNameForInternalReport(internalReportTimesheet), colSpan: 2, styles: { fontSize: FontSize.smaller, fontStyle: FontStyle.normal, fillColor: Color.lightGray, halign: Align.left, lineWidth: { ...allNormalBorder, left: 0 } } },

            { content: capitalize(templateConfig.label.internalReport.normalWorkHours.toLowerCase()) + ': ', styles: { fontSize: FontSize.smaller, fontStyle: FontStyle.bold, halign: Align.right, lineWidth: { ...allNormalBorder, right: 0 } } },
            { content: '08:00', styles: { fontSize: FontSize.smaller, fontStyle: FontStyle.normal, fillColor: Color.lightGray, halign: Align.left, lineWidth: { ...allNormalBorder, left: 0 } } },

            { content: capitalize(templateConfig.label.internalReport.monthAndYear.toLowerCase()) + ': ', styles: { fontSize: FontSize.smaller, fontStyle: FontStyle.bold, halign: Align.right, lineWidth: { ...allNormalBorder, right: 0 } }, },
            { content: capitalize(`${ClassicTemplate.getMonthLabelForInternalReport(internalReportTimesheet)} / ${internalReportTimesheet.year}`), colSpan: 3, styles: { fontSize: FontSize.smaller, fontStyle: FontStyle.normal, fillColor: Color.lightGray, halign: Align.left, lineWidth: { ...allNormalBorder, left: 0 } } },
            { content: '', colSpan: 4, rowSpan: 3, styles: { lineWidth: { ...allNormalBorder, top: 0, bottom: 0 } } },
        ],
        // Excel Row 6
        [
            { content: capitalize(templateConfig.label.internalReport.personnelName.toLowerCase()) + ': ', colSpan: 2, styles: { fontSize: FontSize.smaller, fontStyle: FontStyle.bold, halign: Align.right, lineWidth: { ...allNormalBorder, right: 0 } } },
            { content: capitalize(internalReportTimesheet.personnel.name.toLowerCase()), colSpan: 2, styles: { fontSize: FontSize.smaller, fontStyle: FontStyle.normal, fillColor: Color.lightGray, halign: Align.left, lineWidth: { ...allNormalBorder, left: 0 } } },

            { content: capitalize(templateConfig.label.internalReport.siteName.toLowerCase()) + ': ', styles: { fontSize: FontSize.smaller, fontStyle: FontStyle.bold, halign: Align.right, lineWidth: { ...allNormalBorder, right: 0 } } },
            { content: ClassicTemplate.getSiteNameForInternalReport(internalReportTimesheet), colSpan: 2, styles: { fontSize: FontSize.smaller, fontStyle: FontStyle.normal, fillColor: Color.lightGray, halign: Align.left, lineWidth: { ...allNormalBorder, left: 0 } } },

            { content: capitalize(templateConfig.label.internalReport.weekEndingDate.toLowerCase()) + ': ', styles: { fontSize: FontSize.smaller, fontStyle: FontStyle.bold, halign: Align.right, lineWidth: { ...allNormalBorder, right: 0 } } },
            { content: '', styles: { fontSize: FontSize.smaller, fontStyle: FontStyle.normal, fillColor: Color.lightGray, halign: Align.left, lineWidth: { ...allNormalBorder, left: 0 } } },

            { content: capitalize(templateConfig.label.internalReport.teamLead.toLowerCase()) + ': ', styles: { fontSize: FontSize.smaller, fontStyle: FontStyle.bold, halign: Align.right, lineWidth: { ...allNormalBorder, right: 0 } } },
            { content: ClassicTemplate.getTeamLeadNameForInternalReport(internalReportTimesheet), colSpan: 3, styles: { fontSize: FontSize.smaller, fontStyle: FontStyle.normal, fillColor: Color.lightGray, halign: Align.left, lineWidth: { ...allNormalBorder, left: 0 } } },
        ],
        // Excel Row 7
        [
            { content: templateConfig.label.internalReport.personnelCode + ': ', colSpan: 2, styles: { fontSize: FontSize.smaller, fontStyle: FontStyle.bold, halign: Align.right, lineWidth: { ...allNormalBorder, right: 0 } } },
            { content: ClassicTemplate.getPersonnelCodeForInternalReport(internalReportTimesheet), colSpan: 2, styles: { fontSize: FontSize.smaller, fillColor: Color.lightGray, halign: Align.left, lineWidth: { ...allNormalBorder, left: 0 } } },

            { content: capitalize(templateConfig.label.internalReport.siteCountry.toLowerCase()) + ': ', styles: { fontSize: FontSize.smaller, fontStyle: FontStyle.bold, halign: Align.right, lineWidth: { ...allNormalBorder, right: 0 } } },
            { content: ClassicTemplate.getSiteCountryForInternalReport(internalReportTimesheet), colSpan: 2, styles: { fontSize: FontSize.smaller, fillColor: Color.lightGray, halign: Align.left, lineWidth: { ...allNormalBorder, left: 0 } } },

            { content: capitalize(templateConfig.label.internalReport.projectDescription.toLowerCase()) + ': ', styles: { fontSize: FontSize.smaller, fontStyle: FontStyle.bold, halign: Align.right, lineWidth: { ...allNormalBorder, right: 0 } } },
            { content: ClassicTemplate.getProjectDescriptionForInternalReport(internalReportTimesheet), colSpan: 2, styles: { fontSize: FontSize.smaller, fillColor: Color.lightGray, halign: Align.left, lineWidth: { ...allNormalBorder, left: 0 } } },

            { content: capitalize(templateConfig.label.internalReport.hardshipLocation.toLowerCase()), colSpan: 3, styles: { fontSize: FontSize.smaller, fontStyle: FontStyle.bold, fillColor: Color.mildGray, textColor: Color.white, halign: Align.center } },
        ],
    ]
}

const generatePdfEntryHeaderRows = (allNormalBorder: PdfBorder): PdfTemplateRowItem[][] => {
    return [
        // Excel Row 8
        [
            { content: capitalize(templateConfig.label.internalReport.dayTitle.toLowerCase()), styles: { fontSize: FontSize.tiny, fontStyle: FontStyle.bold, fillColor: Color.aliceBlue, halign: Align.left } },
            { content: capitalize(templateConfig.label.internalReport.dateTitle.toLowerCase()), styles: { fontSize: FontSize.tiny, fontStyle: FontStyle.bold, fillColor: Color.aliceBlue, halign: Align.left } },
            { content: capitalize(templateConfig.label.internalReport.workingTimeTitle.toLowerCase()), styles: { fontSize: FontSize.tiny, fontStyle: FontStyle.bold, fillColor: Color.aliceBlue, halign: Align.left } },
            { content: capitalize(templateConfig.label.internalReport.travelTimeTitle.toLowerCase()), styles: { fontSize: FontSize.tiny, fontStyle: FontStyle.bold, fillColor: Color.aliceBlue, halign: Align.left } },
            { content: capitalize(templateConfig.label.internalReport.nightShiftTitle.toLowerCase()), styles: { fontSize: FontSize.tiny, fontStyle: FontStyle.bold, fillColor: Color.aliceBlue, halign: Align.left } },
            { content: capitalize(templateConfig.label.internalReport.startTimeTitle.toLowerCase()), styles: { fontSize: FontSize.tiny, fontStyle: FontStyle.bold, fillColor: Color.aliceBlue, halign: Align.left } },
            { content: capitalize(templateConfig.label.internalReport.finishTimeTitle.toLowerCase()), styles: { fontSize: FontSize.tiny, fontStyle: FontStyle.bold, fillColor: Color.aliceBlue, halign: Align.left } },
            { content: capitalize(templateConfig.label.internalReport.totalHoursTitle.toLowerCase()), styles: { fontSize: FontSize.tiny, fontStyle: FontStyle.bold, fillColor: Color.aliceBlue, halign: Align.left } },
            { content: capitalize(templateConfig.label.internalReport.overtimeATitle.toLowerCase()), styles: { fontSize: FontSize.tiny, fontStyle: FontStyle.bold, fillColor: Color.aliceBlue, halign: Align.left } },
            { content: templateConfig.label.internalReport.overtimeBTitle, styles: { fontSize: FontSize.tiny, fontStyle: FontStyle.bold, fillColor: Color.aliceBlue, halign: Align.left } },
            { content: capitalize(templateConfig.label.internalReport.colaTitle.toLowerCase()), styles: { fontSize: FontSize.tiny, fontStyle: FontStyle.bold, fillColor: Color.aliceBlue, halign: Align.left } },
            { content: capitalize(LocationType.onshore.toLowerCase()), styles: { fontSize: FontSize.tiny, fontStyle: FontStyle.bold, fillColor: Color.aliceBlue, halign: Align.left } },
            { content: capitalize(LocationType.offshore.toLowerCase()), styles: { fontSize: FontSize.tiny, fontStyle: FontStyle.bold, fillColor: Color.aliceBlue, halign: Align.left } },

            { content: '', colSpan: 4, styles: { halign: Align.left, lineWidth: { ...allNormalBorder, top: 0, bottom: 0 } } },
        ],
    ]
}

const generateEntryRows = (internalReportTimesheet: InternalReportTimesheetCollection, exportOptions: ExportOptions, allNormalBorder: PdfBorder): PdfTemplateRowItem[][] => {
    // Excel Row 9 - 22
    const _entryRows: PdfTemplateRowItem[][] = internalReportTimesheet.records.map((_record) => {
        let generalFillColor = Color.white
        if (_record.date.monthNumber != internalReportTimesheet.month) {
            generalFillColor = Color.lightGray
        }
        let dateFillColor: Color = generalFillColor
        if (_record.date.dayLabel.toLowerCase() == "sunday") {
            dateFillColor = Color.palePink
        } else if (_record.publicHoliday) {
            dateFillColor = Color.ruddyPink
        }

        let premiumFillColor: Color = Color.white
        if (_record.premium) {
            premiumFillColor = Color.powderBlue
        }

        let _updatedRow: PdfTemplateRowItem[];
        _updatedRow = [
            { content: ClassicTemplate.getDayForInternalReport(_record), styles: { fillColor: generalFillColor } },
            { content: ClassicTemplate.getDayLabelForInternalReport(_record), styles: { fillColor: dateFillColor } },
            { content: _record.workingTime ? _record.workingTime.time : '', styles: { fillColor: generalFillColor } },
            { content: _record.travelTime ? _record.travelTime.time : '', styles: { fillColor: generalFillColor } },
            { content: _record.nightShift ? _record.nightShift.time : '', styles: { fillColor: generalFillColor } },
            { content: _record.startTime ? _record.startTime.time : '', styles: { fillColor: generalFillColor } },
            { content: _record.finishTime ? _record.finishTime.time : '', styles: { fillColor: generalFillColor } },
            { content: _record.totalHours ? _record.totalHours.time : '', styles: { fillColor: generalFillColor } },
            { content: _record.overtime.typeA ? _record.overtime.typeA.time : '', styles: { fillColor: generalFillColor } },
            { content: _record.overtime.typeB ? _record.overtime.typeB.time : '', styles: { fillColor: generalFillColor } },
            { content: _record.hardshipLocation.cola ? 1 : '', styles: { fillColor: generalFillColor } },
            { content: _record.hardshipLocation.onshore ? 1 : '', styles: { fillColor: generalFillColor } },
            { content: _record.hardshipLocation.offshore ? 1 : '', styles: { fillColor: generalFillColor } },
            { content: '', colSpan: 2, styles: { fillColor: premiumFillColor, lineWidth: { ...allNormalBorder, top: 0, bottom: 0, right: 0 } } },
            { content: '', colSpan: 2, styles: { lineWidth: { ...allNormalBorder, top: 0, bottom: 0, left: 0 } } },
        ]

        return _updatedRow

    }, [])
    return _entryRows;
}

const generateTimeEntryTotalRows = (internalReportRecords: InternalReportTimesheetRecord[], allThickBorder: PdfBorder, allNormalBorder: PdfBorder): PdfTemplateRowItem[][] => {
    return [
        // Excel Row 38
        [
            { content: '' },
            { content: templateConfig.label.internalReport.totalTitle, styles: { fontSize: FontSize.smaller, fontStyle: FontStyle.bold } },
            { content: '' },
            { content: '' },
            { content: '' },
            { content: '' },
            { content: '' },
            { content: '' },
            { content: ClassicTemplate.getTotalOvertimeAInInternalReport(internalReportRecords).time, styles: { fontStyle: FontStyle.bold, lineWidth: allThickBorder } },
            { content: ClassicTemplate.getTotalOvertimeBInInternalReport(internalReportRecords).time, styles: { fontStyle: FontStyle.bold, lineWidth: allThickBorder } },
            { content: ClassicTemplate.countTotalColaInInternalReport(internalReportRecords), styles: { fontStyle: FontStyle.bold, lineWidth: allThickBorder } },
            { content: ClassicTemplate.countTotalOnshoreHardshipInInternalReport(internalReportRecords), styles: { fontStyle: FontStyle.bold, lineWidth: allThickBorder } },
            { content: ClassicTemplate.countTotalOffshoreHardshipInInternalReport(internalReportRecords), styles: { fontStyle: FontStyle.bold, lineWidth: allThickBorder } },
            { content: ClassicTemplate.countTotalPremiumDaysInInternalReport(internalReportRecords), colSpan: 2, styles: { fontStyle: FontStyle.bold, lineWidth: { ...allThickBorder, top: 0, bottom: 0, right: 0 }, fillColor: Color.policBlue } },
            { content: '', colSpan: 2, styles: { lineWidth: { ...allNormalBorder, top: 0, bottom: 0, left: 0 } } }

        ]
    ]
}

const generateSignatureRows = (internalReportTimesheet: InternalReportTimesheetCollection, allNormalBorder: PdfBorder, thickBorderWidth: PdfBorderWidth, signatureCellHeight: number): PdfTemplateRowItem[][] => {
    return [
        // Excel Row 40
        [
            { content: templateConfig.label.internalReport.personnelNameAlt + ': ', colSpan: 2, styles: { fontSize: FontSize.small, lineWidth: { ...allNormalBorder, right: 0 } } },
            { content: internalReportTimesheet.personnel.name, colSpan: 4, styles: { fontSize: FontSize.small, lineWidth: { ...allNormalBorder, left: 0, right: 0 }, halign: Align.left } },
            { content: '', styles: { lineWidth: { ...allNormalBorder, left: 0, right: 0 } } },
            { content: templateConfig.label.internalReport.manager + ': ', styles: { fontSize: FontSize.small, lineWidth: { ...allNormalBorder, left: 0, right: 0 }, halign: Align.right } },
            { content: templateConfig.data.internalReport.managerName, colSpan: 3, styles: { fontSize: FontSize.small, lineWidth: { ...allNormalBorder, top: thickBorderWidth, left: 0, right: 0 }, halign: Align.left } },
            { content: '', colSpan: 2, styles: { lineWidth: { ...allNormalBorder, top: thickBorderWidth, left: 0, } } },
            { content: '', colSpan: 4, rowSpan: 2, styles: { lineWidth: { ...allNormalBorder, top: 0 } } },

        ],
        // Excel Row 41
        [
            { content: templateConfig.label.internalReport.signatureAndDate + ": ", colSpan: 2, styles: { fontSize: FontSize.small, lineWidth: { ...allNormalBorder, right: 0 }, minCellHeight: signatureCellHeight } },
            { content: '', colSpan: 4, styles: { fontSize: FontSize.small, lineWidth: { ...allNormalBorder, left: 0, right: 0 } } },
            { content: '', styles: { fontSize: FontSize.small, lineWidth: { ...allNormalBorder, left: 0, right: 0 } } },
            { content: templateConfig.label.internalReport.signatureAndDate + ": ", styles: { fontSize: FontSize.small, lineWidth: { ...allNormalBorder, left: 0, right: 0 }, halign: Align.right } },
            { content: '', colSpan: 3, styles: { lineWidth: { ...allNormalBorder, left: 0, right: 0 } } },
            { content: '', colSpan: 2, styles: { lineWidth: { ...allNormalBorder, left: 0 } } },
        ],
    ]
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
    valign?: any,
    minCellHeight?: any
}

type PdfBorderWidth = number

type PdfBorder = {
    top: PdfBorderWidth,
    left: PdfBorderWidth,
    bottom: PdfBorderWidth,
    right: PdfBorderWidth
}