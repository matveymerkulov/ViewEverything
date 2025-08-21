import {electron} from "./main.js";
import {formats} from "./formats.js";

export let currentPalette: number[][] = [[0, 0, 0], [0, 0, 168], [0, 168, 0], [0, 168, 168], [168, 0, 0], [168, 0, 168], [168, 84, 0], [168, 168, 168], [84, 84, 84], [84, 84, 252], [84, 252, 84], [84, 252, 252], [252, 84, 84], [252, 84, 252], [252, 252, 84], [252, 252, 252], [0, 0, 0], [20, 20, 20], [32, 32, 32], [44, 44, 44], [56, 56, 56], [68, 68, 68], [80, 80, 80], [96, 96, 96], [112, 112, 112], [128, 128, 128], [144, 144, 144], [160, 160, 160], [180, 180, 180], [200, 200, 200], [224, 224, 224], [252, 252, 252], [0, 0, 252], [64, 0, 252], [124, 0, 252], [188, 0, 252], [252, 0, 252], [252, 0, 188], [252, 0, 124], [252, 0, 64], [252, 0, 0], [252, 64, 0], [252, 124, 0], [252, 188, 0], [252, 252, 0], [188, 252, 0], [124, 252, 0], [64, 252, 0], [0, 252, 0], [0, 252, 64], [0, 252, 124], [0, 252, 188], [0, 252, 252], [0, 188, 252], [0, 124, 252], [0, 64, 252], [124, 124, 252], [156, 124, 252], [188, 124, 252], [220, 124, 252], [252, 124, 252], [252, 124, 220], [252, 124, 188], [252, 124, 156], [252, 124, 124], [252, 156, 124], [252, 188, 124], [252, 220, 124], [252, 252, 124], [220, 252, 124], [188, 252, 124], [156, 252, 124], [124, 252, 124], [124, 252, 156], [124, 252, 188], [124, 252, 220], [124, 252, 252], [124, 220, 252], [124, 188, 252], [124, 156, 252], [180, 180, 252], [196, 180, 252], [216, 180, 252], [232, 180, 252], [252, 180, 252], [252, 180, 232], [252, 180, 216], [252, 180, 196], [252, 180, 180], [252, 196, 180], [252, 216, 180], [252, 232, 180], [252, 252, 180], [232, 252, 180], [216, 252, 180], [196, 252, 180], [180, 252, 180], [180, 252, 196], [180, 252, 216], [180, 252, 232], [180, 252, 252], [180, 232, 252], [180, 216, 252], [180, 196, 252], [0, 0, 112], [28, 0, 112], [56, 0, 112], [84, 0, 112], [112, 0, 112], [112, 0, 84], [112, 0, 56], [112, 0, 28], [112, 0, 0], [112, 28, 0], [112, 56, 0], [112, 84, 0], [112, 112, 0], [84, 112, 0], [56, 112, 0], [28, 112, 0], [0, 112, 0], [0, 112, 28], [0, 112, 56], [0, 112, 84], [0, 112, 112], [0, 84, 112], [0, 56, 112], [0, 28, 112], [56, 56, 112], [68, 56, 112], [84, 56, 112], [96, 56, 112], [112, 56, 112], [112, 56, 96], [112, 56, 84], [112, 56, 68], [112, 56, 56], [112, 68, 56], [112, 84, 56], [112, 96, 56], [112, 112, 56], [96, 112, 56], [84, 112, 56], [68, 112, 56], [56, 112, 56], [56, 112, 68], [56, 112, 84], [56, 112, 96], [56, 112, 112], [56, 96, 112], [56, 84, 112], [56, 68, 112], [80, 80, 112], [88, 80, 112], [96, 80, 112], [104, 80, 112], [112, 80, 112], [112, 80, 104], [112, 80, 96], [112, 80, 88], [112, 80, 80], [112, 88, 80], [112, 96, 80], [112, 104, 80], [112, 112, 80], [104, 112, 80], [96, 112, 80], [88, 112, 80], [80, 112, 80], [80, 112, 88], [80, 112, 96], [80, 112, 104], [80, 112, 112], [80, 104, 112], [80, 96, 112], [80, 88, 112], [0, 0, 64], [16, 0, 64], [32, 0, 64], [48, 0, 64], [64, 0, 64], [64, 0, 48], [64, 0, 32], [64, 0, 16], [64, 0, 0], [64, 16, 0], [64, 32, 0], [64, 48, 0], [64, 64, 0], [48, 64, 0], [32, 64, 0], [16, 64, 0], [0, 64, 0], [0, 64, 16], [0, 64, 32], [0, 64, 48], [0, 64, 64], [0, 48, 64], [0, 32, 64], [0, 16, 64], [32, 32, 64], [40, 32, 64], [48, 32, 64], [56, 32, 64], [64, 32, 64], [64, 32, 56], [64, 32, 48], [64, 32, 40], [64, 32, 32], [64, 40, 32], [64, 48, 32], [64, 56, 32], [64, 64, 32], [56, 64, 32], [48, 64, 32], [40, 64, 32], [32, 64, 32], [32, 64, 40], [32, 64, 48], [32, 64, 56], [32, 64, 64], [32, 56, 64], [32, 48, 64], [32, 40, 64], [44, 44, 64], [48, 44, 64], [52, 44, 64], [60, 44, 64], [64, 44, 64], [64, 44, 60], [64, 44, 52], [64, 44, 48], [64, 44, 44], [64, 48, 44], [64, 52, 44], [64, 60, 44], [64, 64, 44], [60, 64, 44], [52, 64, 44], [48, 64, 44], [44, 64, 44], [44, 64, 48], [44, 64, 52], [44, 64, 60], [44, 64, 64], [44, 60, 64], [44, 52, 64], [44, 48, 64], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]]

function isDigit(num: number) {
    return num >= 48 && num <= 57
}

export function decode(fileName: string) {
    const byteArray: Uint8Array = electron.getData(fileName)

    let numbers = true, text = true, englishText = true
    for(let index = 0; index < byteArray.length; index++) {
        const num = byteArray[index]

        if(num < 32) {
            if(num === 9 || num === 10 || num === 13) continue
            numbers = text = englishText = false
            break
        } else if(num >= 128) {
            numbers = englishText = false
        } else if(num < 32 || num > 64) {
            numbers = false
        }
    }

    let data: number[]
    if(numbers) {
        data = []
        let readingNumber = false
        let numberString: string = ""
        for(let index = 0; index < byteArray.length; index++) {
            let code = byteArray[index]
            if(isDigit(code)) {
                numberString += String.fromCharCode(code)
                readingNumber = true
            } else if(readingNumber) {
                data.push(JSON.parse(numberString))
                numberString = ""
                readingNumber = false
            }
        }
    } else {
        data = Array.from(byteArray)
    }

    const dataLength = data.length

    function getInt(index: number) {
        return data[index] + 256 * data[index + 1]
    }

    for(const format of formats) {
        const fileSize = format.fileSize
        if(fileSize !== undefined && dataLength !== fileSize) continue

        if(format.type === "numbers" && !numbers) continue
        if(format.type === "text" && !text) continue
        if(format.type === "english_text" && !englishText) continue

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
                    const i = paletteStart + (colorLayer + colIndex * colorMul) * indexMul
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
            width = getInt(widthIndex) / 8
        }
        const heightIndex = format.heightIndex
        if(heightIndex !== undefined) {
            if(heightIndex > dataLength - 2) continue
            height = getInt(heightIndex)
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