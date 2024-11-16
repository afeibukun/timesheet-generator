import { LocationType, PeriodTypeLabel, EntryTypeExportOption, DateDisplayExportOption } from '@/lib/constants/constant';
import { saveAs } from 'file-saver';
import { ExportOptions } from '@/lib/types/timesheet';
import { Timesheet } from '@/lib/services/timesheet/timesheet';
import templateConfig from '../../template.config';
import { TimesheetDate } from '@/lib/services/timesheet/timesheetDate';
import { ClassicTemplate } from '../../classic';
import { TimesheetRecord } from '@/lib/services/timesheet/timesheetRecord';
import { Align, Border, Color, FillType, Font, FontSize, BorderStyle, FillPattern, Format } from '../../../type';

const sheetNameCollection = (timesheets: Timesheet[]) => {
    let startPoint = "A"
    let startPointNumber = startPoint.charCodeAt(0);
    let _sheetNameCollection = timesheets.map((_timesheet, index) => {
        return `${String.fromCharCode(startPointNumber + index)}-Week(${_timesheet.weekNumber})`
    })
    return _sheetNameCollection
}

export const createXlsxClassicCustomerTimesheetReport = async (timesheets: Timesheet[], exportOptions: ExportOptions) => {
    try {
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Timesheet Generator App';
        workbook.lastModifiedBy = 'Timesheet Generator App';
        workbook.created = new Date();
        workbook.modified = new Date();

        const orientationLandscape = 'orientation'

        const imageExtensionPng = 'png';

        const fontDefault: Font = templateConfig.style.font.default;

        const borderAllThin: Border = {
            top: { style: BorderStyle.thin },
            left: { style: BorderStyle.thin },
            bottom: { style: BorderStyle.thin },
            right: { style: BorderStyle.thin }
        }

        const borderThickBottom: Border = {
            top: { style: BorderStyle.thin },
            left: { style: BorderStyle.thin },
            bottom: { style: BorderStyle.thick },
            right: { style: BorderStyle.thin }
        }

        const borderThickTop: Border = {
            top: { style: BorderStyle.thick },
            left: { style: BorderStyle.thin },
            bottom: { style: BorderStyle.thin },
            right: { style: BorderStyle.thin }
        }


        let sheetCollection = sheetNameCollection(timesheets);

        timesheets.forEach((_timesheet, index) => {
            const worksheet = workbook.addWorksheet(sheetCollection[index], {
                pageSetup: { paperSize: 9, orientation: orientationLandscape, fitToPage: true, margins: { left: 0.7, right: 0.7, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 } }
            });
            const _weekDays = TimesheetDate.getWeekDays(_timesheet.weekEndingDate);

            worksheet.columns = worksheetColumnDataForExcelJs();
            // Row 1
            includeRow1(workbook, imageExtensionPng, worksheet, _timesheet, fontDefault);

            worksheet.addRow(['']); // Row 2 - Empty Row

            // Row 3 - 6
            const timesheetMetaRowsData = metaSectionData(_timesheet)
            worksheet.addRows(timesheetMetaRowsData);
            metaSectionMerges(worksheet);
            metaSectionStyles(worksheet, borderAllThin, borderThickBottom, fontDefault);

            // Row 7 and 8 Data
            const timesheetEntryHeaderRowsData = timesheetEntryHeadingSectionData();
            worksheet.addRows(timesheetEntryHeaderRowsData);
            timesheetEntryHeadingSectionMerges(worksheet);
            timesheetEntryHeadingSectionStyles(worksheet, borderAllThin, fontDefault);

            // Row 9 to 22 - Data
            let coreEntryStartRow = 9;
            let coreTimesheetEntryRows: ExcelTemplateRow[] = timeEntrySectionData(_timesheet, _weekDays, exportOptions);

            let lengthOfCoreTimesheetEntry = coreTimesheetEntryRows.length;
            worksheet.addRows(coreTimesheetEntryRows);
            // timeEntrySectionMerges(worksheet, _weekDays);
            timeEntrySectionMerges(worksheet, coreTimesheetEntryRows);
            if (exportOptions.dateDisplay === DateDisplayExportOption.showOnlyDatesWithEntry) {
                timeEntrySectionStylesWhenEmptyEntriesAreHidden(worksheet, _timesheet, _weekDays, coreTimesheetEntryRows, exportOptions, fontDefault, borderAllThin);
            } else {
                timeEntrySectionStyles(worksheet, _timesheet, _weekDays, exportOptions, fontDefault, borderAllThin);
            }

            const signatureStartRow = coreEntryStartRow + lengthOfCoreTimesheetEntry;
            // Row 23 to 27 Data
            const timesheetSignatureRows = timesheetSignatureSectionData();
            worksheet.addRows(timesheetSignatureRows);
            timesheetSignatureSectionMerges(worksheet, signatureStartRow);
            timesheetSignatureSectionStyle(worksheet, signatureStartRow, borderThickTop, borderAllThin, fontDefault);
            const lengthOfSignatureRows = 5;

            // Row 28 - Empty Row
            worksheet.addRow(['']);

            const footerStartRow = signatureStartRow + lengthOfSignatureRows + 1;
            // Rows 28 till end
            const footerAddressRows = footerAddressTemplatePartData();
            worksheet.addRows(footerAddressRows);
            footerAddressStyles(worksheet, footerAddressRows, footerStartRow, fontDefault);
        })

        const timesheetMonthWithZeroBasedIndex = timesheets[0].monthNumber;
        const timesheetMonthWithUnityBasedIndex = timesheetMonthWithZeroBasedIndex + 1;
        const _timesheetFilename = ClassicTemplate.generateFilename(templateConfig, timesheetMonthWithUnityBasedIndex, timesheets[0].yearNumber, timesheets[0].personnel.name, 'Customer_Timesheet');
        // return workbook.xlsx.writeFile(filename);
        const xlsxBuffer = workbook.xlsx.writeBuffer();
        xlsxBuffer.then((data: any) => {
            var blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(blob, _timesheetFilename);
        });
    } catch (err) {
        console.log(err)
    }
}

