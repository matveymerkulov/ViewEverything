let contents: string[]
let thumbnailsPerRow = 16
let thumbnailsRatio = 200 / 320
let textHeightRatio = 20
let fontSize = 16
let thumbnailBorderColor = "white"

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
        ctx.fillStyle = "gray"
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let files

    function step() {
        const width = document.body.clientWidth / thumbnailsPerRow
        const height = width * thumbnailsRatio + textHeightRatio + 2
        let col = 0
        let y = 0
        ctx.fillRect(0, 0, document.body.clientWidth, document.body.clientHeight)
        ctx.beginPath()
        for(let n = 0; n < files.length; n++) {
            const x = col * width
            ctx.strokeRect(x + 1, y + 1, width - 3, height - 3)
            col = (col + 1) % thumbnailsPerRow
        }
        ctx.stroke()
        requestAnimationFrame(step)
    }

    electron.getDir("D:/").then((currentFiles: string[]) => {
        files = currentFiles
        step()
    })
})