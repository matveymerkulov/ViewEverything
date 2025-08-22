export enum fileType {
    binary,
    text,
    englishText,
    numbers,
}


export let standardFormats = [
    {
        name: "BMP",
        header: "BM"
    },
    {
        name: "GIF",
        header: "GIF87"
    },
    {
        name: "PNG",
        hexHeader: "89 50 4E 47"
    },
    {
        name: "JPEG",
        hexHeader: "FF D8 FF E0 10 4A 46 49 46"
    },
]


export let formats: any = [
    // CUSTOM PALETTES

    {
        name: "Another World Memory VGA palette",
        fileSize: 1024,
        paletteStart: 0,
        paletteMultiplier: 4,
        paletteBytesPerColor: 4,
    }, {
        name: "Alternate Logic Puzzles VGA palette",
        fileSize: 1536,
        paletteStart: 0,
        paletteMultiplier: 4,
        paletteBytesPerChannel: 2,
    }, {
        name: "Dimension Man VGA palette",
        fileSize: 1543,
        paletteStart: 7,
        paletteMultiplier: 4,
        paletteBytesPerChannel: 2,
    }, {
        name: "Assault VGA palette",
        fileSize: 771,
        paletteStart: 0,
        paletteMultiplier: 4,
    }, {
        name: "Escape palette",
        fileSize: 1030,
        paletteStart: 7,
        paletteMultiplier: 4,
    },

    // COMMON PALETTES

    {
        name: "Binary VGA palette",
        fileSize: 768,
        paletteStart: 0,
        paletteMultiplier: 4,
    }, {
        name: "CosmoX VGA palette",
        header: "CosmoX",
        fileSize: 808,
        paletteStart: 40,
        paletteMultiplier: 4,
    }, {
        name: "Digital VGA palette",
        type: "numbers",
        paletteStart: 0,
    },

    // CUSTOM IMAGE TYPES

    {
        name: "Groov Buggies BSAVE VGA fullscreen image",
        fileSize: 64011,
        imageStart: 11,
        width: 320,
        height: 200,
        bitsPerPixel: 8,
    },

    // COMMON IMAGE TYPES

    {
        name: "QBasic BSAVE VGA fullscreen image",
        fileSize: 64007,
        imageStart: 7,
        width: 320,
        height: 200,
        bitsPerPixel: 8,
    }, {
        name: "QBasic BSAVE VGA fullscreen image with palette",
        fileSize: 64775,
        imageStart: 7,
        width: 320,
        height: 200,
        bitsPerPixel: 8,
        paletteStart: 64007,
        paletteMultiplier: 4,
    }, {
        name: "QBasic BSAVE VGA image",
        imageStart: 11,
        widthIndex: 7,
        divideWidthBy8: true,
        heightIndex: 9,
        bitsPerPixel: 8,
    },
]