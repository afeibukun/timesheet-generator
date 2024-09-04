import { PDFDocument, PageSizes, StandardFonts, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import SeLogo from '../../../../data/img/se.png'


async function createPdf() {
    const pdfDoc = await PDFDocument.create()
    // pdfDoc.registerFontkit(fontkit)

    // const openSansFontUrl = "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Work+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap";
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    // const aptosFontBytes = await fetch(SeSansFont).then((res) => res.arrayBuffer());
    // const aptosFont = await pdfDoc.embedFont('aptosFontBytes');
    // const fontFamily = timesRomanFont
    const fontFamily = helveticaFont

    const seLogoPath = SeLogo.src;
    const imageBytes = await fetch(seLogoPath).then((res) => res.arrayBuffer());
    const embeddedImage = await pdfDoc.embedPng(imageBytes);
    const imageDimension = embeddedImage.scale(0.5)

    const expectedRenderedWidth = 1.3 //inches
    const expectedRenderedHeight = 0.35 //inches
    const scaledImageDimension = embeddedImage.scaleToFit(convertInchToPdfUnits(expectedRenderedWidth), convertInchToPdfUnits(expectedRenderedHeight))

    const page = pdfDoc.addPage(changePageOrientation(PageSizes.A4))
    // const page = pdfDoc.addPage()
    const { width, height } = page.getSize()

    enum NormalMargin {
        top = 0.75, //inches
        left = 0.7,
        right = 0.7,
        bottom = 0.75,
        header = 0.3,
        footer = 0.3
    }

    enum NarrowMargin {
        top = 0.75, //inches
        left = 0.25,
        right = 0.25,
        bottom = 0.75,
        header = 0.3,
        footer = 0.3
    }

    page.drawImage(embeddedImage, {
        x: convertInchToPdfUnits(NormalMargin.left),
        y: height - convertInchToPdfUnits(NormalMargin.top),
        width: scaledImageDimension.width,
        height: scaledImageDimension.height
    })

    const _fontSize = 10
    page.drawText('WEEK 31', {
        x: width - convertInchToPdfUnits(NormalMargin.left) - _fontSize,
        y: height - convertInchToPdfUnits(NormalMargin.top),
        size: _fontSize,
        font: fontFamily,
        color: rgb(0, 32 / 255, 96 / 255),
    })

    const fontSize = 30
    page.drawText('Creating PDFs in JavaScript is awesome!', {
        x: 50,
        y: height - 4 * fontSize,
        size: fontSize,
        font: fontFamily,
        color: rgb(0, 0.53, 0.71),
    })

    page.drawImage(embeddedImage, {
        x: page.getWidth() / 2 - imageDimension.width / 2,
        y: page.getHeight() / 2 - imageDimension.height / 2 + 250,
        width: imageDimension.width,
        height: imageDimension.height
    })

    pdfDoc.setTitle('Timesheet')
    pdfDoc.setAuthor('[Author Name]')
    pdfDoc.setSubject('Timesheet')
    pdfDoc.setKeywords(['customer', 'timesheet'])
    pdfDoc.setProducer('Browser')
    pdfDoc.setCreator('Timesheet Generator (https://github.com/Hopding/pdf-lib)')
    pdfDoc.setCreationDate(new Date('2018-06-24T01:58:37.228Z'))
    pdfDoc.setModificationDate(new Date('2019-12-21T07:00:11.000Z'))

    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes.buffer], { type: 'application/pdf' });
    window.open(URL.createObjectURL(blob));
    // console.log(pdfBytes);
}

const inputs = [{ a: "../../../../data/img/se.png", b: 'Week 1', c: 'Timesheet' }];


export const createPdfTimesheet = (timesheet: any) => createPdf();

const convertInchToPdfUnits = (inchValue: number): number => inchValue * 72;

const changePageOrientation = (pageDimension: PageDimension): PageDimension => [...pageDimension].reverse() as PageDimension;

type PageDimension = [number, number]

enum CustomFonts {
    aptos = "Aptos",
    calibri = "Calibri"
}
