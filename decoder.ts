import {currentDir, electron, files} from "./main.js"
import {formats, standardFormats} from "./formats.js"
import {qbPalette} from "./qb_palette.js"
import {isDigit, removeExtension} from "./functions.js"

export let currentPalette: number[][] = qbPalette()
let imagePalette: number[][]


// DECODER


export function decode(fileName: string, usePalette = false, getPalette = false): any {
    if(getPalette) imagePalette = undefined

    const fullFileName = `${currentDir}/${fileName}`
    const byteArray: Uint8Array = electron.getData(fullFileName)


    // FILE TYPE DETECTION


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


    // FILE CONTENTS CONVERSION


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
                while(numberString.startsWith("0")) {
                    numberString = numberString.substring(1)
                }
                if(numberString.startsWith(".") || numberString === "") {
                    numberString = "0" + numberString
                }
                data.push(JSON.parse(numberString))
                numberString = ""
                readingNumber = false
            }
        }
    } else {
        data = Array.from(byteArray)
    }


    // STANDARD IMAGE FORMAT DETECTION


    function checkHeader(format: any) {
        const header: string = format.header
        if(header !== undefined) {
            for(let index = 0; index < header.length; index++) {
                const char = data[index]
                if(char >= 256) return false
                if(String.fromCharCode(char) !== header.charAt(index)) return false
            }
        }
        return true
    }

    for(const format of standardFormats) {
        if(checkHeader(format)) {
            const tex = new Image()
            tex.src = fullFileName
            return tex
        }
    }


    // FORMAT DETECTION


    const dataLength = data.length
    for(const format of formats) {
        const fileSize = format.fileSize
        if(fileSize !== undefined && dataLength !== fileSize) continue

        if(format.type === "numbers" && !numbers) continue
        if(format.type === "text" && !text) continue
        if(format.type === "english_text" && !englishText) continue

        checkHeader(format)


        // PALETTE DECODING


        let palette: number[][] = currentPalette

        const paletteStart = format.paletteStart
        if(paletteStart !== undefined) {
            const mul = format.paletteMultiplier ?? 1
            const indexMul = format.paletteBytesPerChannel ?? 1
            const colorMul = format.paletteBytesPerColor ?? 3

            palette = []
            if(paletteStart + indexMul * 256 * colorMul > dataLength) continue

            for(let colIndex = 0; colIndex < 256; colIndex++) {
                palette[colIndex] = []
                for (let colorLayer = 0; colorLayer < 3; colorLayer++) {
                    const i = paletteStart + (colorLayer + colIndex * colorMul) * indexMul
                    palette[colIndex][colorLayer] = data[i] * mul
                }
            }

            if(usePalette) currentPalette = palette

            if(getPalette) {
                imagePalette = palette
                return
            }

            console.log(format.name)
        }

        if(getPalette) continue


        // FORMAT CHECKING


        function getInt(index: number) {
            return data[index] + 256 * data[index + 1]
        }

        let width = format.width
        let height = format.height

        const widthIndex = format.widthIndex
        if(widthIndex !== undefined) {
            if(widthIndex > dataLength - 2) continue
            width = getInt(widthIndex)
            if(format.divideWidthBy8) {
                if(width % 8 !== 0) continue
                width /= 8
            }
        }
        const heightIndex = format.heightIndex
        if(heightIndex !== undefined) {
            if(heightIndex > dataLength - 2) continue
            height = getInt(heightIndex)
        }


        // PALETTE DISPLAYING


        if(width === undefined || height === undefined || width <= 0 || height <= 0) {
            if(paletteStart !== undefined) {
                const canvas = document.createElement("canvas")
                canvas.width = 256
                canvas.height = 256
                const ctx = canvas.getContext("2d")

                for (let y = 0; y < 16; y++) {
                    for (let x = 0; x < 16; x++) {
                        let color = palette[x + 16 * y]
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


        // IMAGE DECODING AND DISPLAYING


        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")

        if(paletteStart === undefined) {
            const fileNameWithoutExtension = removeExtension(fileName)
            for(const file of files) {
                if(removeExtension(file.name) === fileNameWithoutExtension) {
                    decode(file.name, false, true)
                    if(!imagePalette) continue
                    palette = imagePalette
                    break
                }
            }
        }

        for(let y = 0; y < height; y++) {
            for(let x = 0; x < width; x++) {
                const color = palette[data[x + width * y + imageStart]]
                ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
                ctx.fillRect(x, y, 1, 1)
            }
        }

        console.log(format.name)
        return canvas
    }
}