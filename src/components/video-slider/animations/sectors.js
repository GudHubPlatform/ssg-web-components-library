import { drawImageCover } from '../utils/draw-image-cover.js';

export default function sectors({
    ctx,
    canvas,
    images,
    progress,
}) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const slidesCount =
        images.length;

    const sectorWidth =
        canvas.width / slidesCount;

    // BASE SLIDE
    drawImageCover({
        ctx,
        canvas,
        image: images[0],
    });

    for (let i = 1; i < slidesCount; i++) {

        // START OF THIS SECTOR
        const start =
            i / slidesCount;

        // END OF THIS SECTOR
        const end =
            (i + 1) / slidesCount;

        // LOCAL PROGRESS
        let localProgress =
            (progress - start)
            / (end - start);

        localProgress =
            Math.max(
                0,
                Math.min(1, localProgress)
            );

        // NOT STARTED
        if (localProgress <= 0) {
            continue;
        }

        const x =
            i * sectorWidth;

        ctx.save();

        ctx.beginPath();

        // LAST SECTOR
        if (i === slidesCount - 1) {

            const expandProgress =
                Math.max(
                    0,
                    (progress - 0.875) / 0.125
                );

            const dynamicWidth =
                sectorWidth
                + (
                    (canvas.width - sectorWidth)
                    * expandProgress
                );

            ctx.rect(
                x,
                0,
                dynamicWidth,
                canvas.height
            );

        } else {

            ctx.rect(
                x,
                0,
                sectorWidth,
                canvas.height
            );
        }

        ctx.clip();

        // FADE-IN
        ctx.globalAlpha =
            localProgress;

        drawImageCover({
            ctx,
            canvas,
            image: images[i],
        });

        ctx.restore();
    }
}