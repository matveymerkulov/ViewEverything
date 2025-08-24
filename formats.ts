export enum fileType {
    binary,
    text,
    englishText,
    numbers,
}


export let standardImageFormats = [
    {
        name: "BMP",
        header: "BM",
    }, {
        name: "GIF",
        header: "GIF8",
    }, {
        name: "PNG",
        hexHeader: "89 50 4E 47",
    }, {
        name: "JPEG",
        headerStart: 6,
        header: "JFIF",
    }, {
        name: "JPEG",
        headerStart: 6,
        header: "Exif",
    },
]


const qbBSave = {
    name: "QBasic BSAVE VGA image",
    imageStart: 4,
    widthIndex: 0,
    bSave: true,
    heightIndex: 2,
    bitsPerPixel: 8,
}


export let formats: any = [
    // CUSTOM PALETTES

    {
        name: "Another World Memory VGA palette",
        fileName: "ANOTHER.PAL",
        fileSize: 1024,
        paletteStart: 0,
        paletteMultiplier: 4,
        paletteBytesPerColor: 4,
    }, {
        name: "Alternate Logic Puzzles VGA palette",
        extension: "PAL",
        fileSize: 1536,
        paletteStart: 0,
        paletteMultiplier: 4,
        paletteBytesPerChannel: 2,
    }, {
        name: "Dimension Man VGA palette",
        hexHeader: "FD",
        fileName: "DM_CLR.DAT",
        fileSize: 1543,
        paletteStart: 7,
        paletteMultiplier: 4,
        paletteBytesPerChannel: 2,
    }, {
        name: "Assault VGA palette",
        hexHeader: "FD",
        fileName: "Title.pal",
        fileSize: 771,
        paletteStart: 0,
        paletteMultiplier: 4,
    }, {
        name: "Escape palette",
        hexHeader: "FD",
        fileSize: 1030,
        paletteStart: 7,
        paletteMultiplier: 4,
        paletteBytesPerColor: 4,
    },

    // COMMON PALETTES

    {
        name: "Binary VGA palette",
        extension: "PAL",
        fileSize: 768,
        paletteStart: 0,
        paletteMultiplier: 4,
    }, {
        name: "CosmoX VGA palette",
        header: "CosmoX",
        extension: "PAL",
        fileSize: 808,
        paletteStart: 40,
        paletteMultiplier: 4,
    }, {
        name: "Digital VGA palette",
        extension: "PAL",
        type: "numbers",
        paletteStart: 0,
    },

    // CUSTOM IMAGE TYPES

    {
        name: "Groov Buggies BSAVE VGA fullscreen image",
        hexHeader: "FD",
        fileSize: 64011,
        imageStart: 11,
        width: 320,
        height: 200,
    }, {
        name: "Power of love container",
        hexHeader: "FD",
        fileName: "SPRITES.DAT, SPRTMASK.DAT",
        fileSize: 1327,
        imageStart: 7,
        fixedShift: 116,
        container: qbBSave,
    }, {
        name: "Resistance texture",
        hexHeader: "FD",
        extension: "TXR",
        fileSize: 4103,
        imageStart: 7,
        width: 64,
        height: 64,
    },

    // COMMON IMAGE TYPES

    {
        name: "QBasic BSAVE VGA fullscreen image",
        hexHeader: "FD",
        fileSize: 64007,
        imageStart: 7,
        width: 320,
        height: 200,
    }, {
        name: "QBasic BSAVE VGA fullscreen image with palette",
        hexHeader: "FD",
        fileSize: 64775,
        imageStart: 7,
        width: 320,
        height: 200,
        paletteStart: 64007,
        paletteMultiplier: 4,
    },

    // CONTAINERS

    /*{
        name: "Shell shock image container",
        hexHeader: "FD",
        extension: "SPR",
        imageStart: 7,
        fixedShift: 402,
        container: qbBSave,
    },*/ {
        name: "ZAP image",
        hexHeader: "FD",
        fileName: "ZAP.PIX",
        fileSize: 21804,
        imageStart: 12,
        width: 320,
        height: 68,
    }, {
        name: "Robot robbery image",
        hexHeader: "FD",
        extension: "PIC",
        imageStart: 7,
        width: 320,
        determineHeight: true,
    }, {
        name: "QBasic BSAVE container",
        hexHeader: "FD",
        imageStart: 7,
        container: qbBSave,
    },
]