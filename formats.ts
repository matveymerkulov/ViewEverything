export let formats: any = [
    {
        name: "Binary VGA palette",
        fileSize: 768,

        paletteStart: 0,
        paletteMultiplier: 4,
    }, {
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
        name: "QBasic BSAVE VGA fullscreen image",
        type: "QBasic Binary",
        fileSize: 64007,

        imageStart: 7,
        width: 320,
        height: 200,
        bitsPerPixel: 8,
    }, {
        name: "QBasic BSAVE VGA fullscreen image with palette",
        type: "QBasic Binary",
        fileSize: 64775,

        imageStart: 7,
        width: 320,
        height: 200,
        bitsPerPixel: 8,

        paletteStart: 64007,
        paletteMultiplier: 4,
    }, {
        name: "QBasic BSAVE VGA image",
        type: "QBasic Binary",

        imageStart: 11,
        widthIndex: 7,
        heightIndex: 9,
        bitsPerPixel: 8,
    },
]