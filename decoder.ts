import {electron} from "./main.js";

export const palette: number[][] = []

export function decode(fileName: string) {
    const data: Uint8Array = electron.getData(fileName)
    const width = 320
    const height = 200

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")

    for(let colIndex = 0; colIndex < 256; colIndex++) {
        const i = 64007 + colIndex * 3
        palette[colIndex] = [data[i], data[i + 1], data[i + 2]]
    }

    for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {
            const color = palette[data[x + width * y + 7]]
            ctx.fillStyle = `rgb(${color[0] * 4}, ${color[1] * 4}, ${color[2] * 4})`
            ctx.fillRect(x, y, 1, 1)
        }
    }

    return canvas
}