import { LocationType, PeriodTypeLabel, EntryTypeExportOption, DateDisplayExportOption } from '@/lib/constants/constant';
import { saveAs } from 'file-saver';
import { ExportOptions } from '@/lib/types/timesheet';
import templateConfig from '../../template.config';
import { ClassicTemplate, InternalReportTimesheetCollection, InternalReportTimesheetRecord } from '../../classic';
import { capitalize, titleize } from '@/lib/helpers';
import { Align, Border, BorderStyle, Color, FillPattern, FillType, Font, FontSize } from '../../../type';

export const createXlsxClassicInternalTimesheetReport = async (internalReportTimesheet: InternalReportTimesheetCollection, exportOptions: ExportOptions) => {
    try {
        if (!internalReportTimesheet.records || !Array.isArray(internalReportTimesheet.records) || internalReportTimesheet.records.length < 1) {
            throw new Error("Invalid Timesheet Records for Internal Report")
        }

        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        workbook.creator = `TGApp - ${internalReportTimesheet.personnel.name}`;
        workbook.lastModifiedBy = `TG App - ${internalReportTimesheet.personnel.name}`;
        workbook.created = new Date();
        workbook.modified = new Date();

        const orientationLandscape = 'landscape'

        const imageExtensionPng = 'png';

        const fontDefault: Font = templateConfig.style.font.default;

        const borderAllEmpty: Border = {
            top: { style: BorderStyle.none },
            left: { style: BorderStyle.none },
            bottom: { style: BorderStyle.none },
            right: { style: BorderStyle.none }
        }

        const borderAllThin = {
            top: { style: BorderStyle.thin },
            left: { style: BorderStyle.thin },
            bottom: { style: BorderStyle.thin },
            right: { style: BorderStyle.thin }
        }
        const borderAllThick = {
            top: { style: BorderStyle.thick },
            left: { style: BorderStyle.thick },
            bottom: { style: BorderStyle.thick },
            right: { style: BorderStyle.thick }
        }
        const borderVerticalThin: Border = {
            top: { style: BorderStyle.thin },
            left: { style: BorderStyle.none },
            bottom: { style: BorderStyle.thin },
            right: { style: BorderStyle.none }
        }

        const borderThickBottom = {
            top: { style: BorderStyle.thin },
            left: { style: BorderStyle.thin },
            bottom: { style: BorderStyle.thick },
            right: { style: BorderStyle.thin }
        }

        const borderThickTop = {
            top: { style: BorderStyle.thick },
            left: { style: BorderStyle.thin },
            bottom: { style: BorderStyle.thin },
            right: { style: BorderStyle.thin }
        }

        let sheetCollection = ['Sheet 1'];

        const worksheet = workbook.addWorksheet(sheetCollection[0], {
            pageSetup: { paperSize: 9, orientation: orientationLandscape, fitToPage: true, margins: { left: 0.7, right: 0.7, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 } }
        });

        worksheet.columns = internalTimesheetColumns();
        // Row 1 - 4
        headerRowData(workbook, imageExtensionPng, worksheet);
        headerRowMerge(worksheet);
        headerRowStyle(worksheet, fontDefault, borderVerticalThin, borderAllThin, borderAllEmpty);


        // Row 5 - 7
        const timesheetMetaRowsData = metaSectionData(internalReportTimesheet)
        worksheet.addRows(timesheetMetaRowsData);
        metaSectionMerges(worksheet);
        metaSectionStyles(worksheet, borderVerticalThin, borderAllThin, borderAllEmpty, fontDefault);

        // Row 8 Data
        const timeEntryHeaderRowsData = timeEntryHeaderRowData();
        worksheet.addRows(timeEntryHeaderRowsData);
        timeEntryHeaderRowStyles(worksheet, borderAllThin, borderAllEmpty, fontDefault);

        // Row 9 to 40 something - Data
        let coreEntryStartRow = 9;
        let coreTimesheetEntryRows: InternalTimesheetExcelTemplateRow[] = timeEntrySectionDataRows(internalReportTimesheet.records);
        let lengthOfCoreTimesheetEntry = coreTimesheetEntryRows.length;
        worksheet.addRows(coreTimesheetEntryRows);
        timeEntrySectionMerges(worksheet, internalReportTimesheet.records, coreEntryStartRow);
        timeEntrySectionStyles(worksheet, internalReportTimesheet, exportOptions, fontDefault, borderAllThin, borderAllEmpty);

        const totalStartRow = coreEntryStartRow + lengthOfCoreTimesheetEntry;
        const timeEntryTotalRows = timeEntryTotalSectionData(internalReportTimesheet.records);
        worksheet.addRows(timeEntryTotalRows);
        timeEntryTotalSectionMerges(worksheet, totalStartRow)
        timeEntryTotalSectionStyles(worksheet, totalStartRow, borderAllThin, borderAllThick, borderAllEmpty, fontDefault)

        const signatureStartRow = totalStartRow + 1;
        const timesheetSignatureRows = timesheetSignatureSectionData(internalReportTimesheet);
        worksheet.addRows(timesheetSignatureRows);
        timesheetSignatureSectionMerges(worksheet, signatureStartRow);
        timesheetSignatureSectionStyle(worksheet, signatureStartRow, borderVerticalThin, borderAllEmpty, fontDefault,);
        const lengthOfSignatureRows = 5;



        const timesheetMonthWithZeroBasedIndex = internalReportTimesheet.month;
        const timesheetMonthWithUnityBasedIndex = timesheetMonthWithZeroBasedIndex + 1;
        const _timesheetFilename = ClassicTemplate.generateFilename(templateConfig, timesheetMonthWithUnityBasedIndex, internalReportTimesheet.year, internalReportTimesheet.personnel.name, 'Internal_Report');
        const xlsxBuffer = workbook.xlsx.writeBuffer();
        xlsxBuffer.then((data: any) => {
            var blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(blob, _timesheetFilename);
        });
    } catch (err) {
        console.log(err)
    }
}

