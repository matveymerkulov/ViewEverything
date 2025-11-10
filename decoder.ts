import {currentDir, electron, files} from "./main.js"
import {formats, standardImageFormats} from "./formats.js"
import {qbPalette} from "./qb_palette.js"
import {getExtension, isDigit, removeExtension, stringsAreEqual} from "./functions.js"

export let currentPalette: number[][] = qbPalette()
let imagePalette: number[][]


export function resetPalette() {
    currentPalette = qbPalette()
}

// DECODER


export function decode(file: any, usePalette = false, getPalette = false, expand = false): any[] {
    if(getPalette) imagePalette = undefined

    const fullFileName = `${currentDir}/${file.name}`
    const fileNameWithoutExtension = removeExtension(file.name)
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
        } else if(num < 48 || num >= 58) {
            if(num === 32) continue
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

        if(!stringsAreEqual(format.fileName, file.name)) continue
        if(!stringsAreEqual(format.extension, getExtension(file.name))) continue


        // PALETTE DECODING


        let palette: number[][] = currentPalette

        const paletteStart = format.paletteStart
        if(paletteStart !== undefined) {
            const mul = format.paletteMultiplier ?? 1
            const indexMul = format.paletteBytesPerChannel ?? 1
            const colorMul = format.paletteBytesPerColor ?? 3
            const colorsQuantity = format.colorsQuantity ?? 256

            palette = []
            if(paletteStart + indexMul * ((colorsQuantity - 1) * colorMul + 3) > dataLength) continue

            for(let colIndex = 0; colIndex < colorsQuantity; colIndex++) {
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
            for(const file of files) {
                if(file.isDirectory) continue
                if(removeExtension(file.name) !== fileNameWithoutExtension) continue
                decode(file, false, true)
                if(!imagePalette) continue
                palette = imagePalette
                break
            }
        }


        // EXTRACTING IMAGES


        let start = format.imageStart ?? 0
        const items = []
        const itemFormat = format.container ?? format
        let layers = format.layers
        let canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D
        while(true) {


            // FORMAT CHECKING


            function getInt(index: number) {
                return data[index] + 256 * data[index + 1]
            }

            let width: number = itemFormat.width
            let height: number = itemFormat.height

            const widthIndex: number = itemFormat.widthIndex
            if(widthIndex !== undefined) {
                if(widthIndex > dataLength - 2) break
                width = getInt(start + widthIndex)
            }

            if(width === undefined || width <= 0) break

            if(itemFormat.bSave) {
                if(!layers && width % 8 !== 0) {
                    layers = 4
                } else {
                    width = width >> 3
                }
            }


            const heightIndex: number = itemFormat.heightIndex
            if(heightIndex !== undefined) {
                if(heightIndex > dataLength - 2) break
                height = getInt(start + heightIndex)
            }

            let imageDataLength = dataLength - format.imageStart - (format.container ? itemFormat.imageStart : 0)
            if(itemFormat.determineHeight && (imageDataLength % width) === 0) {
                height = imageDataLength / width
            }

            if(height === undefined || height <= 0) break


            if(imageDataLength === width * height * 4) {
                layers = 4
                width = width << 3
            }


            if(format.container) start += itemFormat.imageStart ?? 0
            let size = width * height
            if(layers) size = (size * layers) >> 3
            if(size <= 0 || start + size > dataLength) break

            if(!expand && items.length > 0) {
                console.log(itemFormat.name)
                file.thumbnail = canvas
                file.hasMultipleImages = true
                return
            }


            // IMAGE DECODING AND DISPLAYING


            canvas = document.createElement("canvas")
            canvas.width = width
            canvas.height = height
            ctx = canvas.getContext("2d")


            if(layers) {
                const byteWidth = (width + 7) >> 3
                for(let y = 0; y < height; y++) {
                    for(let x = 0; x < byteWidth; x++) {
                        for(let bytePos = 0; bytePos < 8; bytePos++) {
                            let colorIndex = 0
                            for(let layer = 3; layer >= 0; layer--) {
                                const dataPos = start + x + byteWidth * (layer + layers * y)
                                colorIndex = (colorIndex << 1) + ((data[dataPos] >> 7 - bytePos) & 1)
                            }
                            if(palette.length <= colorIndex) continue
                            const color = palette[colorIndex]
                            ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
                            ctx.fillRect(bytePos + 8 * x, y, 1, 1)
                        }
                    }
                }
            } else {
                for(let y = 0; y < height; y++) {
                    for(let x = 0; x < width; x++) {
                        let colorIndex = data[start + x + width * y]
                        if(palette.length <= colorIndex) continue
                        const color = palette[colorIndex]
                        ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
                        ctx.fillRect(x, y, 1, 1)
                    }
                }
            }

            items.push({name: items.length, thumbnail: canvas})
            start += format.fixedShift ?? size
            if(itemFormat.bSave) start += size % 2
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
                        let colorIndex = x + 16 * y
                        if(palette.length <= colorIndex) continue
                        let color = palette[colorIndex]
                        ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
                        ctx.fillRect(x * 16, y * 16, 16, 16)
                    }
                }

                file.thumbnail = canvas
                return
            }
            continue
        }

        if(items.length === 1) {
            file.thumbnail = items[0].thumbnail
            return
        }

        return items
    }
}