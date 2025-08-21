import {decode} from "./decoder.js";

export const electron = window["electron"]

const NONE = -1

let currentDir = "D:/sync/content"
let files = []
let thumbnailsPerRow = 4
let thumbnailsRatio = 200 / 320
let textHeight = 22
let fontSize = 16
let backgroundColor = "gray"
let thumbnailBorderColor = "white"
let thumbnailBorderWidth = 2
let thumbnailTextColor = "black"
let thumbnailWidth = 1, thumbnailHeight = 1
let imageHeight = 1
let currentThumbnail = NONE
let folderImage: HTMLImageElement
let parentFolderImage: HTMLImageElement

function inBounds(value: number, min: number, max: number) {
    return value >= min && value <= max
}

document.addEventListener("DOMContentLoaded", () => {
    folderImage = document.getElementById("folder_image") as HTMLImageElement
    parentFolderImage = document.getElementById("parent_folder_image") as HTMLImageElement

    const canvas = document.getElementById("canvas") as HTMLCanvasElement
    let ctx: CanvasRenderingContext2D

    function resizeCanvas() {
        //canvas.style.width = document.body.offsetWidth + 'px';
        //canvas.style.height = document.body.offsetHeight + 'px';
        canvas.width = document.body.offsetWidth;
        canvas.height = document.body.offsetHeight;

        ctx = canvas.getContext("2d")
        ctx.strokeStyle = thumbnailBorderColor
        ctx.lineWidth = thumbnailBorderWidth
        ctx.font = fontSize + "px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle";

        thumbnailWidth = document.body.clientWidth / thumbnailsPerRow
        imageHeight = thumbnailWidth * thumbnailsRatio
        thumbnailHeight = imageHeight + textHeight + 2
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    function step() {
        let col = 0
        let y = 0
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, document.body.clientWidth, document.body.clientHeight)
        ctx.beginPath()
        for(let n = 0; n < files.length; n++) {
            const file = files[n]
            const x = col * thumbnailWidth

            const img = file.isDirectory ? folderImage : file.thumbnail
            if(img !== undefined) {
                const scale = Math.min((thumbnailWidth - 3) / img.width, (imageHeight - 3) / img.height)
                const imgWidth = scale * img.width
                const imgHeight = scale * img.height
                ctx.drawImage(img, x + 1 + 0.5 * (thumbnailWidth - imgWidth)
                    , y + 1 + 0.5 * (imageHeight - imgHeight), imgWidth, imgHeight)
            }

            ctx.strokeRect(x + 1, y + 1, thumbnailWidth - 3, thumbnailHeight - 3)

            ctx.fillStyle = thumbnailBorderColor
            ctx.fillRect(x + 1, y + imageHeight + 1, thumbnailWidth - 3, textHeight)

            let text = file.name
            ctx.fillStyle = thumbnailTextColor
            while(true) {
                if(ctx.measureText(text).width <= thumbnailWidth || text.length <= 3) break
                text = text.substring(0, text.length - 4) + "..."
            }
            ctx.fillText(text, x + 0.5 * thumbnailWidth, y + imageHeight + 0.5 * textHeight, thumbnailWidth - 6)

            col++
            if(col === thumbnailsPerRow) {
                col = 0
                y += thumbnailHeight
            }
        }
        ctx.stroke()
        requestAnimationFrame(step)
    }

    function refreshThumbnails() {
        files = electron.getDir(currentDir)
        files.unshift({name: "..", thumbnail: parentFolderImage})
        step()
    }

    refreshThumbnails()

    canvas.addEventListener("mousemove", (event) => {
        const thumbnailNumber = Math.floor(event.x / thumbnailWidth)
            + Math.floor(event.y / thumbnailHeight) * thumbnailsPerRow
        currentThumbnail = inBounds(thumbnailNumber, 0, files.length) ? thumbnailNumber : NONE
    });

    canvas.addEventListener("dblclick", () => {
        if(currentThumbnail === NONE) return

        const file = files[currentThumbnail]
        const fileName = file.name
        if(fileName === "..") {
            currentDir = currentDir.substring(0, currentDir.lastIndexOf("/"))
        } else {
            if(!file.isDirectory) {
                file.thumbnail = decode(`${currentDir}/${fileName}`)
                return
            }
            currentDir += `/${file.name}`
        }
        refreshThumbnails()
    })
})