const headerRowData = (workbook: any, imageExtensionPng: any, worksheet: any) => {
    const _startRow = 1

    const logoBase64 = templateConfig.logoBase64

    const logoId = workbook.addImage({
        base64: logoBase64,
        extension: imageExtensionPng,
    });
    worksheet.addImage(logoId, {
        tl: { col: 0.4, row: 0.1 },
        ext: { width: 100, height: 35.72 } // in pixels 96DPI (120 x 42.86)
    });

    let _cursorRow: number = _startRow
    let _cursorColumn: string = 'C'
    // first row (1)
    const documentHeaderLabelCell = worksheet.getCell(`${_cursorColumn}${_cursorRow}`);
    documentHeaderLabelCell.value = templateConfig.label.internalReport.documentHeaderA

    _cursorColumn = 'F'
    const documentPageLabelCell = worksheet.getCell(`${_cursorColumn}${_cursorRow}`);
    documentPageLabelCell.value = templateConfig.label.internalReport.pagination

    _cursorColumn = 'J'
    const departmentLabelCell = worksheet.getCell(`${_cursorColumn}${_cursorRow}`);
    departmentLabelCell.value = templateConfig.label.internalReport.department.toUpperCase();

    _cursorColumn = 'O'
    const notesLabelCell = worksheet.getCell(`${_cursorColumn}${_cursorRow}`);
    notesLabelCell.value = templateConfig.label.internalReport.notesTitle.toUpperCase();

    // Second Row (2)
    _cursorRow += 1
    _cursorColumn = 'C'
    const documentHeaderValueCell = worksheet.getCell(`${_cursorColumn}${_cursorRow}`);
    documentHeaderValueCell.value = templateConfig.label.internalReport.documentHeaderB

    _cursorColumn = 'O'
    const notesValue1Cell = worksheet.getCell(`${_cursorColumn}${_cursorRow}`);
    notesValue1Cell.value = templateConfig.data.internalReport.notes[0]

    const titleRows: InternalTimesheetExcelTemplateRow[] = [
        // Row 3 - 4: DATA
        {
            column_a: templateConfig.label.internalReport.documentTitle + ": " + templateConfig.data.internalReport.documentTitle,
            column_e: templateConfig.label.internalReport.documentReference + ": " + templateConfig.data.internalReport.documentReference,
            column_h: templateConfig.label.internalReport.costCenter + ': ' + templateConfig.data.internalReport.costCenter,
            column_j: templateConfig.label.internalReport.requisitionNoTitle + ': ', //include requisition detail if available
            column_o: templateConfig.data.internalReport.notes[1],
        }
    ];
    worksheet.addRows(titleRows);
}
const headerRowMerge = (worksheet: any) => {
    // Row 1 - MERGES
    worksheet.mergeCells('A1:B2')
    worksheet.mergeCells('C1:E1')
    worksheet.mergeCells('F1:I2')
    worksheet.mergeCells('J1:M2')
    worksheet.mergeCells('O1:P1')

    worksheet.mergeCells('C2:E2')
    worksheet.mergeCells('O2:P2')

    worksheet.mergeCells('A3:D4')
    worksheet.mergeCells('E3:G4')
    worksheet.mergeCells('H3:I4')
    worksheet.mergeCells('J3:M4')

    worksheet.mergeCells('O3:P3')
}
const headerRowStyle = (worksheet: any, fontDefault: Font, borderVerticalThin: Border, borderAllThin: Border, borderAllEmpty: Border) => {
    let _row = 1
    // Row 1 - STYLES
    worksheet.getRow(_row).eachCell({ includeEmpty: true }, (cell: any, colNumber: any) => {
        cell.border = { ...borderVerticalThin, bottom: { style: BorderStyle.thin } }
        cell.font = {
            name: fontDefault,
            family: 2,
            italic: false,
            bold: true,
            size: FontSize.medium
        }
        cell.fill = {
            type: FillType.pattern,
            pattern: FillPattern.solid,
            fgColor: { argb: Color.whiteARGB }
        }
    })
    worksheet.getCell(`A${_row}`).border = { ...borderVerticalThin, left: { style: BorderStyle.thin } }
    worksheet.getCell(`C${_row}`).border = { ...borderVerticalThin, right: { style: BorderStyle.thin }, bottom: { style: '' } }
    worksheet.getCell(`F${_row}`).alignment = { vertical: Align.top, horizontal: Align.left }

    worksheet.getCell(`J${_row}`).font = { color: { argb: Color.tealBlueARGB }, name: fontDefault, size: FontSize.medium, bold: true }
    worksheet.getCell(`J${_row}`).border = { ...borderVerticalThin, right: { style: BorderStyle.thin } }
    worksheet.getCell(`J${_row}`).alignment = { vertical: Align.top, horizontal: Align.left }

    worksheet.getCell(`N${_row}`).border = { ...borderAllThin, bottom: { style: '' } }
    worksheet.getCell(`O${_row}`).border = borderAllThin
    worksheet.getCell(`O${_row}`).alignment = { vertical: Align.middle, horizontal: Align.center }
    worksheet.getCell(`Q${_row}`).border = { ...borderVerticalThin, bottom: { style: '' }, right: { style: BorderStyle.thin } }

    // Row 2
    _row += 1
    worksheet.getCell(`C${_row}`).font = { name: fontDefault, size: FontSize.medium, bold: true }
    worksheet.getCell(`C${_row}`).border = { ...borderVerticalThin, top: { style: '' }, right: { style: BorderStyle.thin } }
    worksheet.getCell(`O${_row}`).font = { name: fontDefault, size: FontSize.nine, bold: true }
    worksheet.getCell(`O${_row}`).border = { ...borderAllThin, bottom: { style: '' } }
    worksheet.getCell(`Q${_row}`).border = { ...borderAllEmpty, right: { style: BorderStyle.thin } }
    // row 3
    _row += 1
    worksheet.getRow(_row).eachCell({ includeEmpty: true }, (cell: any, colNumber: any) => {
        cell.font = {
            name: fontDefault,
            family: 2,
            italic: false,
            bold: true,
            size: FontSize.medium
        }
        cell.fill = {
            type: FillType.pattern,
            pattern: FillPattern.solid,
            fgColor: { argb: Color.whiteARGB }
        }
        cell.alignment = { vertical: Align.middle, horizontal: Align.left }
    })
    worksheet.getCell('A3').border = { ...borderVerticalThin, left: { style: BorderStyle.thin } }
    worksheet.getCell('E3').border = { ...borderVerticalThin, left: { style: BorderStyle.thin } }
    worksheet.getCell('H3').border = borderVerticalThin
    worksheet.getCell('J3').border = { ...borderVerticalThin, right: { style: BorderStyle.thin } }
    worksheet.getCell('O3').font = { name: fontDefault, size: FontSize.nine, bold: true }
    worksheet.getCell('O3').border = { ...borderAllThin, top: { style: '' } }
    worksheet.getCell('Q3').border = { ...borderAllEmpty, right: { style: BorderStyle.thin } }
    worksheet.getCell('Q4').border = { ...borderAllEmpty, right: { style: BorderStyle.thin } }
}

