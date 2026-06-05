import { drawImageCover } from '../utils/draw-image-cover.js';
import { easeInOutCubic } from '../utils/easing.js';

export default function wipeLeft({
    ctx,
    canvas,
    currentImage,
    nextImage,
    progress,
}) {
    const eased = easeInOutCubic(progress);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawImageCover({
        ctx,
        canvas,
        image: currentImage,
    });

    const revealWidth = canvas.width * eased;

    ctx.save();

    ctx.beginPath();

    ctx.rect(
        0,
        0,
        revealWidth,
        canvas.height
    );

    ctx.clip();

    drawImageCover({
        ctx,
        canvas,
        image: nextImage,
    });

    ctx.restore();
}