const includeRow1 = (workbook: any, imageExtensionPng: any, worksheet: any, timesheet: Timesheet, fontDefault: Font) => {
    const logoBase64 = templateConfig.logoBase64

    const logoId = workbook.addImage({
        base64: logoBase64,
        extension: imageExtensionPng,
    });
    worksheet.addImage(logoId, {
        tl: { col: 0, row: 0 },
        ext: { width: 120, height: 42.86 } // in pixels 96DPI
    });

    const weekNumberCell = worksheet.getCell('Q1');
    weekNumberCell.value = `${templateConfig.label.customerReport.weekPrefix} ${timesheet.weekNumber}`.toUpperCase()

    // Row 1 - MERGES
    worksheet.mergeCells('A1:B1')
    worksheet.mergeCells('Q1:R1')

    // Row 1 - STYLES
    const timesheetTopRow = worksheet.getRow(1);
    timesheetTopRow.height = 35

    weekNumberCell.alignment = { vertical: Align.top, horizontal: Align.right }
    weekNumberCell.font = {
        color: { argb: Color.blueARGB },
        name: fontDefault,
        family: 2,
        size: FontSize.small,
        bold: true
    }
}

const timeEntrySectionData = (timesheet: Timesheet, weekDays: TimesheetDate[], exportOptions: ExportOptions) => {
    try {
        // Row 9 to 22 - Data
        /**
         * the number of rows on this section might not always be 14, but the maximum is 14 (2 per day, for 7 days in a week),
         **/
        let coreEntryRowCounter = 9;
        let coreTimesheetEntryRows: ExcelTemplateRow[] = [];

        if (exportOptions.dateDisplay === DateDisplayExportOption.showAllDatesInTimesheet || exportOptions.dateDisplay === DateDisplayExportOption.hideDatesWithoutTimesheetRecordButRetainSlot) {
            weekDays.forEach((_day) => {
                const _timesheetRecordForCurrentDay = timesheet.records.filter((_record) => _record.date.date === _day.date)[0];
                let _recordRows;
                if (_timesheetRecordForCurrentDay && ClassicTemplate.isValid(_timesheetRecordForCurrentDay, exportOptions)) {
                    _recordRows = timeEntrySectionRows(_timesheetRecordForCurrentDay, exportOptions);
                } else {
                    let _dayTopSection: ExcelTemplateRow = {
                        column_a: exportOptions.dateDisplay === DateDisplayExportOption.showAllDatesInTimesheet ? _day.dayLabel.toUpperCase() : '', //day i.e Monday, Tuesday, ...
                    }
                    let _dayBottomSection: ExcelTemplateRow = {
                        column_a: exportOptions.dateDisplay === DateDisplayExportOption.showAllDatesInTimesheet ? _day.dateInDayMonthFormat : '', //date i.e 30-Aug, 29-Apr ...
                    }
                    _recordRows = [_dayTopSection, _dayBottomSection];
                }
                coreTimesheetEntryRows = [...coreTimesheetEntryRows, ..._recordRows]
            })
        } else if (exportOptions.dateDisplay === DateDisplayExportOption.showOnlyDatesWithEntry) {
            timesheet.records?.forEach((_timesheetRecord) => {
                let _recordRows;
                if (_timesheetRecord && ClassicTemplate.isValid(_timesheetRecord, exportOptions)) {
                    _recordRows = timeEntrySectionRows(_timesheetRecord, exportOptions);
                    coreTimesheetEntryRows = [...coreTimesheetEntryRows, ..._recordRows]
                }
            })
        }
        return coreTimesheetEntryRows
    } catch (err) {
        console.log(err)
        throw new Error("Failed to Generate Core Time Entry Rows");
    }
}