const metaSectionData = (internalReportTimesheet: InternalReportTimesheetCollection) => {
    try {
        // Row 5 - 7 Data
        const timesheetMetaRows = [
            { // Row 5 - DATA
                column_a: capitalize(templateConfig.label.internalReport.orderNumber.toLowerCase()) + ': ',
                column_c: ClassicTemplate.getOrderNumberForInternalReport(internalReportTimesheet),
                column_e: capitalize(templateConfig.label.internalReport.customerName.toLowerCase()) + ': ',
                column_f: ClassicTemplate.getCustomerNameForInternalReport(internalReportTimesheet), // customer
                column_h: capitalize(templateConfig.label.internalReport.normalWorkHours.toLowerCase()) + ': ',
                column_i: "08:00",
                column_j: capitalize(templateConfig.label.internalReport.monthAndYear.toLowerCase()) + ': ',
                column_k: capitalize(`${ClassicTemplate.getMonthLabelForInternalReport(internalReportTimesheet)} / ${internalReportTimesheet.year}`),
            },
            { // Row 6 - DATA
                column_a: capitalize(templateConfig.label.internalReport.personnelName.toLowerCase()) + ': ',
                column_c: capitalize(internalReportTimesheet.personnel.name.toLowerCase()),
                column_e: capitalize(templateConfig.label.internalReport.siteName.toLowerCase()) + ': ',
                column_f: ClassicTemplate.getSiteNameForInternalReport(internalReportTimesheet),
                column_h: capitalize(templateConfig.label.internalReport.weekEndingDate.toLowerCase()) + ': ',
                column_i: '',
                column_j: capitalize(templateConfig.label.internalReport.teamLead.toLowerCase()) + ': ',
                column_k: ClassicTemplate.getTeamLeadNameForInternalReport(internalReportTimesheet)
            },
            { // Row 7 - DATA
                column_a: templateConfig.label.internalReport.personnelCode + ': ',
                column_c: ClassicTemplate.getPersonnelCodeForInternalReport(internalReportTimesheet),
                column_e: capitalize(templateConfig.label.internalReport.siteCountry.toLowerCase()) + ': ',
                column_f: ClassicTemplate.getSiteCountryForInternalReport(internalReportTimesheet),
                column_h: capitalize(templateConfig.label.internalReport.projectDescription.toLowerCase()) + ': ',
                column_i: ClassicTemplate.getProjectDescriptionForInternalReport(internalReportTimesheet),
                column_k: capitalize(templateConfig.label.internalReport.hardshipLocation.toLowerCase()),
            },
        ];
        return timesheetMetaRows;
    } catch (err) {
        console.log(err)
    }
}
const metaSectionMerges = (worksheet: any) => {
    // Row 5 to 7 MERGES
    worksheet.mergeCells('A5:B5');
    worksheet.mergeCells('C5:D5');
    worksheet.mergeCells('F5:G5');
    worksheet.mergeCells('K5:M5');

    worksheet.mergeCells('A6:B6');
    worksheet.mergeCells('C6:D6');
    worksheet.mergeCells('F6:G6');
    worksheet.mergeCells('K6:M6');

    worksheet.mergeCells('A7:B7');
    worksheet.mergeCells('C7:D7');
    worksheet.mergeCells('F7:G7');
    worksheet.mergeCells('I7:J7');
    worksheet.mergeCells('K7:M7');
}
const metaSectionStyles = (worksheet: any, borderVerticalThin: Border, borderAllThin: Border, borderAllEmpty: Border, fontDefault: Font) => {
    const metaFontNotBold = { name: fontDefault, family: 2, italic: false, size: FontSize.nine, bold: false }
    const metaFontBold = { name: fontDefault, family: 2, italic: false, size: FontSize.nine, bold: true }
    const metaValueFillLightGray = { type: FillType.pattern, pattern: FillPattern.solid, fgColor: { argb: Color.lightGrayARGB } }
    const metaKeyAlignmentMiddleRight = { horizontal: Align.right, vertical: Align.middle }
    const metaValueAlignmentMiddleLeft = { horizontal: Align.left, vertical: Align.middle }
    // Row 5 STYLES
    worksheet.getRow(5).eachCell({ includeEmpty: true }, (cell: any, colNumber: any) => {
        cell.border = borderVerticalThin
        cell.font = metaFontBold
    })
    worksheet.getCell('A5').border = { ...borderVerticalThin, left: { style: BorderStyle.thin } }
    worksheet.getCell('A5').alignment = metaKeyAlignmentMiddleRight

    worksheet.getCell('C5').fill = metaValueFillLightGray
    worksheet.getCell('C5').font = metaFontNotBold
    worksheet.getCell('C5').border = { ...borderVerticalThin, right: { style: BorderStyle.thin } }
    worksheet.getCell('C5').alignment = metaValueAlignmentMiddleLeft

    worksheet.getCell('E5').border = { ...borderVerticalThin, left: { style: BorderStyle.thin } }
    worksheet.getCell('E5').alignment = metaKeyAlignmentMiddleRight

    worksheet.getCell('F5').font = metaFontNotBold
    worksheet.getCell('F5').fill = metaValueFillLightGray
    worksheet.getCell('F5').border = { ...borderVerticalThin, right: { style: BorderStyle.thin } }
    worksheet.getCell('F5').alignment = metaValueAlignmentMiddleLeft

    worksheet.getCell('H5').border = { ...borderVerticalThin, left: { style: BorderStyle.thin } }
    worksheet.getCell('H5').alignment = metaKeyAlignmentMiddleRight

    worksheet.getCell('I5').font = metaFontNotBold
    worksheet.getCell('I5').fill = metaValueFillLightGray
    worksheet.getCell('I5').border = { ...borderVerticalThin, right: { style: BorderStyle.thin } }
    worksheet.getCell('I5').alignment = metaValueAlignmentMiddleLeft

    worksheet.getCell('J5').border = { ...borderVerticalThin, left: { style: BorderStyle.thin } }
    worksheet.getCell('J5').alignment = metaKeyAlignmentMiddleRight

    worksheet.getCell('K5').font = metaFontNotBold
    worksheet.getCell('K5').fill = metaValueFillLightGray
    worksheet.getCell('K5').border = { ...borderVerticalThin, right: { style: BorderStyle.thin } }
    worksheet.getCell('K5').alignment = metaValueAlignmentMiddleLeft
    worksheet.getCell('Q5').border = { ...borderAllEmpty, right: { style: BorderStyle.thin } }

    // Row 6 STYLES
    worksheet.getRow(6).eachCell({ includeEmpty: true }, (cell: any, colNumber: any) => {
        cell.border = borderVerticalThin
        cell.font = metaFontBold
    })
    worksheet.getCell('A6').border = { ...borderVerticalThin, left: { style: BorderStyle.thin } }
    worksheet.getCell('A6').alignment = metaKeyAlignmentMiddleRight

    worksheet.getCell('C6').font = metaFontNotBold
    worksheet.getCell('C6').fill = metaValueFillLightGray
    worksheet.getCell('C6').border = { ...borderVerticalThin, right: { style: BorderStyle.thin } }
    worksheet.getCell('C6').alignment = metaValueAlignmentMiddleLeft

    worksheet.getCell('E6').border = { ...borderVerticalThin, left: { style: BorderStyle.thin } }
    worksheet.getCell('E6').alignment = metaKeyAlignmentMiddleRight

    worksheet.getCell('F6').font = metaFontNotBold
    worksheet.getCell('F6').fill = metaValueFillLightGray
    worksheet.getCell('F6').border = { ...borderVerticalThin, right: { style: BorderStyle.thin } }
    worksheet.getCell('F6').alignment = metaValueAlignmentMiddleLeft

    worksheet.getCell('H6').border = { ...borderVerticalThin, left: { style: BorderStyle.thin } }
    worksheet.getCell('H6').alignment = metaKeyAlignmentMiddleRight

    worksheet.getCell('I6').font = metaFontNotBold
    worksheet.getCell('I6').fill = metaValueFillLightGray
    worksheet.getCell('I6').border = { ...borderVerticalThin, right: { style: BorderStyle.thin } }
    worksheet.getCell('I6').alignment = metaValueAlignmentMiddleLeft

    worksheet.getCell('J6').border = { ...borderVerticalThin, left: { style: BorderStyle.thin } }
    worksheet.getCell('J6').alignment = metaKeyAlignmentMiddleRight

    worksheet.getCell('K6').font = metaFontNotBold
    worksheet.getCell('K6').fill = metaValueFillLightGray
    worksheet.getCell('K6').border = { ...borderVerticalThin, right: { style: BorderStyle.thin } }
    worksheet.getCell('K6').alignment = metaValueAlignmentMiddleLeft
    worksheet.getCell('Q6').border = { ...borderAllEmpty, right: { style: BorderStyle.thin } }

    // Row 7 STYLES
    worksheet.getRow(7).eachCell({ includeEmpty: true }, (cell: any, colNumber: any) => {
        cell.border = borderVerticalThin
        cell.font = metaFontBold
    })
    worksheet.getCell('A7').border = { ...borderVerticalThin, left: { style: BorderStyle.thin } }
    worksheet.getCell('A7').alignment = metaKeyAlignmentMiddleRight

    worksheet.getCell('C7').font = metaFontNotBold
    worksheet.getCell('C7').fill = metaValueFillLightGray
    worksheet.getCell('C7').border = { ...borderVerticalThin, right: { style: BorderStyle.thin } }
    worksheet.getCell('C7').alignment = metaValueAlignmentMiddleLeft

    worksheet.getCell('E7').border = { ...borderVerticalThin, left: { style: BorderStyle.thin } }
    worksheet.getCell('E7').alignment = metaKeyAlignmentMiddleRight

    worksheet.getCell('F7').font = metaFontNotBold
    worksheet.getCell('F7').fill = metaValueFillLightGray
    worksheet.getCell('F7').border = { ...borderVerticalThin, right: { style: BorderStyle.thin } }
    worksheet.getCell('F7').alignment = metaValueAlignmentMiddleLeft

    worksheet.getCell('H7').border = { ...borderVerticalThin, left: { style: BorderStyle.thin } }
    worksheet.getCell('H7').alignment = metaKeyAlignmentMiddleRight

    worksheet.getCell('I7').font = metaFontNotBold
    worksheet.getCell('I7').fill = metaValueFillLightGray
    worksheet.getCell('I7').border = { ...borderVerticalThin, right: { style: BorderStyle.thin } }
    worksheet.getCell('I7').alignment = metaValueAlignmentMiddleLeft

    worksheet.getCell('K7').fill = { type: FillType.pattern, pattern: FillPattern.solid, fgColor: { argb: Color.grayARGB } }
    worksheet.getCell('K7').font = { ...metaFontBold, size: FontSize.small, color: { argb: Color.whiteARGB } }
    worksheet.getCell('K7').border = borderAllThin
    worksheet.getCell('K7').alignment = { horizontal: Align.center, vertical: Align.middle }
    worksheet.getCell('Q7').border = { ...borderAllEmpty, right: { style: BorderStyle.thin } }
}

