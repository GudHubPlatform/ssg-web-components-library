import { drawImageCover } from '../utils/draw-image-cover.js';

export default function zoom({
    ctx,
    canvas,
    currentImage,
    nextImage,
    progress,
    isTransitionPhase,
}) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!isTransitionPhase) {
        drawImageCover({
            ctx,
            canvas,
            image: currentImage,
            scale: 1.05,
        });

        return;
    }

    // CURRENT IMAGE
    ctx.save();

    ctx.globalAlpha = 1 - progress;

    drawImageCover({
        ctx,
        canvas,
        image: currentImage,
        scale: 1 + (progress * 0.1),
    });

    ctx.restore();

    // NEXT IMAGE
    ctx.save();

    ctx.globalAlpha = progress;

    drawImageCover({
        ctx,
        canvas,
        image: nextImage,
        scale: 1.1 - (progress * 0.1),
    });

    ctx.restore();
}