const timeEntrySectionRows = (timesheetRecord: TimesheetRecord, exportOptions: ExportOptions,) => {
    const canIncludeMultipleTimeType = exportOptions.allowMultipleTimeEntries;

    const canIncludeTravelPeriod = exportOptions.entryTypeDisplay === EntryTypeExportOption.includeTravelTimeInReport || exportOptions.entryTypeDisplay === EntryTypeExportOption.includeTravelAndWaitingTimeInReport;

    const canIncludeWaitingPeriod = exportOptions.entryTypeDisplay === EntryTypeExportOption.includeWaitingTimeInReport || exportOptions.entryTypeDisplay === EntryTypeExportOption.includeTravelAndWaitingTimeInReport;
    const _dayTopSection = {
        column_a: timesheetRecord.dayLabel.toUpperCase(),
        column_b: PeriodTypeLabel.start.toUpperCase(), // start tag
        column_c: ClassicTemplate.hasWorkingPeriod1(timesheetRecord) ? ClassicTemplate.workingPeriod1(timesheetRecord).startTime : '', // working time 1 - start time
        column_d: canIncludeMultipleTimeType && ClassicTemplate.hasWorkingPeriod2(timesheetRecord) ? ClassicTemplate.workingPeriod2(timesheetRecord).startTime : '', // working time 2 - start time
        column_e: canIncludeMultipleTimeType && ClassicTemplate.hasWorkingPeriod3(timesheetRecord) ? ClassicTemplate.workingPeriod3(timesheetRecord).startTime : '', // working time 3 - start time
        column_f: canIncludeMultipleTimeType && ClassicTemplate.hasWorkingPeriod4(timesheetRecord) ? ClassicTemplate.workingPeriod4(timesheetRecord).startTime : '', // working time 4 - start time
        column_g: canIncludeWaitingPeriod && ClassicTemplate.hasWaitingPeriod1(timesheetRecord) ? ClassicTemplate.waitingPeriod1(timesheetRecord).startTime : '',
        column_h: canIncludeMultipleTimeType && canIncludeWaitingPeriod && ClassicTemplate.hasWaitingPeriod2(timesheetRecord) ? ClassicTemplate.waitingPeriod2(timesheetRecord).startTime : '',
        column_i: canIncludeTravelPeriod && ClassicTemplate.hasTravelPeriod1(timesheetRecord) ? ClassicTemplate.travelPeriod1(timesheetRecord).startTime : '',
        column_j: canIncludeMultipleTimeType && ClassicTemplate.hasTravelPeriod2(timesheetRecord) ? ClassicTemplate.travelPeriod2(timesheetRecord).startTime : '',
        column_k: timesheetRecord.isLocationTypeOnshore ? `${ClassicTemplate.getTotalHours(timesheetRecord, exportOptions)}` : '', // total hours - onshore
        column_l: LocationType.onshore.toUpperCase(), //onshore / offshore
        column_m: timesheetRecord.isLocationTypeOnshore ? templateConfig.data.customerReport.locationTypeIndicator : '', //onshore check mark
        column_n: !!timesheetRecord.consolidatedComment && timesheetRecord.isLocationTypeOnshore ? ClassicTemplate.getComment(timesheetRecord, exportOptions) : "" // Comment for onshore
    }
    const _dayBottomSection: ExcelTemplateRow = {
        column_a: timesheetRecord.dateInDayMonthFormat,
        column_b: PeriodTypeLabel.finish.toUpperCase(), //finish tag
        column_c: ClassicTemplate.hasWorkingPeriod1(timesheetRecord) ? ClassicTemplate.workingPeriod1(timesheetRecord).finishTime : '', // working time 1 - finish time
        column_d: canIncludeMultipleTimeType && ClassicTemplate.hasWorkingPeriod2(timesheetRecord) ? ClassicTemplate.workingPeriod2(timesheetRecord).finishTime : '', // working time 2 - finish time
        column_e: canIncludeMultipleTimeType && ClassicTemplate.hasWorkingPeriod3(timesheetRecord) ? ClassicTemplate.workingPeriod3(timesheetRecord).finishTime : '', // working time 3 - finish
        column_f: canIncludeMultipleTimeType && ClassicTemplate.hasWorkingPeriod4(timesheetRecord) ? ClassicTemplate.workingPeriod4(timesheetRecord).finishTime : '', // working time 4 - start time
        column_g: canIncludeWaitingPeriod && ClassicTemplate.hasWaitingPeriod2(timesheetRecord) ? ClassicTemplate.waitingPeriod2(timesheetRecord).finishTime : '',
        column_h: canIncludeMultipleTimeType && canIncludeWaitingPeriod && ClassicTemplate.hasWaitingPeriod2(timesheetRecord) ? ClassicTemplate.waitingPeriod2(timesheetRecord).finishTime : '',
        column_i: canIncludeTravelPeriod && ClassicTemplate.hasTravelPeriod1(timesheetRecord) ? ClassicTemplate.travelPeriod1(timesheetRecord).finishTime : '',
        column_j: canIncludeMultipleTimeType && canIncludeTravelPeriod && ClassicTemplate.hasTravelPeriod2(timesheetRecord) ? ClassicTemplate.travelPeriod2(timesheetRecord).finishTime : '',
        column_k: timesheetRecord.isLocationTypeOffshore ? `${ClassicTemplate.getTotalHours(timesheetRecord, exportOptions)}` : "", // total hours - Offshore
        column_l: LocationType.offshore.toUpperCase(), // offshore tag
        column_m: timesheetRecord.isLocationTypeOffshore ? templateConfig.data.customerReport.locationTypeIndicator : '', //offshore check mark
        column_n: !!timesheetRecord.consolidatedComment && timesheetRecord.isLocationTypeOffshore ? ClassicTemplate.getComment(timesheetRecord, exportOptions) : "" // Comment for offshore
    }

    return [_dayTopSection, _dayBottomSection];
}