const timeEntryHeaderRowData = () => {
    try {
        const coreTimesheetHeaderRow = [
            { // Row 8 - DATA
                column_a: capitalize(templateConfig.label.internalReport.dayTitle.toLowerCase()),
                column_b: capitalize(templateConfig.label.internalReport.dateTitle.toLowerCase()),
                column_c: capitalize(templateConfig.label.internalReport.workingTimeTitle.toLowerCase()),
                column_d: capitalize(templateConfig.label.internalReport.travelTimeTitle.toLowerCase()),
                column_e: capitalize(templateConfig.label.internalReport.nightShiftTitle.toLowerCase()),
                column_f: capitalize(templateConfig.label.internalReport.startTimeTitle.toLowerCase()),
                column_g: capitalize(templateConfig.label.internalReport.finishTimeTitle.toLowerCase()),
                column_h: capitalize(templateConfig.label.internalReport.totalHoursTitle.toLowerCase()),
                column_i: capitalize(templateConfig.label.internalReport.overtimeATitle.toLowerCase()),
                column_j: templateConfig.label.internalReport.overtimeBTitle,
                column_k: templateConfig.label.internalReport.colaTitle.toUpperCase(),
                column_l: capitalize(LocationType.onshore.toLowerCase()),
                column_m: capitalize(LocationType.offshore.toLowerCase()),
            },
        ];
        return coreTimesheetHeaderRow;
    } catch (err) {
        console.log(err)
    }
}
const timeEntryHeaderRowStyles = (worksheet: any, borderAllThin: Border, borderAllEmpty: Border, fontDefault: Font) => {
    // Row 8 STYLES
    worksheet.getRow(8).eachCell((cell: any, colNumber: any) => {
        cell.border = borderAllThin
        cell.font = {
            name: fontDefault,
            family: 2,
            italic: false,
            bold: true,
            size: FontSize.small
        }
        cell.fill = {
            type: FillType.pattern,
            pattern: FillPattern.solid,
            fgColor: { argb: Color.aliceBlueARGB }
        }
    })
    worksheet.getCell('Q8').border = { ...borderAllEmpty, right: { style: BorderStyle.thin } }
}

