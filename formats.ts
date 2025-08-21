export let formats: any = [
    {
        name: "Binary VGA palette",
        fileSize: 768,

        paletteStart: 0,
        paletteMultiplier: 4,
        paletteBytesPerColor: 1,
    }, {
        name: "Alternate Logic Puzzles VGA palette",
        fileSize: 1536,

        paletteStart: 0,
        paletteMultiplier: 4,
        paletteBytesPerColor: 2,
        colorLayersFirst: true,
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
        paletteBytesPerColor: 1,
    },
]