const timeEntrySectionMergesAlternate = (worksheet: any, weekDays: TimesheetDate[]) => {
    // Row 9 to 22 - MERGES
    // might not get to 22
    let coreEntryRowCounter = 9;
    weekDays.forEach(() => {
        worksheet.mergeCells(`N${coreEntryRowCounter}:R${coreEntryRowCounter}`);
        worksheet.mergeCells(`N${coreEntryRowCounter + 1}:R${coreEntryRowCounter + 1}`);
        coreEntryRowCounter += 2;
    })
}
const timeEntrySectionMerges = (worksheet: any, coreTimesheetEntryRowData: ExcelTemplateRow[]) => {
    // Row 9 to 22 - MERGES
    // might not get to 22
    let coreEntryRowCounter = 9;
    coreTimesheetEntryRowData.forEach((d) => {
        worksheet.mergeCells(`N${coreEntryRowCounter}:R${coreEntryRowCounter}`);
        coreEntryRowCounter++;
    })
}

const timeEntrySectionStyles = (worksheet: any, timesheet: Timesheet, weekDays: TimesheetDate[], exportOptions: ExportOptions, fontDefault: Font, borderAllThin: Border) => {
    // Row 9 to 22 - STYLES
    let counter = 0;
    let startRowForTimeEntry = 9;
    worksheet.getRows(9, 14).forEach((singleRow: any) => {
        singleRow.eachCell({ includeEmpty: true }, (cell: any, colNumber: number) => {
            cell.font = {
                name: fontDefault,
                size: FontSize.small,
                family: 2,
            }
            cell.alignment = { vertical: Align.middle, horizontal: Align.center }
        })

        const computeDayCounter = (counter: number) => {
            let _dayCounterInWeek = ((counter) / 2)
            if (counter % 2 != 0) _dayCounterInWeek = (counter - 1) / 2
            return _dayCounterInWeek
        }

        const dayCounterInWeek = computeDayCounter(counter);

        const _currentDay = weekDays[dayCounterInWeek];
        const _currentRecordFilter = timesheet.records.filter((_record) => _record.date.date === _currentDay.date)
        const _currentRecord = _currentRecordFilter.length > 0 ? _currentRecordFilter[0] : undefined;

        const updateColorAndFontForDayNumber = (counter: number) => {
            if ((counter + 9) % 2 != 0) {
                worksheet.getCell(`A${counter + 9}`).font = {
                    bold: true,
                    name: fontDefault,
                    size: FontSize.small,
                    italic: true
                }
                worksheet.getCell(`A${counter + 9}`).fill = {
                    type: FillType.pattern,
                    pattern: FillPattern.solid,
                    fgColor: { argb: Color.lightGrayARGB }
                }
                worksheet.getCell(`A${counter + 9}`).algnment = { shrinkToFit: true }
            }
        }

        // !timesheet.records[dayCounterInWeek].hasHours
        if (_currentRecord && ClassicTemplate.isValid(_currentRecord, exportOptions)) {
            singleRow.eachCell({ includeEmpty: true }, (cell: any, colNumber: number) => {
                cell.border = borderAllThin
            })
            updateColorAndFontForDayNumber(counter);

        } else {
            if (exportOptions.dateDisplay === DateDisplayExportOption.showAllDatesInTimesheet) {
                worksheet.getCell(`A${counter + startRowForTimeEntry}`).border = borderAllThin
                worksheet.getCell(`N${counter + startRowForTimeEntry}`).border = { right: { style: BorderStyle.thin } }
                updateColorAndFontForDayNumber(counter);
            } else if (exportOptions.dateDisplay === DateDisplayExportOption.hideDatesWithoutTimesheetRecordButRetainSlot) {
                worksheet.getCell(`A${counter + startRowForTimeEntry}`).border = { left: { style: BorderStyle.thin } }
                worksheet.getCell(`N${counter + startRowForTimeEntry}`).border = { right: { style: BorderStyle.thin } }
                // updateColorAndFontForDayNumber(counter);
            }
        }

        worksheet.getCell(`A${counter + startRowForTimeEntry}`).alignment = { horizontal: Align.left, vertical: Align.middle }
        worksheet.getCell(`N${counter + startRowForTimeEntry}`).alignment = { horizontal: Align.left, vertical: Align.middle }

        counter += 1
    })
}
const timeEntrySectionStylesWhenEmptyEntriesAreHidden = (worksheet: any, timesheet: Timesheet, weekDays: TimesheetDate[], coreTimesheetEntryRowData: ExcelTemplateRow[], exportOptions: ExportOptions, fontDefault: Font, borderAllThin: Border) => {
    // Row 9 to 22 - STYLES
    // MIGHT NOT REACH 22
    let counter = 0;
    let startRowForTimeEntry = 9;
    let totalNumberOfSlotsOnTimesheetEntries = coreTimesheetEntryRowData.length;
    worksheet.getRows(9, totalNumberOfSlotsOnTimesheetEntries).forEach((singleRow: any) => {
        singleRow.eachCell({ includeEmpty: true }, (cell: any, colNumber: number) => {
            cell.font = {
                name: fontDefault,
                size: FontSize.small,
                family: 2,
            }
            cell.alignment = { vertical: Align.middle, horizontal: Align.center }
        });

        const computeDayCounter = (counter: number) => {
            let _dayCounterInWeek = ((counter) / 2)
            if (counter % 2 != 0) _dayCounterInWeek = (counter - 1) / 2
            return _dayCounterInWeek
        }

        const dayCounterInWeek = computeDayCounter(counter);

        const updateColorAndFontForDayNumber = (counter: number) => {
            if ((counter + 9) % 2 != 0) {
                worksheet.getCell(`A${counter + 9}`).font = {
                    bold: true,
                    name: fontDefault,
                    size: FontSize.small,
                    italic: true
                }
                worksheet.getCell(`A${counter + 9}`).fill = {
                    type: FillType.pattern,
                    pattern: FillPattern.solid,
                    fgColor: { argb: Color.lightGrayARGB }
                }
            }
        }
        if (!!coreTimesheetEntryRowData[counter].column_b) {
            singleRow.eachCell({ includeEmpty: true }, (cell: any, colNumber: number) => {
                cell.border = borderAllThin
            })
            updateColorAndFontForDayNumber(counter);

        }

        worksheet.getCell(`A${counter + startRowForTimeEntry}`).alignment = { horizontal: Align.left, vertical: Align.middle }
        worksheet.getCell(`N${counter + startRowForTimeEntry}`).alignment = { horizontal: Align.left, vertical: Align.middle }
        counter += 1
    })
}