const timeEntrySectionDataRows = (internalReportRecords: InternalReportTimesheetRecord[]) => {
    const dataEntryArray = internalReportRecords.map((_record) => {
        const _daySection = {
            column_a: ClassicTemplate.getDayForInternalReport(_record),
            column_b: ClassicTemplate.getDayLabelForInternalReport(_record), // start tag
            column_c: _record.workingTime ? _record.workingTime.time : '', // working time
            column_d: _record.travelTime ? _record.travelTime.time : '', // travel time
            column_e: _record.nightShift ? _record.nightShift.time : '', // night shift
            column_f: _record.startTime ? _record.startTime.time : '', // start time
            column_g: _record.finishTime ? _record.finishTime.time : '', // finish time
            column_h: _record.totalHours ? _record.totalHours.time : '', // total hours
            column_i: _record.overtime.typeA ? _record.overtime.typeA.time : '', //overtime type A
            column_j: _record.overtime.typeB ? _record.overtime.typeB.time : '', //overtime type B
            column_k: _record.hardshipLocation.cola ? 1 : '', //hardship cola
            column_l: _record.hardshipLocation.onshore ? 1 : '', //hardship onshore
            column_m: _record.hardshipLocation.offshore ? 1 : '', // hardship offshore
        }
        return _daySection
    })
    return dataEntryArray
}
const timeEntrySectionMerges = (worksheet: any, internalReportRecords: InternalReportTimesheetRecord[], startRow: number = 9) => {
    for (let i = startRow; i < internalReportRecords.length + startRow; i++) {
        worksheet.mergeCells(`N${i}:O${i}`);
    }
}
const timeEntrySectionStyles = (worksheet: any, internalReportTimesheet: InternalReportTimesheetCollection, exportOptions: ExportOptions, fontDefault: Font, borderAllThin: Border, borderAllEmpty: Border) => {
    // Row 9 to 39 (or thereabout) - STYLES
    let counter = 0;
    let startRowForTimeEntry = 9;
    const _records = internalReportTimesheet.records;
    worksheet.getRows(9, _records.length).forEach((singleRow: any) => {
        singleRow.eachCell({ includeEmpty: true }, (cell: any, colNumber: number) => {
            cell.font = {
                name: fontDefault,
                size: FontSize.small,
                family: 2,
            }
            cell.alignment = { vertical: Align.middle, horizontal: Align.right }
            cell.border = borderAllThin
            // cell.numFmt = '#';
        })

        if (_records[counter].date.monthNumber != internalReportTimesheet.month) {
            // not same month
            singleRow.eachCell({ includeEmpty: true }, (cell: any) => {
                cell.fill = {
                    type: FillType.pattern,
                    pattern: FillPattern.solid,
                    fgColor: { argb: Color.lightGrayARGB }
                }
            })
        }

        if (_records[counter].date.dayLabel.toLowerCase() == "sunday") {
            worksheet.getCell(`B${counter + startRowForTimeEntry}`).fill = {
                type: FillType.pattern,
                pattern: FillPattern.solid,
                fgColor: { argb: Color.palePinkARGB }
            }
        }

        if (_records[counter].publicHoliday) {
            worksheet.getCell(`B${counter + startRowForTimeEntry}`).fill = {
                type: FillType.pattern,
                pattern: FillPattern.solid,
                fgColor: { argb: Color.ruddyPinkARGB }
            }
        }

        if (_records[counter].premium) {
            worksheet.getCell(`N${counter + startRowForTimeEntry}`).fill = {
                type: FillType.pattern,
                pattern: FillPattern.solid,
                fgColor: { argb: Color.powderBlueARGB }
            }
        } else {
            worksheet.getCell(`N${counter + startRowForTimeEntry}`).fill = {
                type: FillType.pattern,
                pattern: FillPattern.none,
            }
        }

        worksheet.getCell(`A${counter + startRowForTimeEntry}`).alignment = { horizontal: Align.left, vertical: Align.middle }
        worksheet.getCell(`B${counter + startRowForTimeEntry}`).alignment = { horizontal: Align.left, vertical: Align.middle }
        worksheet.getCell(`N${counter + startRowForTimeEntry}`).border = { ...borderAllEmpty, left: { style: BorderStyle.thin } }
        worksheet.getCell(`P${counter + startRowForTimeEntry}`).border = borderAllEmpty
        worksheet.getCell(`Q${counter + startRowForTimeEntry}`).border = { ...borderAllEmpty, right: { style: BorderStyle.thin } }
        counter += 1
    })
}

