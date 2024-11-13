import templateConfig from "./classic/template.config";

export enum Color {
    black = "#000000",
    white = "#ffffff",
    whiteARGB = "FFFFFFFF",
    lightGray = "#F2F2F2",
    lightGrayARGB = 'FFF2F2F2',
    mildGray = "#BFBFBF",
    gray = "#808080",
    grayARGB = "FF808080",
    blue = "#002060",
    blueARGB = 'FF002060',
    antiFlashWhite = "#F1EFF5",
    antiFlashWhiteARGB = "FFF1EFF5",
    aliceBlue = '#EBF6F9',
    aliceBlueARGB = 'FFEBF6F9',
    policBlue = "#215967",
    policeBlueARGB = "FF215967",
    tealBlue = '#31869B',
    tealBlueARGB = 'FF31869B',
    powderBlue = '#B7DEE8',
    powderBlueARGB = 'FFB7DEE8',
    cornFlower = "#92CDDC",
    cornFlowerARGB = "FF92CDDC",
    ruddyPink = '#DA9694',
    ruddyPinkARGB = 'FFDA9694',
    palePink = '#F2DCDB',
    palePinkARGB = 'FFF2DCDB',
}

export type Font = string



export enum FontSize {
    default = 10,
    eleven = 11,
    medium = 12,
    thirteen = 13,
    fourteen = 14,
    nine = 9,
    small = 8,
    smaller = 7,
    tiny = 6,
    fifteen = 15,
    large = 16,
}

export enum FontStyle {
    bold = "bold",
    italic = "italic",
    boldItalic = "bolditalic",
    normal = "normal",
}

export enum Align {
    left = "left",
    right = "right",
    center = "center",
    top = "top",
    middle = "middle"
}

export enum BorderStyle {
    thick = "thick",
    thin = "thin",
    none = '',
}
export type Border = {
    top: { style: BorderStyle },
    left: { style: BorderStyle },
    bottom: { style: BorderStyle },
    right: { style: BorderStyle }
}

export enum Orientation {
    landscape = 'landscape'
}

export enum FillType {
    pattern = 'pattern'
}

export enum FillPattern {
    solid = 'solid',
    none = 'none'
}

export type Fill = {
    type: FillType,
    pattern: FillPattern,
    fgColor?: { argb: Color }
}


