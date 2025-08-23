import {currentDir, electron, files} from "./main.js"
import {formats, standardImageFormats} from "./formats.js"
import {qbPalette} from "./qb_palette.js"
import {isDigit, removeExtension} from "./functions.js"

export let currentPalette: number[][] = qbPalette()
let imagePalette: number[][]


// DECODER


export function decode(file: any, usePalette = false, getPalette = false, expand = false): any[] {
    if(getPalette) imagePalette = undefined

    const fullFileName = `${currentDir}/${file.name}`
    const byteArray: Uint8Array = electron.getData(fullFileName)


    // STANDARD IMAGE FORMAT DETECTION


    function checkHeader(format: any) {
        function hexValue(code: number) {
            return code - (code >= 65 ? 55 : 48)
        }

        const headerStart: number = format.headerStart ?? 0

        const header: string = format.header
        if(header !== undefined && headerStart + header.length < byteArray.length) {
            for(let index = 0; index < header.length; index++) {
                if(byteArray[index + headerStart] !== header.charCodeAt(index)) return false
            }
        }

        const hexHeader: string = format.hexHeader
        if(hexHeader !== undefined && headerStart + (hexHeader.length + 1) / 3 < byteArray.length) {
            for(let index = 0; index < hexHeader.length; index += 3) {
                if(byteArray[index / 3 + headerStart] !== hexValue(hexHeader.charCodeAt(index + 1))
                        + 16 * hexValue(hexHeader.charCodeAt(index))) {
                    return false
                }
            }
        }

        return true
    }

    for(const format of standardImageFormats) {
        if(checkHeader(format)) {
            const tex = new Image()
            tex.src = fullFileName
            file.thumbnail = tex
            return
        }
    }


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
    const dataLength = data.length


    // FORMAT DETECTION


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
            if(paletteStart + indexMul * (255 * colorMul + 3) > dataLength) continue

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


        // SEARCHING FOR PALETTE WITH SAME NAME


        if(paletteStart === undefined) {
            const fileNameWithoutExtension = removeExtension(file.name)
            for(const file of files) {
                if(removeExtension(file.name) === fileNameWithoutExtension) {
                    decode(file, false, true)
                    if(!imagePalette) continue
                    palette = imagePalette
                    break
                }
            }
        }


        // EXTRACTING IMAGES


        let start = format.imageStart ?? 0
        const items = []
        const itemFormat = format.container ?? format
        while(true) {


            // FORMAT CHECKING


            function getInt(index: number) {
                return data[index] + 256 * data[index + 1]
            }

            let width = itemFormat.width
            let height = itemFormat.height

            const widthIndex = itemFormat.widthIndex
            if(widthIndex !== undefined) {
                if(widthIndex > dataLength - 2) break
                width = getInt(start + widthIndex)
                if(itemFormat.divideWidthBy8) {
                    if(width % 8 !== 0) break
                    width /= 8
                }
            }

            const heightIndex = itemFormat.heightIndex
            if(heightIndex !== undefined) {
                if(heightIndex > dataLength - 2) break
                height = getInt(start + heightIndex)
            }

            if(width === undefined || height === undefined || width <= 0 || height <= 0) break

            start += itemFormat.imageStart ?? 0
            if(start + width * height > dataLength) break


            // IMAGE DECODING AND DISPLAYING


            const canvas = document.createElement("canvas")
            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext("2d")

            for(let y = 0; y < height; y++) {
                for(let x = 0; x < width; x++) {
                    const color = palette[data[start + x + width * y]]
                    ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
                    ctx.fillRect(x, y, 1, 1)
                }
            }

            if(!expand) {
                console.log(itemFormat.name)
                file.thumbnail = canvas
                return
            }

            items.push({name: start, thumbnail: canvas})
            start += width * height
        }


        // PALETTE DISPLAYING


        if(items.length === 0) {
            if(paletteStart !== undefined) {
                const canvas = document.createElement("canvas")
                canvas.width = 256
                canvas.height = 256
                const ctx = canvas.getContext("2d")

                for(let y = 0; y < 16; y++) {
                    for(let x = 0; x < 16; x++) {
                        let color = palette[x + 16 * y]
                        ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
                        ctx.fillRect(x * 16, y * 16, 16, 16)
                    }
                }

                file.thumbnail = canvas
                return
            }
            continue
        }

        return items
    }
}