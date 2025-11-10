export function inBounds(value: number, min: number, max: number) {
    return value >= min && value <= max
}

export function limit(value: number, min: number, max: number) {
    return value < min ? min : (value > max ? max : value)
}

export function isDigit(num: number) {
    return (num >= 48 && num <= 57) || num === 46
}

export function removeExtension(fileName: string) {
    let dot = fileName.lastIndexOf(".")
    if(dot > 0) return fileName.substring(0, dot)
    return fileName
}

export function getExtension(fileName: string) {
    return fileName.substring(fileName.lastIndexOf(".") + 1)
}

export function stringsAreEqual(string1: string, string2: string) {
    if(string1 === undefined) return true
    if(Array.isArray(string1)) {
        for(let string of string1) {
            if(string === string2) return true
        }
    }
    return string1 === string2
}