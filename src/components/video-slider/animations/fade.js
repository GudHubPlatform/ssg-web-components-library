import { drawImageCover } from '../utils/draw-image-cover.js';

export default function fade({
    ctx,
    canvas,
    currentImage,
    nextImage,
    progress,
}) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // CURRENT IMAGE
    drawImageCover({
        ctx,
        canvas,
        image: currentImage,
    });

    // NEXT IMAGE
    ctx.save();

    ctx.globalAlpha = progress;

    drawImageCover({
        ctx,
        canvas,
        image: nextImage,
    });

    ctx.restore();
}