const metaSectionData = (timesheet: Timesheet) => {
    try {

        let timesheetDateForLastDayOfCurrentWeek = timesheet.weekEndingDate
        let javascriptDateForLastDayOfCurrentWeek = timesheetDateForLastDayOfCurrentWeek.toJavascriptDate();
        let javascriptDateForLastDayOfCurrentWeekWithOffset = TimesheetDate.addTimezoneOffsetToJavascriptDate(javascriptDateForLastDayOfCurrentWeek);

        // Row 3 - 6 Data
        const timesheetMetaRows = [
            { // Row 3 - DATA
                column_a: templateConfig.label.customerReport.title.toUpperCase(),
                column_e: templateConfig.label.customerReport.personnelName.toUpperCase(),
                column_j: templateConfig.label.customerReport.mobilizationDate.toUpperCase(),
                column_m: templateConfig.label.customerReport.demobilizationDate.toUpperCase(),
                column_p: templateConfig.label.customerReport.orderNumber.toUpperCase()
            },
            { // Row 4 - DATA
                column_a: templateConfig.data.customerReport.defaultTitle.toUpperCase(),
                column_e: timesheet.personnel.name.toUpperCase(),
                column_j: timesheet.mobilizationDate ? TimesheetDate.addTimezoneOffsetToJavascriptDate(timesheet.mobilizationDate.toJavascriptDate()) : '',
                column_m: timesheet.demobilizationDate ? TimesheetDate.addTimezoneOffsetToJavascriptDate(timesheet.demobilizationDate.toJavascriptDate()) : '',
                column_p: timesheet.project.orderNumber
            },
            { // Row 5 - DATA
                column_a: templateConfig.label.customerReport.customerName.toUpperCase(),
                column_g: templateConfig.label.customerReport.siteName.toUpperCase(),
                column_j: templateConfig.label.customerReport.purchaseOrderNumber.toUpperCase(),
                column_m: templateConfig.label.customerReport.countryName.toUpperCase(),
                column_o: templateConfig.label.customerReport.weekEndingDate.toUpperCase()
            },
            { // Row 6 - DATA
                column_a: timesheet.customer.name.toUpperCase(),
                column_g: timesheet.site.name.toUpperCase(),
                column_j: timesheet.project.purchaseOrderNumber,
                column_m: timesheet.site.country.toUpperCase(),
                column_o: javascriptDateForLastDayOfCurrentWeekWithOffset
            },
        ];
        return timesheetMetaRows;
    } catch (err) {
        console.log(err)
    }
}
const metaSectionMerges = (worksheet: any) => {
    // Row 3 to 6 MERGES
    worksheet.mergeCells('A3:D3');
    worksheet.mergeCells('E3:I3');
    worksheet.mergeCells('J3:L3');
    worksheet.mergeCells('M3:O3');
    worksheet.mergeCells('P3:R3');

    worksheet.mergeCells('A4:D4');
    worksheet.mergeCells('E4:I4');
    worksheet.mergeCells('J4:L4');
    worksheet.mergeCells('M4:O4');
    worksheet.mergeCells('P4:R4');

    worksheet.mergeCells('A5:F5');
    worksheet.mergeCells('G5:I5');
    worksheet.mergeCells('J5:L5');
    worksheet.mergeCells('M5:N5');
    worksheet.mergeCells('O5:R5');

    worksheet.mergeCells('A6:F6');
    worksheet.mergeCells('G6:I6');
    worksheet.mergeCells('J6:L6');
    worksheet.mergeCells('M6:N6');
    worksheet.mergeCells('O6:R6');
}
const metaSectionStyles = (worksheet: any, borderAllThin: Border, borderThickBottom: Border, fontDefault: Font) => {
    // Row 3 STYLES
    worksheet.getRow(3).eachCell({ includeEmpty: true }, (cell: any, colNumber: any) => {
        cell.border = borderAllThin
        cell.font = {
            name: fontDefault,
            family: 2,
            italic: true,
            size: FontSize.small
        }
        cell.fill = {
            type: FillType.pattern,
            pattern: FillPattern.solid,
            fgColor: { argb: Color.lightGrayARGB }
        }
    })
    worksheet.getCell('A3').font = {
        name: fontDefault,
        color: { argb: Color.blueARGB },
        family: 2,
        size: FontSize.medium,
        bold: true,
        italic: false
    }
    worksheet.getCell('A3').fill = {
        type: FillType.pattern,
        pattern: FillPattern.solid,
        fgColor: { argb: Color.whiteARGB }
    }

    // Row 4 STYLES
    worksheet.getRow(4).eachCell((cell: any, colNumber: number) => {
        cell.border = borderAllThin
        cell.font = {
            name: fontDefault,
            size: FontSize.medium,
            bold: true
        }
        cell.alignment = {
            horizontal: Align.left,
            vertical: Align.middle
        }
    })
    worksheet.getCell('A4').font = {
        color: { argb: Color.blueARGB },
        size: FontSize.large,
        bold: true,
        name: fontDefault
    }
    worksheet.getCell('J4').numFmt = Format.date;
    worksheet.getCell('M4').numFmt = Format.date;

    // Row 5 STYLES
    worksheet.getRow(5).eachCell({ includeEmpty: true }, (cell: any, colNumber: any) => {
        cell.border = borderAllThin
        cell.font = {
            name: fontDefault,
            family: 2,
            size: FontSize.small,
            italic: true
        }
        cell.fill = {
            type: FillType.pattern,
            pattern: FillPattern.solid,
            fgColor: { argb: Color.lightGrayARGB }
        }
    })
    // Row 6 STYLES
    worksheet.getRow(6).eachCell((cell: any, colNumber: number) => {
        cell.border = borderThickBottom
        cell.font = {
            name: fontDefault,
            size: FontSize.medium,
            family: 2,
            bold: true
        }
        cell.alignment = {
            horizontal: Align.left,
            vertical: Align.middle
        }
    })
    worksheet.getCell('O6').numFmt = Format.date;

}

