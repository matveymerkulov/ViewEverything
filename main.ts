let contents: string[]
let thumbnailsPerRow = 4
let thumbnailsRatio = 200 / 320
let textHeight = 22
let fontSize = 16
let backgroundColor = "gray"
let thumbnailBorderColor = "white"
let thumbnailTextColor = "black"

document.addEventListener("DOMContentLoaded", () => {
    const electron = window["electron"]
    const canvas = document.getElementById("canvas") as HTMLCanvasElement
    let ctx: CanvasRenderingContext2D

    function resizeCanvas() {
        //canvas.style.width = document.body.offsetWidth + 'px';
        //canvas.style.height = document.body.offsetHeight + 'px';
        canvas.width = document.body.offsetWidth;
        canvas.height = document.body.offsetHeight;
        ctx = canvas.getContext("2d")
        ctx.strokeStyle = thumbnailBorderColor
        ctx.lineWidth = 1
        ctx.font = fontSize + "px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle";
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let files

    function step() {
        const thumbnailWidth = document.body.clientWidth / thumbnailsPerRow
        const imageHeight = thumbnailWidth * thumbnailsRatio
        const thumbnailHeight = imageHeight + textHeight + 2
        let col = 0
        let y = 0
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, document.body.clientWidth, document.body.clientHeight)
        ctx.beginPath()
        for(let n = 0; n < files.length; n++) {
            const x = col * thumbnailWidth
            ctx.strokeRect(x + 1, y + 1, thumbnailWidth - 3, thumbnailHeight - 3)

            ctx.fillStyle = thumbnailBorderColor
            ctx.fillRect(x + 1, y + imageHeight + 1, thumbnailWidth - 3, textHeight)
            ctx.fillStyle = thumbnailTextColor
            ctx.fillText(files[n].name, x + 0.5 * thumbnailWidth, y + imageHeight + 0.5 * textHeight, thumbnailWidth - 6)

            col++
            if(col === thumbnailsPerRow) {
                col = 0
                y += thumbnailHeight
            }
        }
        ctx.stroke()
        requestAnimationFrame(step)
    }

    electron.getDir("D:/").then((currentFiles: string[]) => {
        files = currentFiles
        step()
    })
})