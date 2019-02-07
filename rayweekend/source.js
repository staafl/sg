const canvas = document.getElementById('canvas');
const dimx = 600;
const dimy = 300;
canvas.width = dimx;
canvas.height = dimy;
const ctx = canvas.getContext('2d');

function clearCanvas() {
    ctx.clearRect(0, 0, dimx, dimy);
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(0, 0, dimx, dimy);
}

function drawPixel(x, y, color) {
    ctx.fillStyle = "rgb(" +
                    (color[0] * 256) + "," +
                    (color[1] * 256) + "," +
                    (color[2] * 256) + ")";
                    
    ctx.fillRect( x, y, 1, 1 );
}

clearCanvas();

for (let x = 0; x < dimx; x += 1) {
    for (let y = 0; y < dimy; y += 1) {
        drawPixel(x, y, [x / dimx, 1 - y / dimy, 0]);
    }
}