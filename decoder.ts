import {electron} from "./main.js";

export function decode(fileName: string) {
    const data: Uint8Array = electron.getData(fileName)
    const width = 320
    const height = 320

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")

    for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {
            const color = data[x + width * y + 7];
            ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
            ctx.fillRect(x, y, 1, 1);
        }
    }

    return canvas
}