const timeEntryTotalSectionData = (internalReportRecords: InternalReportTimesheetRecord[]) => {
    try {
        // Row 40 or thereabout Data
        const timeEntryTotalRows: InternalTimesheetExcelTemplateRow[] = [
            // Row 40 - DATA
            {
                column_a: '',
                column_b: templateConfig.label.internalReport.totalTitle,
                column_c: '',
                column_d: '',
                column_e: '',
                column_f: '',
                column_g: '',
                column_h: '',
                column_i: ClassicTemplate.getTotalOvertimeAInInternalReport(internalReportRecords).time,
                column_j: ClassicTemplate.getTotalOvertimeBInInternalReport(internalReportRecords).time,
                column_k: ClassicTemplate.countTotalColaInInternalReport(internalReportRecords),
                column_l: ClassicTemplate.countTotalOnshoreHardshipInInternalReport(internalReportRecords),
                column_m: ClassicTemplate.countTotalOffshoreHardshipInInternalReport(internalReportRecords),
                column_n: ClassicTemplate.countTotalPremiumDaysInInternalReport(internalReportRecords),
            },
        ];
        return timeEntryTotalRows;
    } catch (err) {
        console.log(err)
    }
}
const timeEntryTotalSectionMerges = (worksheet: any, startRow: number = 40) => {
    worksheet.mergeCells(`N${startRow}:O${startRow}`);
}

