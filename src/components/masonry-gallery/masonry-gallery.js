import html from './masonry-gallery.html';
import './masonry-gallery.scss';
import './masonry.js';

class MasonryGallery extends GHComponent {
    constructor() {
        super();
        this.addImages = this.addImages;
        this.imagesContainer = this.querySelector('.masonry-grid');

        const defaultColumnWidth = 25;

        this.ghId = this.getAttribute('data-gh-id') || null;
        this.columnWidthValue = this.hasAttribute('data-column-width') ? this.getAttribute('data-modal-button') : defaultColumnWidth;
        this.contactUsButton = this.hasAttribute('data-modal-button') ? this.getAttribute('data-modal-button') : null;
        this.contactUsButtonId = this.hasAttribute('data-modal-button-id') ? this.getAttribute('data-modal-button-id') : null;
    }

    async onServerRender() {
        this.ghId = this.getAttribute('data-gh-id') || null;
        this.json = await super.getGhData(this.ghId);

        const isMoreItems = this.json.moreItems ? this.json.moreItems : null;
        
        // Passing second array to client
        this.setAttribute('init-images', JSON.stringify(this.json.items));
        this.setAttribute('add-array', JSON.stringify(isMoreItems));

        super.render(html);
    }
    
    async onClientReady() {
        const modal = document.getElementById('modal');

        const initImages = JSON.parse(this.getAttribute('init-images'));
        this.moreImages = JSON.parse(this.getAttribute('add-array'));

        const grid = this.imagesContainer;
        
        this.msnry = new Masonry(grid, {
            itemSelector: '.masonry-grid-item',
            columnWidth: this.columnWidthValue,
            fitWidth: true,
            transitionDuration: '0.5s'
        });

        // Add initial images to the grid
        this.addImages(initImages);

        // Add more images to the grid
        this.buttonMoreInit();

        if (this.contactUsButton && this.contactUsButtonId) {
            const contactUsHTML = `
                <div class='contact-us-wrapper'>
                    <button-component data-popup-id="${this.contactUsButtonId}" data-placement="masonry-layout">
                        <div onclick="openPopup()" class="btn contact-us-button">
                            ${this.contactUsButton}
                        </div>
                    </button-component>
                </div>`;
            
            modal.innerHTML += contactUsHTML;
        }
    }

    openImage() {
        const modal = document.getElementById('modal');
        const images = document.getElementsByClassName('open-modal');
        const modalImg = document.getElementsByClassName("modal-img")[0];
        const modalLoader = document.querySelector('.modal-loader');
    
        function disableScroll() {
            document.body.style.overflow = 'hidden';
        }
    
        function enableScroll() {
            document.body.style.overflow = '';
        }
    
        function closeModal() {
            modal.style.display = "none";
            enableScroll();
        }

        // Event listener for each image to open the modal
        for (var i = 0; i < images.length; i++) {
            images[i].onclick = function() {
                modal.style.display = "block";
                modalLoader.style.display = 'flex'; 
                modalImg.onload = function() {
                    modalLoader.style.display = 'none'; 
                    modalImg.style.display = 'block'; 
                };
                modalImg.src = this.getAttribute('data-modal-image');
                modalImg.style.display = 'none'; 
                disableScroll(); 
            }
        }

        const closeBtn = document.getElementsByClassName("close-modal")[0];
        closeBtn.onclick = closeModal;
    
        window.onclick = function(event) {
            if (event.target === modal) closeModal();
        }
    
        window.onkeydown = function(event) {
            if (event.key === "Escape") closeModal();
        }
    }

    addImages = (imagesSrcArray) => {
        // Iterate through each image source and add it to the grid
        imagesSrcArray.forEach(({ image }) => {
            const { src, alt, title, fullImage } = image;

            this.addImage(src, alt, title, fullImage);
        });
    }

    addImage(imageSrc, imageAlt, imageTitle, fullImageSrc = null) {
        const msnry = this.msnry;

        const promise = new Promise((res, rej) => {
            const img = document.createElement('img');
            img.setAttribute('src', imageSrc);
            img.setAttribute('alt', imageAlt);
            img.setAttribute('title', imageTitle);

            if (fullImageSrc) {
                img.classList.add('open-modal');
                img.setAttribute('data-modal-image', fullImageSrc);
            }

            img.setAttribute('data-image-loading', 'true');

            // Set image wrapper size while the image is loading
            const interval = setInterval(() => {
                if (img.width !== 0) {
                    img.style.width = `${img.naturalWidth}px`;
                    img.style.height = `${img.naturalHeight}px`;
                    clearInterval(interval);
                    res(imageWrapper);
                }
            }, 10);
            
            // Create image wrapper and append the image to it
            const imageWrapper = document.createElement('div');
            imageWrapper.classList.add('masonry-grid-item')
            img.onload = () => {
                img.removeAttribute('data-image-loading');
            }
            imageWrapper.appendChild(img);
            this.imagesContainer.appendChild(imageWrapper);
        });
        
        // After image is loaded, append it to Masonry layout and re-layout the grid
        promise.then((img) => {
            msnry.appended(img);
            msnry.layout();

            if (fullImageSrc) {
                this.openImage();
            }
        });
    }

    buttonMoreInit() {
        const masonryGrid = document.querySelector('.masonry-grid');
        const buttonWrapper = document.querySelector('.button-wrapper');
        const button = buttonWrapper.querySelector('#grid-add-items');
        const addImages = this.addImages;
        const images = this.moreImages;

        if (!masonryGrid || !button || !buttonWrapper) return;

        // Add additional images to the grid
        button.addEventListener('click', async () => {
            // If we set max-height for block, this code remove styles which hide content, when we clicked show more
            masonryGrid.style.maxHeight = 'none';
            masonryGrid.style.overflowY = 'visible';
            masonryGrid.style.scrollbarWidth = 'auto'; 
            masonryGrid.style.msOverflowStyle = 'auto'; 
            
            const styleSheet = document.styleSheets[0]; 
            styleSheet.insertRule('.masonry-grid::-webkit-scrollbar { display: auto; }', styleSheet.cssRules.length);

            // For animation, when we open full block of images
            setTimeout(() => {
                addImages(images);

                button.disabled = true;
                button.style.display = 'none';
            }, 100)
        });
    }
}

window.customElements.define('masonry-gallery', MasonryGallery);