const timesheetEntryHeadingSectionData = () => {
    try {
        // Row 7 and 8 Data
        const timesheetEntryHeaderRows: ExcelTemplateRow[] = [
            // Row 7 - DATA
            {
                column_a: templateConfig.label.customerReport.dateTitle.toUpperCase(),
                column_b: templateConfig.label.customerReport.periodTitle.toUpperCase(),
                column_c: templateConfig.label.customerReport.workingTimeTitle.toUpperCase(),
                column_g: templateConfig.label.customerReport.waitingTimeTitle.toUpperCase(),
                column_i: templateConfig.label.customerReport.travelTimeTitle.toUpperCase(),
                column_k: templateConfig.label.customerReport.totalHoursTitle.toUpperCase(),
                column_l: templateConfig.label.customerReport.locationTypeIndicatorTitle,
                column_m: templateConfig.data.customerReport.locationTypeIndicator,
                column_n: templateConfig.label.customerReport.commentTitle.toUpperCase()
            },
            // Row 8 - DATA
            {
                column_c: templateConfig.data.customerReport.workingTimeFirstPeriodTitle,
                column_d: templateConfig.data.customerReport.workingTimeSecondPeriodTitle,
                column_e: templateConfig.data.customerReport.workingTimeThirdPeriodTitle,
                column_f: templateConfig.data.customerReport.workingTimeFourthPeriodTitle,
                column_g: templateConfig.data.customerReport.waitingTimeFirstPeriodTitle,
                column_h: templateConfig.data.customerReport.waitingTimeSecondPeriodTitle,
                column_i: templateConfig.data.customerReport.travelTimeFirstPeriodTitle,
                column_j: templateConfig.data.customerReport.travelTimeSecondPeriodTitle
            },
        ];
        return timesheetEntryHeaderRows;
    } catch (err) {
        console.log(err)
    }
}
const timesheetEntryHeadingSectionMerges = (worksheet: any) => {
    // ROW 7 MERGES
    worksheet.mergeCells('C7:F7');
    worksheet.mergeCells('G7:H7');
    worksheet.mergeCells('I7:J7');

    // ROW 7 and 8 MERGES
    worksheet.mergeCells('B7:B8');
    worksheet.mergeCells('K7:K8');
    worksheet.mergeCells('L7:L8');
    worksheet.mergeCells('M7:M8');
    worksheet.mergeCells('N7:R8');

}
const timesheetEntryHeadingSectionStyles = (worksheet: any, borderAllThin: Border, fontDefault: Font) => {
    // Row 7 STYLES
    worksheet.getRow(7).eachCell({ includeEmpty: true },
        (cell: any, colNumber: number) => {
            cell.border = borderAllThin
            cell.font = {
                name: fontDefault,
                size: FontSize.small,
                family: 2,
                italic: true
            }
            cell.fill = {
                type: FillType.pattern,
                pattern: FillPattern.solid,
                fgColor: { argb: Color.lightGrayARGB }
            }
            cell.alignment = {
                vertical: Align.middle,
                horizontal: Align.left,
            }

        }
    )
    worksheet.getCell('K7').numFmt = '@';
    worksheet.getCell('K7').alignment = { wrapText: true, vertical: Align.middle, horizontal: Align.center, shrinkToFit: true }
    worksheet.getCell('K7').font = { size: FontSize.small, name: fontDefault, italic: true }
    // worksheet.getCell('L7').fill = { type: FillType.pattern, pattern: FillPattern.none }
    worksheet.getCell('L7').alignment = { wrapText: true }
    // worksheet.getCell('M7').fill = { type: FillType.pattern, pattern: FillPattern.none }
    worksheet.getCell('M7').alignment = { vertical: Align.middle, horizontal: Align.center }
    worksheet.getCell('M7').font = { size: FontSize.medium, name: fontDefault }
    // worksheet.getCell('N7').fill = { type: FillType.pattern, pattern: FillPattern.none }
    worksheet.getCell('N7').alignment = { vertical: Align.middle, horizontal: Align.left }

    worksheet.getCell('A7').font = {
        bold: true,
        name: fontDefault,
        size: FontSize.small,
        family: 2,
        italic: true
    };

    // ROW 8 - STYLES
    worksheet.getRow(8).eachCell((cell: any, colNumber: number) => {
        cell.border = borderAllThin
        cell.font = {
            name: fontDefault,
            size: FontSize.small,
            family: 2,
        }
        cell.alignment = { vertical: Align.middle, horizontal: Align.center }
    })
    worksheet.getCell('A8').border = borderAllThin
    worksheet.getCell('B8').alignment = { wrapText: true, vertical: Align.middle, horizontal: Align.center, shrinkToFit: true }
    worksheet.getCell('K8').numFmt = '@';
    worksheet.getCell('K8').alignment = { wrapText: true, vertical: Align.middle, horizontal: Align.center, shrinkToFit: true }
    worksheet.getCell('L8').alignment = { wrapText: true, vertical: Align.middle, horizontal: Align.center, shrinkToFit: true }
    worksheet.getCell('N8').alignment = { vertical: Align.middle, horizontal: Align.left }
}


