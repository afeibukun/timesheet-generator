import { Timesheet } from '../timesheet/timesheet'
import { TimesheetDate } from '../timesheet/timesheetDate'
import { LocationTypeEnum, PeriodTypeEnum } from '@/lib/constants/enum';
import { saveAs } from 'file-saver';

import templateConfig from '../../../../main-timesheet-template'

const sheetNameCollection = (weeksInGroupedTimesheet: any[]) => {
    let startPoint = "A"
    let startPointNumber = startPoint.charCodeAt(0);
    let _sheetNameCollection = weeksInGroupedTimesheet.map((week, index) => {
        return `${String.fromCharCode(startPointNumber + index)}-Week(${week})`
    })
    return _sheetNameCollection
}

export const createXlsxTimesheetStandardTemplateWithExcelJs = async (timesheet: Timesheet) => {
    let templateName = 'standard'; // just putting this for reasons I don't know
    try {
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Timesheet Generator App';
        workbook.lastModifiedBy = 'Timesheet Generator App';
        workbook.created = new Date();
        workbook.modified = new Date();

        const orientationLandscape = 'orientation'

        const imageExtensionPng = 'png';

        const fontDefault = templateConfig.font.default;

        const fontSizeSmall = templateConfig.fontSize.small;
        const fontSizeMedium = templateConfig.fontSize.default;
        const fontSizeLarge = templateConfig.fontSize.large;

        const colorBlue = templateConfig.color.blueARGB
        const colorLightGray = templateConfig.color.lightGrayARGB
        const colorWhite = templateConfig.color.whiteARGB

        const alignTop = templateConfig.align.top
        const alignLeft = templateConfig.align.left
        const alignRight = templateConfig.align.right
        const alignCenter = templateConfig.align.center

        const cellBorderStyleThin = 'thin'
        const cellBorderStyleThick = 'thick'

        const borderAllThin = {
            top: { style: cellBorderStyleThin },
            left: { style: cellBorderStyleThin },
            bottom: { style: cellBorderStyleThin },
            right: { style: cellBorderStyleThin }
        }

        const borderThickBottom = {
            top: { style: cellBorderStyleThin },
            left: { style: cellBorderStyleThin },
            bottom: { style: cellBorderStyleThick },
            right: { style: cellBorderStyleThin }
        }

        const borderThickTop = {
            top: { style: cellBorderStyleThick },
            left: { style: cellBorderStyleThin },
            bottom: { style: cellBorderStyleThin },
            right: { style: cellBorderStyleThin }
        }

        const fillTypePattern = 'pattern'

        const fillPatternSolid = 'solid'
        const fillPatternNone = 'none'




        let groupedTimesheetEntry = timesheet.timesheetEntryCollectionByWeek
        let weeksInGroupedTimesheet: string[] = Object.keys(groupedTimesheetEntry)

        let timesheetMeta = timesheet.meta;
        let sheetCollection = sheetNameCollection(weeksInGroupedTimesheet);

        weeksInGroupedTimesheet.forEach((week, index) => {

            const worksheet = workbook.addWorksheet(sheetCollection[index], {
                pageSetup: { paperSize: 9, orientation: orientationLandscape, fitToPage: true, margins: { left: 0.7, right: 0.7, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 } }
            });

            let timesheetEntryCollectionForCurrentWeek = groupedTimesheetEntry[week as any];
            let timesheetDateForLastDayOfCurrentWeek = timesheetEntryCollectionForCurrentWeek![timesheetEntryCollectionForCurrentWeek!.length - 1].date;
            let javascriptDateForLastDayOfCurrentWeek = timesheetDateForLastDayOfCurrentWeek.toJavascriptDate();
            let javascriptDateForLastDayOfCurrentWeekWithOffset = TimesheetDate.addTimezoneOffsetToJavascriptDate(javascriptDateForLastDayOfCurrentWeek);

            worksheet.columns = worksheetColumnDataForExcelJs();

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
            weekNumberCell.value = `${templateConfig.label.weekPrefix} ${week}`.toUpperCase()

            // Row 1 - MERGES
            worksheet.mergeCells('A1:B1')
            worksheet.mergeCells('Q1:R1')

            // Row 1 - STYLES
            const timesheetTopRow = worksheet.getRow(1);
            timesheetTopRow.height = 35

            weekNumberCell.alignment = { vertical: alignTop, horizontal: alignRight }
            weekNumberCell.font = {
                color: { argb: colorBlue },
                name: fontDefault,
                family: 2,
                size: fontSizeSmall,
                bold: true
            }

            const emptyRow = worksheet.addRow(['']); // Row 2 - Empty Row

            // Row 3 - 6 Data
            const timesheetMetaRows = [
                { // Row 3 - DATA
                    column_a: templateConfig.label.title.toUpperCase(),
                    column_e: templateConfig.label.personnelName.toUpperCase(),
                    column_j: templateConfig.label.mobilizationDate.toUpperCase(),
                    column_m: templateConfig.label.demobilizationDate.toUpperCase(),
                    column_p: templateConfig.label.orderNumber.toUpperCase()
                },
                { // Row 4 - DATA
                    column_a: templateConfig.staticValues.defaultTitle.toUpperCase(),
                    column_e: timesheetMeta.personnelName.toUpperCase(),
                    column_j: TimesheetDate.addTimezoneOffsetToJavascriptDate(timesheetMeta.mobilizationDate.toJavascriptDate()),
                    column_m: TimesheetDate.addTimezoneOffsetToJavascriptDate(timesheetMeta.demobilizationDate.toJavascriptDate()),
                    column_p: timesheetMeta.orderNumber
                },
                { // Row 5 - DATA
                    column_a: templateConfig.label.customerName.toUpperCase(),
                    column_g: templateConfig.label.siteName.toUpperCase(),
                    column_j: templateConfig.label.purchaseOrderNumber.toUpperCase(),
                    column_m: templateConfig.label.countryName.toUpperCase(),
                    column_o: templateConfig.label.weekEndingDate.toUpperCase()
                },

                { // Row 6 - DATA
                    column_a: timesheetMeta.customerName.toUpperCase(),
                    column_g: timesheetMeta.siteName.toUpperCase(),
                    column_j: timesheetMeta.purchaseOrderNumber,
                    column_m: timesheetMeta.siteCountry.toUpperCase(),
                    column_o: javascriptDateForLastDayOfCurrentWeekWithOffset
                },
            ];

            worksheet.addRows(timesheetMetaRows);

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

            // Row 3 STYLES
            worksheet.getRow(3).eachCell({ includeEmpty: true }, (cell: any, colNumber: any) => {
                cell.border = borderAllThin
                cell.font = {
                    name: fontDefault,
                    family: 2,
                    italic: true,
                    size: fontSizeSmall
                }
                cell.fill = {
                    type: fillTypePattern,
                    pattern: fillPatternSolid,
                    fgColor: { argb: colorLightGray }
                }
            })
            worksheet.getCell('A3').font = {
                name: fontDefault,
                color: { argb: colorBlue },
                family: 2,
                size: fontSizeMedium,
                bold: true,
                italic: false
            }
            worksheet.getCell('A3').fill = {
                type: fillTypePattern,
                pattern: fillPatternSolid,
                fgColor: { argb: colorWhite }
            }

            // Row 4 STYLES
            worksheet.getRow(4).eachCell((cell: any, colNumber: number) => {
                cell.border = borderAllThin
                cell.font = {
                    name: fontDefault,
                    size: fontSizeMedium,
                    bold: true
                }
                cell.alignment = {
                    horizontal: alignLeft,
                    vertical: alignCenter
                }
            })
            worksheet.getCell('A4').font = {
                color: { argb: colorBlue },
                size: fontSizeLarge,
                bold: true,
                name: fontDefault
            }
            worksheet.getCell('J4').numFmt = templateConfig.format.defaultDate;
            worksheet.getCell('M4').numFmt = templateConfig.format.defaultDate;

            // Row 5 STYLES
            worksheet.getRow(5).eachCell({ includeEmpty: true }, (cell: any, colNumber: any) => {
                cell.border = borderAllThin
                cell.font = {
                    name: fontDefault,
                    family: 2,
                    size: fontSizeSmall,
                    italic: true
                }
                cell.fill = {
                    type: fillTypePattern,
                    pattern: fillPatternSolid,
                    fgColor: { argb: colorLightGray }
                }
            })
            // Row 6 STYLES
            worksheet.getRow(6).eachCell((cell: any, colNumber: number) => {
                cell.border = borderThickBottom
                cell.font = {
                    name: fontDefault,
                    size: fontSizeMedium,
                    family: 2,
                    bold: true
                }
                cell.alignment = {
                    horizontal: alignLeft,
                    vertical: alignCenter
                }
            })
            worksheet.getCell('O6').numFmt = templateConfig.format.defaultDate;

            // Row 7 and 8 Data
            const timesheetEntryHeaderRows = [
                // Row 7 - DATA
                { column_a: templateConfig.label.dateTitle.toUpperCase(), column_b: templateConfig.label.workingTimeTitle.toUpperCase(), column_g: templateConfig.label.waitingTimeTitle.toUpperCase(), column_i: templateConfig.label.travelTimeTitle.toUpperCase(), column_k: templateConfig.label.totalHoursTitle.toUpperCase(), column_l: templateConfig.label.locationTypeIndicatorTitle, column_m: templateConfig.staticValues.locationTypeIndicator, column_n: templateConfig.label.commentTitle.toUpperCase() },
                // Row 8 - DATA
                { column_b: templateConfig.label.periodTitle.toUpperCase(), column_c: templateConfig.staticValues.workingTimeFirstPeriodTitle, column_d: templateConfig.staticValues.workingTimeSecondPeriodTitle, column_e: templateConfig.staticValues.workingTimeThirdPeriodTitle, column_f: templateConfig.staticValues.workingTimeFourthPeriodTitle, column_g: templateConfig.staticValues.waitingTimeFirstPeriodTitle, column_h: templateConfig.staticValues.waitingTimeSecondPeriodTitle, column_i: templateConfig.staticValues.travelTimeFirstPeriodTitle, column_j: templateConfig.staticValues.travelTimeSecondPeriodTitle },
            ];

            worksheet.addRows(timesheetEntryHeaderRows);

            // ROW 7 MERGES
            worksheet.mergeCells('B7:F7');
            worksheet.mergeCells('G7:H7');
            worksheet.mergeCells('I7:J7');

            // Row 7 STYLES
            worksheet.getRow(7).eachCell({ includeEmpty: true }, (cell: any, colNumber: number) => {
                cell.border = borderAllThin
                cell.font = {
                    name: fontDefault,
                    size: fontSizeSmall,
                    family: 2,
                    italic: true
                }
                cell.fill = {
                    type: fillTypePattern,
                    pattern: fillPatternSolid,
                    fgColor: { argb: colorLightGray }
                }
            })

            worksheet.getCell('A7').font = {
                bold: true,
                name: fontDefault,
                size: fontSizeSmall,
                family: 2,
                italic: true
            };
            worksheet.getCell('K7').alignment = { vertical: alignCenter, horizontal: alignCenter, wrapText: true }
            worksheet.getCell('K7').font = { size: fontSizeSmall, name: fontDefault, italic: true }
            worksheet.getCell('L7').fill = { type: fillTypePattern, pattern: fillPatternNone }
            worksheet.getCell('L7').alignment = { vertical: alignCenter, horizontal: alignLeft, wrapText: true }
            worksheet.getCell('M7').fill = { type: fillTypePattern, pattern: fillPatternNone }
            worksheet.getCell('M7').alignment = { vertical: alignCenter, horizontal: alignCenter }
            worksheet.getCell('M7').font = { size: fontSizeMedium, name: fontDefault }
            worksheet.getCell('N7').fill = { type: fillTypePattern, pattern: fillPatternNone }
            worksheet.getCell('N7').alignment = { horizontal: alignLeft, vertical: alignCenter }

            // ROW 8 - STYLES
            worksheet.getRow(8).eachCell((cell: any, colNumber: number) => {
                cell.border = borderAllThin
                cell.font = {
                    name: fontDefault,
                    size: fontSizeSmall,
                    family: 2,
                }
                cell.alignment = { vertical: alignCenter, horizontal: alignCenter }
            })
            worksheet.getCell('A8').border = borderAllThin

            // ROW 7 and 8 MERGES
            worksheet.mergeCells('K7:K8');
            worksheet.mergeCells('L7:L8');
            worksheet.mergeCells('M7:M8');
            worksheet.mergeCells('N7:R8');

            // Row 9 to 22 - Data
            let coreEntryRowCounter = 9;
            let coreTimesheetEntryRows: any[] = [];
            timesheetEntryCollectionForCurrentWeek?.forEach((currentTimesheetEntry) => {
                const excelDataForCurrentDay = [
                    {
                        column_a: currentTimesheetEntry.entryDateDayLabel.toUpperCase(),
                        column_b: !currentTimesheetEntry.isEntryPeriodStartTimeNull ? PeriodTypeEnum.start.toUpperCase() : '',
                        column_c: !currentTimesheetEntry.isEntryPeriodStartTimeNull ? currentTimesheetEntry.entryPeriod?.startTime : '',
                        column_k: currentTimesheetEntry.isEntryPeriodValid && currentTimesheetEntry.isLocationTypeOnshore ? `${currentTimesheetEntry.totalEntryPeriodHours}:00` : '',
                        column_l: currentTimesheetEntry.isEntryPeriodValid ? LocationTypeEnum.onshore.toUpperCase() : '',
                        column_m: currentTimesheetEntry.isLocationTypeOnshore ? templateConfig.staticValues.locationTypeIndicator : '',
                        column_n: !currentTimesheetEntry.isCommentNull && currentTimesheetEntry.isLocationTypeOnshore ? currentTimesheetEntry.comment : ""
                    },

                    {
                        column_a: currentTimesheetEntry.entryDateInDayMonthFormat,
                        column_b: !currentTimesheetEntry.isEntryPeriodFinishTimeNull ? PeriodTypeEnum.finish.toUpperCase() : '',
                        column_c: !currentTimesheetEntry.isEntryPeriodFinishTimeNull ? currentTimesheetEntry.entryPeriod?.finishTime : '',
                        column_k: currentTimesheetEntry.isEntryPeriodValid && currentTimesheetEntry.isLocationTypeOffshore ? `${currentTimesheetEntry.totalEntryPeriodHours}:00` : "",
                        column_l: !currentTimesheetEntry.isNullEntry ? LocationTypeEnum.offshore.toUpperCase() : "",
                        column_m: currentTimesheetEntry.isLocationTypeOffshore ? templateConfig.staticValues.locationTypeIndicator : '',
                        column_n: !currentTimesheetEntry.isCommentNull && currentTimesheetEntry.isLocationTypeOffshore ? currentTimesheetEntry.comment : ""
                    },
                ]
                coreTimesheetEntryRows = [...coreTimesheetEntryRows, ...excelDataForCurrentDay]
            })
            worksheet.addRows(coreTimesheetEntryRows);

            // Row 9 to 22 - MERGES
            coreEntryRowCounter = 9;
            timesheetEntryCollectionForCurrentWeek?.forEach(() => {
                worksheet.mergeCells(`N${coreEntryRowCounter}:R${coreEntryRowCounter}`);
                worksheet.mergeCells(`N${coreEntryRowCounter + 1}:R${coreEntryRowCounter + 1}`);
                coreEntryRowCounter += 2;
            })

            // Row 9 to 22 - STYLES
            let counter = 0;
            worksheet.getRows(9, 14).forEach((singleRow: any) => {
                singleRow.eachCell({ includeEmpty: true }, (cell: any, colNumber: number) => {
                    cell.font = {
                        name: fontDefault,
                        size: fontSizeSmall,
                        family: 2,
                    }
                    cell.alignment = { vertical: alignCenter, horizontal: alignCenter }
                })

                let dayCounterInWeek = ((counter) / 2)
                if (counter % 2 != 0) {
                    dayCounterInWeek = (counter - 1) / 2
                }

                if (!timesheetEntryCollectionForCurrentWeek![dayCounterInWeek]?.isNullEntry) {
                    singleRow.eachCell({ includeEmpty: true }, (cell: any, colNumber: number) => {
                        cell.border = borderAllThin
                    })
                } else {
                    worksheet.getCell(`A${counter + 9}`).border = borderAllThin
                    worksheet.getCell(`N${counter + 9}`).border = { right: { style: cellBorderStyleThin } }
                }
                worksheet.getCell(`A${counter + 9}`).alignment = { horizontal: alignLeft, vertical: alignCenter }
                worksheet.getCell(`N${counter + 9}`).alignment = { horizontal: alignLeft, vertical: alignCenter }

                if ((counter + 9) % 2 != 0) {
                    worksheet.getCell(`A${counter + 9}`).font = {
                        bold: true,
                        name: fontDefault,
                        size: fontSizeSmall,
                        italic: true
                    }
                    worksheet.getCell(`A${counter + 9}`).fill = {
                        type: fillTypePattern,
                        pattern: fillPatternSolid,
                        fgColor: { argb: colorLightGray }
                    }
                }
                counter += 1
            })

            // Row 23 to 27 Data
            const timesheetSignatureRows = [
                // Row 23
                {
                    column_a: templateConfig.label.personnelSignature.toUpperCase(),
                    column_e: templateConfig.label.customerVerificationNote.toUpperCase(),
                },
                // Row 24
                {
                    column_a: templateConfig.staticValues.personnelSignatureCertificationNote.toUpperCase(),
                    column_e: templateConfig.label.customerRepresentativeName.toUpperCase(),
                    column_i: templateConfig.label.customerRepresentativeTitle.toUpperCase(),
                    column_m: templateConfig.label.customerRepresentativeSignature.toUpperCase()
                },
                // Row 25 and 26 - Empty row - for signature purpose
                [''], [''],
                //Row 27
                {
                    column_a: templateConfig.staticValues.defaultAgreementStatement,
                }
            ];
            worksheet.addRows(timesheetSignatureRows);

            // Row 23 to 27 Merges
            worksheet.mergeCells('A23:D23');
            worksheet.mergeCells('E23:R23');

            worksheet.mergeCells('A24:D24');
            worksheet.mergeCells('E24:H24');
            worksheet.mergeCells('I24:L24');
            worksheet.mergeCells('M24:R24');

            worksheet.mergeCells('A25:D26');
            worksheet.mergeCells('E25:H26');
            worksheet.mergeCells('I25:L26');
            worksheet.mergeCells('M25:R26');

            worksheet.mergeCells('A27:R27');

            // Row 23 - STYLE
            worksheet.getRow(23).eachCell((cell: any, colNumber: number) => {
                cell.border = borderThickTop
                cell.font = {
                    name: fontDefault,
                    size: fontSizeSmall,
                    family: 2,
                    italic: true
                }
                cell.alignment = { vertical: alignCenter }
                cell.fill = {
                    type: fillTypePattern,
                    pattern: fillPatternSolid,
                    fgColor: { argb: colorLightGray }
                }
            })

            // Row 24 - STYLE
            worksheet.getRow(24).eachCell((cell: any, colNumber: number) => {
                cell.border = borderAllThin
                cell.font = {
                    name: fontDefault,
                    size: fontSizeSmall,
                    family: 2,
                    italic: true
                }
                cell.alignment = { vertical: alignCenter }
                cell.fill = {
                    type: fillTypePattern,
                    pattern: fillPatternSolid,
                    fgColor: { argb: colorLightGray }
                }
            })
            worksheet.getCell('A24').fill = { type: fillTypePattern, pattern: fillPatternNone }

            // Row 25 to 26 - STYLE
            worksheet.getRow(25).eachCell((cell: any, colNumber: number) => {
                cell.border = borderAllThin
            })

            // Row 27 - STYLE
            worksheet.getRow(27).eachCell((cell: any, colNumber: number) => {
                cell.border = borderAllThin
                cell.font = {
                    name: fontDefault,
                    size: fontSizeSmall,
                    family: 2,
                    italic: true
                }
                cell.alignment = { vertical: alignCenter }
                cell.fill = {
                    type: fillTypePattern,
                    pattern: fillPatternSolid,
                    fgColor: { argb: colorLightGray }
                }
            })

            // Row 28 - Empty Row
            worksheet.addRow(['']);

            // Rows 28 till end
            const footerAddressRows = footerAddressTemplatePart();
            worksheet.addRows(footerAddressRows);
            // Row 28 to end of Page - STYLE
            worksheet.getRows(28, footerAddressRows.length + 1).forEach((singleRow: any) => {
                singleRow.eachCell((cell: any, colNumber: number) => {
                    cell.font = {
                        name: fontDefault,
                        size: fontSizeSmall,
                        family: 2,
                    }
                    cell.alignment = { vertical: alignCenter }
                })
            })
        })

        // const workbook = createAndFillWorkbook();
        const fileNameSuffix = templateConfig.fileNameSuffix == undefined || templateConfig.fileNameSuffix == null || templateConfig.fileNameSuffix == '' || !templateConfig.fileNameSuffix ? '' : `-${templateConfig.fileNameSuffix}`
        const timesheetFileName = `${timesheet.entryCollection[0].date.dateInMonthYearFormat}-Timesheet-${timesheet.meta.personnelName}${fileNameSuffix}`;
        // return workbook.xlsx.writeFile(filename);

        const xlsxBuffer = workbook.xlsx.writeBuffer();
        xlsxBuffer.then((data: any) => {
            var blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(blob, timesheetFileName);
        });
    } catch (err) {
        console.log(err)
    }
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

const footerAddressTemplatePart = () => {
    return templateConfig.footerAddress.map((address) => {
        return { column_d: address, }
    })
}