const timeEntryTotalSectionStyles = (worksheet: any, startRow: number = 40, borderAllThin: Border, borderAllThick: Border, borderAllEmpty: Border, fontDefault: Font) => {
    // Row 40 STYLES
    worksheet.getRow(startRow).eachCell({ includeEmpty: true },
        (cell: any, colNumber: number) => {
            cell.border = borderAllThin
            cell.font = {
                name: fontDefault,
                size: FontSize.small,
                family: 2,
                italic: false,
                bold: true
            }
            cell.alignment = {
                vertical: Align.middle,
                horizontal: Align.right,
            }
        }
    )
    worksheet.getCell(`B${startRow}`).alignment = { wrapText: true, vertical: Align.middle, horizontal: Align.left, shrinkToFit: true }
    worksheet.getCell(`B${startRow}`).font = { size: FontSize.nine, name: fontDefault, italic: false, bold: true }

    worksheet.getCell(`I${startRow}`).border = borderAllThick
    worksheet.getCell(`J${startRow}`).border = borderAllThick
    worksheet.getCell(`K${startRow}`).border = borderAllThick
    worksheet.getCell(`L${startRow}`).border = borderAllThick
    worksheet.getCell(`M${startRow}`).border = borderAllThick
    worksheet.getCell(`P${startRow}`).border = { ...borderAllEmpty, left: { style: BorderStyle.thin } }

    worksheet.getCell(`N${startRow}`).fill = {
        type: FillType.pattern,
        pattern: FillPattern.solid,
        fgColor: { argb: Color.policeBlueARGB }
    }
    worksheet.getCell(`Q${startRow}`).border = { ...borderAllEmpty, right: { style: BorderStyle.thin } }
}


