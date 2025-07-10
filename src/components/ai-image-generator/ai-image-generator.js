import html from './ai-image-generator.html';
import './ai-image-generator.scss';

class AiImageGenerator extends GHComponent {
    constructor() {
        super();
        this.startContainer = this.querySelector('.start');
        this.resultContainer = this.querySelector('.result');
        this.imageCompareGenerated = this.querySelector('ai-image-compare.generated');
        this.imageBefore = this.querySelector('ai-image-compare.generated img#image-before');
        this.imageAfter = this.querySelector('ai-image-compare.generated img#image-after');
        this.placeholderImage = this.querySelector('.result img#placeholder');
        this.actionButtons = this.querySelectorAll('.images-wrapper .btn');
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        this.json = await super.getGhData(this.ghId);

        super.render(html);
    }

    async onClientRender() {
        const quiz = this.querySelector("ai-image-quiz");
        quiz.addEventListener("quizFinished", () => {
            quiz.classList.add("hidden");
            this.resultContainer.classList.remove("hidden");
        });

        await this.uploadAndProcess();
    }

    async uploadAndProcess() {
        const fileInput = document.getElementById("imageUpload");
        const regenerateBtn = document.querySelector(".regenerate-btn");
        const uploadButtons = document.querySelectorAll(".upload-image-button");

        uploadButtons.forEach(button => {
            button.addEventListener("click", () => {
                fileInput.click();
            });
        });
    
        fileInput.addEventListener("change", async () => {
            const file = fileInput.files[0];
            if (!file) return;

            this.toggleButtonsVision('hide');
            this.startContainer.classList.add("hidden");

            const quiz = this.querySelector("ai-image-quiz");
            quiz.classList.remove("hidden");

            quiz.addEventListener("quizFinished", () => {
                quiz.classList.add("hidden");
                this.resultContainer.classList.remove("hidden");
            });

            this.imageBefore.src = this.createBlobImageElement(file);
            this.imageCompareGenerated.classList.add("hidden");
            this.placeholderImage.classList.remove("hidden");
            this.placeholderImage.src = this.createBlobImageElement(file);

            this.lastFile = file;
            const promptText = document.getElementById("prompt").value;

            await this.sendToServer(file, promptText);

            this.placeholderImage.classList.add("hidden");
            this.imageCompareGenerated.classList.remove("hidden");
            this.toggleButtonsVision('show');
        });
    
        regenerateBtn.addEventListener("click", async () => {
            if (!this.lastFile) {
                console.warn("No image has been uploaded yet.");
                return;
            }

            this.toggleButtonsVision('hide');
            const promptText = document.getElementById("prompt").value;
            await this.sendToServer(this.lastFile, promptText);
            this.toggleButtonsVision('show');
        });
    }
    
    async sendToServer(file, promptText) {
        const loader = document.getElementById("loader");
        const imageAfter = document.getElementById("image-after");
    
        const formData = new FormData();
        formData.append("image", file);
        formData.append("prompt", promptText);
    
        loader.classList.remove("hidden");
    
        try {
            const response = await fetch("https://ai.applet3d.com/api/sketch-to-render-ai/image-upload", {
                method: "POST",
                body: formData,
            });
    
            if (response.ok) {
                const blob = await response.blob();
                const objectURL = this.createBlobImageElement(blob);
                this.imageAfter.src = objectURL;
    
                const imgElement = document.createElement("img");
                imgElement.src = objectURL;
                imgElement.style.maxWidth = "1920px";
                imgElement.dataset.blob = "true";
    
                imageAfter.innerHTML = "";
                imageAfter.appendChild(imgElement);
    
                imgElement.onload = () => {
                    loader.classList.add("hidden");
                };
            } else {
                console.error("Server error:", response.status);
                loader.classList.add("hidden");
            }
        } catch (err) {
            console.error("Upload failed:", err);
            loader.classList.add("hidden");
        }
    }

    downloadLatestBlobImage() {
        const imageAfter = document.getElementById("image-after");
        const imgElement = imageAfter.querySelector("img");

        if (!imgElement || !imgElement.src.startsWith("blob:")) {
            console.error("No blob image found to download.");
            return;
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "downloaded-image.jpg";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
            }, "image/jpeg", 1);
        };
        img.src = imgElement.src;
    }

    createBlobImageElement(blob) {
        return URL.createObjectURL(blob);
    }

    toggleButtonsVision(vision) {
        this.actionButtons.forEach(btn => btn.classList.toggle('hidden', vision === 'hide'));
        this.actionButtons.forEach(btn => console.log(btn.classList));
    }
}

window.customElements.define('ai-image-generator', AiImageGenerator);
