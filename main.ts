import {currentPalette, decode} from "./decoder.js";
import {inBounds, limit} from "./functions.js";

export const electron = window["electron"]

const NONE = -1

export let currentDir = "D:/sync/content"
export let files = []

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

let screenY = 0, maxScreenY = 0, scrollAmount = 50

document.addEventListener("DOMContentLoaded", () => {
    folderImage = document.getElementById("folder_image") as HTMLImageElement
    parentFolderImage = document.getElementById("parent_folder_image") as HTMLImageElement

    const canvas = document.getElementById("canvas") as HTMLCanvasElement
    let ctx: CanvasRenderingContext2D


    // CANVAS INITIALIZATION


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

        refreshThumbnails()
    }


    // DRAWING THUMBNAILS


    let processingThumbnailNumber = 0

    function step() {
        let col = 0
        let y = -screenY
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, document.body.clientWidth, document.body.clientHeight)
        ctx.beginPath()
        for(let n = 0; n < files.length; n++) {
            const file = files[n]
            const x = col * thumbnailWidth

            const img = file.isDirectory ? (file.thumbnail ?? folderImage) : file.thumbnail
            if(img !== undefined && img.width > 0 && img.height > 0) {
                const scale = Math.min((thumbnailWidth - 3) / img.width, (imageHeight - 3) / img.height)
                const imgWidth = scale * img.width
                const imgHeight = scale * img.height
                try {
                    ctx.drawImage(img, x + 1 + 0.5 * (thumbnailWidth - imgWidth)
                        , y + 1 + 0.5 * (imageHeight - imgHeight), imgWidth, imgHeight)
                } catch (e) {
                    console.error(e)
                }
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

        if(processingThumbnailNumber < files.length) {
            const file = files[processingThumbnailNumber]
            if(!file.isDirectory) {
                file.thumbnail = decode(file.name)
            }
            processingThumbnailNumber++
        }

        requestAnimationFrame(step)
    }

    function refreshThumbnails() {
        files = electron.getDir(currentDir)
        if(currentDir.length > 3) {
            files.unshift({name: "..", thumbnail: parentFolderImage, isDirectory: true})
        }

        screenY = 0
        maxScreenY = Math.ceil(Math.ceil(files.length / thumbnailsPerRow)
            - canvas.height / thumbnailHeight) * thumbnailHeight
        if(maxScreenY < 0) maxScreenY = 0
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    step()


    // INPUT


    canvas.addEventListener("mousemove", (event) => {
        const thumbnailNumber = Math.floor(event.x / thumbnailWidth)
            + Math.floor((event.y + screenY) / thumbnailHeight) * thumbnailsPerRow
        currentThumbnail = inBounds(thumbnailNumber, 0, files.length) ? thumbnailNumber : NONE
    });

    canvas.addEventListener("wheel", (event) => {
        screenY += event.deltaY / 100 * scrollAmount
        screenY = limit(screenY, 0, maxScreenY)
    })

    canvas.addEventListener("dblclick", () => {
        if(currentThumbnail === NONE) return

        const file = files[currentThumbnail]
        const fileName = file.name
        if(fileName === "..") {
            currentDir = currentDir.substring(0, currentDir.lastIndexOf("/"))
            if(currentDir.length <= 2) currentDir += "/"
        } else {
            if(!file.isDirectory) {
                const palette = currentPalette
                file.thumbnail = decode(fileName, true)
                if(palette !== currentPalette) processingThumbnailNumber = 0
                return
            }
            currentDir += `/${file.name}`
        }

        processingThumbnailNumber = 0
        refreshThumbnails()
    })
})