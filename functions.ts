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