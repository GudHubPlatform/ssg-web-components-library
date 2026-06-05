import { drawImageCover } from '../utils/draw-image-cover.js';

export default function multiStrip({
    ctx,
    canvas,
    currentImage,
    nextImage,
    progress,
    isTransitionPhase,
}) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // CURRENT IMAGE
    drawImageCover({
        ctx,
        canvas,
        image: currentImage,
    });

    if (!isTransitionPhase) {
        return;
    }

    const strips = 8;

    const stripWidth = canvas.width / strips;

    const stagger = 0.08;

    for (let i = 0; i < strips; i++) {

        const delay = i * stagger;

        let localProgress =
            (progress - delay) / (1 - (stagger * strips));

        localProgress = Math.max(0, Math.min(1, localProgress));

        const revealWidth =
            stripWidth * localProgress;

        const x =
            i * stripWidth;

        ctx.save();

        ctx.beginPath();

        ctx.rect(
            x,
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
}