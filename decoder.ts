import {electron} from "./main.js";
import {formats} from "./formats.js";

export let currentPalette: number[][] = undefined

function getInt(data: Uint8Array, index: number) {
    return data[index] + 256 * data[index + 1]
}

export function decode(fileName: string) {
    const data: Uint8Array = electron.getData(fileName)
    const dataLength = data.length

    for(const format of formats) {
        const fileSize = format.fileSize
        if(fileSize !== undefined && dataLength !== fileSize) continue

        const paletteStart = format.paletteStart
        if(paletteStart !== undefined) {
            currentPalette = []
            const mul = format.paletteMultiplier ?? 1
            const indexMul = format.paletteBytesPerChannel ?? 1
            const colorMul = format.paletteBytesPerColor ?? 3

            if(paletteStart + indexMul * 256 * colorMul > dataLength) continue

            for (let colIndex = 0; colIndex < 256; colIndex++) {
                currentPalette[colIndex] = []
                for (let colorLayer = 0; colorLayer < 3; colorLayer++) {
                    const i = (colorLayer + colIndex * colorMul) * indexMul
                    currentPalette[colIndex][colorLayer] = data[i] * mul
                }
            }
            console.log(format.name)
        } else if(currentPalette === undefined) {
            console.log("no palette")
            return
        }

        let width = format.width
        let height = format.height

        const widthIndex = format.widthIndex
        if(widthIndex !== undefined) {
            if(widthIndex > dataLength - 2) continue
            width = getInt(data, widthIndex) / 8
        }
        const heightIndex = format.heightIndex
        if(heightIndex !== undefined) {
            if(heightIndex > dataLength - 2) continue
            height = getInt(data, heightIndex)
        }

        if(width === undefined || height === undefined) {
            if(paletteStart !== undefined) {
                const canvas = document.createElement("canvas")
                canvas.width = 256
                canvas.height = 256
                const ctx = canvas.getContext("2d")

                for (let y = 0; y < 16; y++) {
                    for (let x = 0; x < 16; x++) {
                        let color = currentPalette[x + 16 * y]
                        ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
                        ctx.fillRect(x * 16, y * 16, 16, 16)
                    }
                }

                return canvas
            }
            continue
        }

        const imageStart = format.imageStart ?? 0
        if(imageStart + width * height > dataLength) continue

        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")

        for(let y = 0; y < height; y++) {
            for(let x = 0; x < width; x++) {
                const color = currentPalette[data[x + width * y + imageStart]]
                ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
                ctx.fillRect(x, y, 1, 1)
            }
        }

        console.log(format.name)
        return canvas
    }
}