import {electron} from "./main.js";

export function decode(fileName: string) {
    const data: Uint8Array = electron.getData(fileName)
    console.log(data)
}