const timesheetSignatureSectionData = (internalReportTimesheet: InternalReportTimesheetCollection) => {
    try {
        // Row 41 to 42 Data - in some scenario, it might fall into other rows

        const timesheetSignatureRows = [
            // Row 41
            {
                column_a: templateConfig.label.internalReport.personnelNameAlt + ': ',
                column_c: internalReportTimesheet.personnel.name,
                column_h: templateConfig.label.internalReport.manager + ': ',
                column_i: templateConfig.data.internalReport.managerName,

            },
            // Row 42
            {
                column_a: templateConfig.label.internalReport.signatureAndDate + ': ',
                column_h: templateConfig.label.internalReport.signatureAndDate + ': ',
            },
        ];

        return timesheetSignatureRows;
    } catch (err) {
        console.log(err)
    }
}
const timesheetSignatureSectionMerges = (worksheet: any, startRow: number = 41) => {
    let _cursorRow = startRow;
    // Row 41 to 42 Merges
    worksheet.mergeCells(`A${_cursorRow}:B${_cursorRow}`);
    worksheet.mergeCells(`C${_cursorRow}:F${_cursorRow}`);
    worksheet.mergeCells(`I${_cursorRow}:K${_cursorRow}`);

    _cursorRow += 1;
    worksheet.mergeCells(`A${_cursorRow}:B${_cursorRow}`);
    worksheet.mergeCells(`C${_cursorRow}:F${_cursorRow}`);
    worksheet.mergeCells(`I${_cursorRow}:K${_cursorRow}`);
}
const timesheetSignatureSectionStyle = (worksheet: any, startRow: number = 41, borderVerticalThin: Border, borderAllEmpty: Border, fontDefault: Font) => {
    let _cursorRow = startRow;
    // Row ~41 - STYLE
    worksheet.getRow(_cursorRow).eachCell({ includeEmpty: true }, (cell: any, colNumber: number) => {
        cell.border = borderVerticalThin
        cell.font = {
            name: fontDefault,
            size: FontSize.medium,
            family: 2,
            italic: false
        }
        cell.alignment = { vertical: Align.middle }
    })
    worksheet.getCell(`A${_cursorRow}`).border = { ...borderVerticalThin, left: { style: BorderStyle.thin } }
    worksheet.getCell(`L${_cursorRow}`).border = borderVerticalThin
    worksheet.getCell(`M${_cursorRow}`).border = { ...borderVerticalThin, right: { style: BorderStyle.thin } }
    worksheet.getCell(`N${_cursorRow}`).border = { ...borderAllEmpty, top: { style: BorderStyle.thin }, left: { style: BorderStyle.thin } }
    worksheet.getCell(`O${_cursorRow}`).border = { ...borderAllEmpty, top: { style: BorderStyle.thin } }
    worksheet.getCell(`P${_cursorRow}`).border = borderAllEmpty
    worksheet.getCell(`Q${_cursorRow}`).border = { ...borderAllEmpty, right: { style: BorderStyle.thin } }

    _cursorRow += 1
    worksheet.getRow(_cursorRow).eachCell({ includeEmpty: true }, (cell: any, colNumber: number) => {
        cell.border = borderVerticalThin
        cell.font = {
            name: fontDefault,
            size: FontSize.medium,
            family: 2,
            italic: false
        }
        cell.alignment = { vertical: Align.middle }
    })

    worksheet.getRow(_cursorRow).height = 40
    worksheet.getCell(`A${_cursorRow}`).border = { ...borderVerticalThin, left: { style: BorderStyle.thin } }
    worksheet.getCell(`L${_cursorRow}`).border = borderVerticalThin
    worksheet.getCell(`M${_cursorRow}`).border = { ...borderVerticalThin, right: { style: BorderStyle.thin } }
    worksheet.getCell(`N${_cursorRow}`).border = { ...borderAllEmpty, bottom: { style: BorderStyle.thin }, left: { style: BorderStyle.thin } }
    worksheet.getCell(`O${_cursorRow}`).border = { ...borderAllEmpty, bottom: { style: BorderStyle.thin } }
    worksheet.getCell(`P${_cursorRow}`).border = { ...borderAllEmpty, bottom: { style: BorderStyle.thin } }
    worksheet.getCell(`Q${_cursorRow}`).border = { ...borderAllEmpty, bottom: { style: BorderStyle.thin }, right: { style: BorderStyle.thin } }
}

const internalTimesheetColumns = () => {
    return [
        {
            header: '', key: 'column_a', width: 10, //day
        },
        {
            header: '', key: 'column_b', width: 13, // date
        },
        {
            header: '', key: 'column_c', width: 16, // working time
        },
        {
            header: '', key: 'column_d', width: 10, // travel time
        },
        {
            header: '', key: 'column_e', width: 16, // night shift
        },
        {
            header: '', key: 'column_f', width: 9, // start time
        },
        {
            header: '', key: 'column_g', width: 10, // finish time
        },
        {
            header: '', key: 'column_h', width: 18, // total hours
        },
        {
            header: '', key: 'column_i', width: 16, // overtime wkdays
        },
        {
            header: '', key: 'column_j', width: 17, // overtime ph/sndays
        },
        {
            header: '', key: 'column_k', width: 8, // COLA
        },
        {
            header: '', key: 'column_l', width: 8, //Onshore
        },
        {
            header: '', key: 'column_m', width: 10, // Offshore
        },
        {
            header: '', key: 'column_n', width: 1, //
        },
        {
            header: '', key: 'column_o', width: 6, //premium
        },
        {
            header: '', key: 'column_p', width: 20, // mostly empty
        },
        {
            header: '', key: 'column_q', width: 2, // fully empty
        }
    ];
}

type InternalTimesheetExcelTemplateRow = {
    column_a?: any, // day
    column_b?: any, // Weekday 
    column_c?: any, // Working time
    column_d?: any, // Travel time
    column_e?: any, // Night Shift
    column_f?: any, // start time 
    column_g?: any, // finish time 
    column_h?: any, // Total hours
    column_i?: any, // Overtime wkdays
    column_j?: any, // overrtime ph sundays
    column_k?: any // COLA
    column_l?: any //  onshore
    column_m?: any // Offshore
    column_n?: any //
    column_o?: any //
    column_p?: any //
    column_q?: any //
}