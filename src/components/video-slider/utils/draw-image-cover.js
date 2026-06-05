export function drawImageCover({
    ctx,
    canvas,
    image,
    scale = 1,
    offsetX = 0,
    offsetY = 0,
}) {
    const canvasRatio = canvas.width / canvas.height;
    const imageRatio = image.width / image.height;

    let drawWidth;
    let drawHeight;

    if (imageRatio > canvasRatio) {
        drawHeight = canvas.height * scale;
        drawWidth = drawHeight * imageRatio;
    } else {
        drawWidth = canvas.width * scale;
        drawHeight = drawWidth / imageRatio;
    }

    const x = ((canvas.width - drawWidth) / 2) + offsetX;
    const y = ((canvas.height - drawHeight) / 2) + offsetY;

    ctx.drawImage(image, x, y, drawWidth, drawHeight);
}