const timesheetSignatureSectionData = () => {
    try {
        // Row 23 to 27 Data - in some scenario, it might fall into other rows

        const timesheetSignatureRows = [
            // Row 23
            {
                column_a: templateConfig.label.customerReport.personnelSignature.toUpperCase(),
                column_e: templateConfig.label.customerReport.customerVerificationNote.toUpperCase(),
            },
            // Row 24
            {
                column_a: templateConfig.data.customerReport.personnelSignatureCertificationNote.toUpperCase(),
                column_e: templateConfig.label.customerReport.customerRepresentativeName.toUpperCase(),
                column_i: templateConfig.label.customerReport.customerRepresentativeTitle.toUpperCase(),
                column_m: templateConfig.label.customerReport.customerRepresentativeSignature.toUpperCase()
            },
            // Row 25 and 26 - Empty row - for signature purpose
            [''], [''],
            //Row 27
            {
                column_a: templateConfig.data.customerReport.defaultAgreementStatement,
            }
        ];

        return timesheetSignatureRows;
    } catch (err) {
        console.log(err)
    }
}
const timesheetSignatureSectionMerges = (worksheet: any, startRow: number = 23) => {
    let _cursorRow = startRow;
    // Row 23 to 27 Merges
    worksheet.mergeCells(`A${_cursorRow}:D${_cursorRow}`);
    worksheet.mergeCells(`E${_cursorRow}:R${_cursorRow}`);

    _cursorRow += 1;
    worksheet.mergeCells(`A${_cursorRow}:D${_cursorRow}`);
    worksheet.mergeCells(`E${_cursorRow}:H${_cursorRow}`);
    worksheet.mergeCells(`I${_cursorRow}:L${_cursorRow}`);
    worksheet.mergeCells(`M${_cursorRow}:R${_cursorRow}`);

    _cursorRow += 1;
    worksheet.mergeCells(`A${_cursorRow}:D${_cursorRow + 1}`);
    worksheet.mergeCells(`E${_cursorRow}:H${_cursorRow + 1}`);
    worksheet.mergeCells(`I${_cursorRow}:L${_cursorRow + 1}`);
    worksheet.mergeCells(`M${_cursorRow}:R${_cursorRow + 1}`);

    _cursorRow += 2;
    worksheet.mergeCells(`A${_cursorRow}:R${_cursorRow}`);
}
const timesheetSignatureSectionStyle = (worksheet: any, startRow: number = 23, borderThickTop: Border, borderAllThin: Border, fontDefault: Font) => {
    let _cursorRow = startRow;
    // Row 23 - STYLE
    worksheet.getRow(_cursorRow).eachCell((cell: any, colNumber: number) => {
        cell.border = borderThickTop
        cell.font = {
            name: fontDefault,
            size: FontSize.small,
            family: 2,
            italic: true
        }
        cell.alignment = { vertical: Align.middle }
        cell.fill = {
            type: FillType.pattern,
            pattern: FillPattern.solid,
            fgColor: { argb: Color.lightGrayARGB }
        }
    })

    _cursorRow += 1
    // Row 24 - STYLE
    worksheet.getRow(_cursorRow).eachCell((cell: any, colNumber: number) => {
        cell.border = borderAllThin
        cell.font = {
            name: fontDefault,
            size: FontSize.small,
            family: 2,
            italic: true
        }
        cell.alignment = { vertical: Align.middle }
        cell.fill = {
            type: FillType.pattern,
            pattern: FillPattern.solid,
            fgColor: { argb: Color.lightGrayARGB }
        }
    })
    worksheet.getCell(`A${_cursorRow}`).fill = { type: FillType.pattern, pattern: FillPattern.none }

    _cursorRow += 1
    // Row 25 to 26 - STYLE
    worksheet.getRow(_cursorRow).eachCell((cell: any, colNumber: number) => {
        cell.border = borderAllThin
    })

    _cursorRow += 2
    // Row 27 - STYLE
    worksheet.getRow(_cursorRow).eachCell((cell: any, colNumber: number) => {
        cell.border = borderAllThin
        cell.font = {
            name: fontDefault,
            size: FontSize.small,
            family: 2,
            italic: true
        }
        cell.alignment = { vertical: Align.middle }
        cell.fill = {
            type: FillType.pattern,
            pattern: FillPattern.solid,
            fgColor: { argb: Color.lightGrayARGB }
        }
    })

}


