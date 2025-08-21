import {electron} from "./main.js";
import {formats} from "./formats.js";

export let currentPalette: number[][] = undefined

export function decode(fileName: string) {
    const data: Uint8Array = electron.getData(fileName)

    for(const format of formats) {
        console.log(format.name)

        const fileSize = format.fileSize
        if(fileSize !== undefined && data.length !== fileSize) continue

        const paletteStart = format.paletteStart
        if(paletteStart !== undefined) {
            currentPalette = []
            const mul = format.paletteMultiplier ?? 1
            const indexMul = format.paletteBytesPerColor ?? 1
            for (let colIndex = 0; colIndex < 256; colIndex++) {
                currentPalette[colIndex] = []
                for (let colorLayer = 0; colorLayer < 3; colorLayer++) {
                    const i = (colorLayer + colIndex * 3) * indexMul
                    currentPalette[colIndex][colorLayer] = data[i] * mul
                }
            }
        } else if(currentPalette === undefined) {
            console.log("no palette")
            return
        }

        const width = format.width
        const height = format.height
        if(width === undefined || height === undefined) return

        //console.log(format.name)

        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")

        for(let y = 0; y < height; y++) {
            for(let x = 0; x < width; x++) {
                const color = currentPalette[data[x + width * y + 7]]
                ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
                ctx.fillRect(x, y, 1, 1)
            }
        }

        return canvas
    }
}