import { drawImageCover } from '../utils/draw-image-cover.js';

export default function cascadeStrips({
    ctx,
    canvas,
    images,
    progress,
}) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // BASE IMAGE
    drawImageCover({
        ctx,
        canvas,
        image: images[0],
    });

    const slidesCount =
        images.length;

    const sectorWidth =
        canvas.width / slidesCount;

    // GLOBAL WIPE POSITION
    const totalTravel =
        canvas.width
        + (
            sectorWidth
            * (slidesCount - 1)
        );

    const wipeX =
        totalTravel * progress;

    for (let i = 1; i < slidesCount; i++) {

        const image =
            images[i];

        // OFFSET BETWEEN WIPES
        const offset =
            sectorWidth * (i - 1);

        // CURRENT WIPE POSITION
        const currentX =
            wipeX - offset;

        // NOT YET VISIBLE
        if (currentX <= 0) {
            continue;
        }

        ctx.save();

        ctx.beginPath();

        // LAST SLIDE
        if (i === slidesCount - 1) {

            // CONTINUES TO FULLSCREEN
            ctx.rect(
                0,
                0,
                currentX,
                canvas.height
            );

        } else {

            // NORMAL STRIP
            ctx.rect(
                currentX - sectorWidth,
                0,
                sectorWidth,
                canvas.height
            );
        }

        ctx.clip();

        drawImageCover({
            ctx,
            canvas,
            image,
        });

        ctx.restore();
    }
}