const worksheetColumnDataForExcelJs = () => {
    return [
        {
            header: '', key: 'column_a', width: 10,
        },
        {
            header: '', key: 'column_b', width: 8,
        },
        {
            header: '', key: 'column_c', width: 6,
        },
        {
            header: '', key: 'column_d', width: 6,
        },
        {
            header: '', key: 'column_e', width: 6,
        },
        {
            header: '', key: 'column_f', width: 6,
        },
        {
            header: '', key: 'column_g', width: 6,
        },
        {
            header: '', key: 'column_h', width: 6,
        },
        {
            header: '', key: 'column_i', width: 6,
        },
        {
            header: '', key: 'column_j', width: 6,
        },
        {
            header: '', key: 'column_k', width: 8,
        },
        {
            header: '', key: 'column_l', width: 12,
        },
        {
            header: '', key: 'column_m', width: 4,
        },
        {
            header: '', key: 'column_n', width: 12,
        },
        {
            header: '', key: 'column_o', width: 12,
        },
        {
            header: '', key: 'column_p', width: 10,
        },
        {
            header: '', key: 'column_q', width: 10,
        },
        {
            header: '', key: 'column_r', width: 12,
        }
    ];
}

const footerAddressTemplatePartData = () => {
    return templateConfig.data.customerReport.footerAddress.map((address) => {
        return { column_d: address, }
    })
}
const footerAddressStyles = (worksheet: any, footerAddressData: any[], startRow: number = 28, fontDefault: Font) => {
    let _cursorRow = startRow;
    // Row 28 to end of Page - STYLE
    worksheet.getRows(_cursorRow, footerAddressData.length + 1).forEach((singleRow: any) => {
        singleRow.eachCell((cell: any, colNumber: number) => {
            cell.font = {
                name: fontDefault,
                size: FontSize.small,
                family: 2,
            }
            cell.alignment = { vertical: Align.middle }
        })
    })
}

/**
 * Some thoughts on printing the timesheet
 * For days that there are no hours in a timesheet
 * we have the following option
 * - 1 - Include the date for that day, but keep the remaining item blank
 * - 2 - Don't include the date at all, but keep its original space blank
 * - 3 - Don't include the date at all, and don't keep its space blank
 * Probably the user can choose what they want (Option 1 is default)
 */

type ExcelTemplateRow = {
    column_a?: any, // day label or date
    column_b?: any, // start or finish
    column_c?: any, // start time or finish time - working time 1
    column_d?: any, // start time or finish time - working time 2
    column_e?: any, // start time or finish time - working time 3
    column_f?: any, // start time or finish time - working time 4
    column_g?: any, // start time or finish time - waiting time 1
    column_h?: any, // start time or finish time - waiting time 2
    column_i?: any, // start time or finish time - travel time 1
    column_j?: any, // start time or finish time - travel time 2
    column_k?: any // total hours
    column_l?: any // location type - onshore or offshore 
    column_m?: any // location tick mark
    column_n?: any //comment
}