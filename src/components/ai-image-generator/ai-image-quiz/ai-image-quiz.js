import html from './ai-image-quiz.html';
import './ai-image-quiz.scss';
import jsonTemplate from './sketch-to-render-quiz.json';

class AiImageQuiz extends GHComponent {
    constructor() {
        super();

        this.json = jsonTemplate;
        this.quizTitle = this.json?.title;
        this.quizCardsData = this.json?.variants;
    }

    async onServerRender() {
        super.render(html);
    }

    async onClientRender() {
        this.bindCardClickHandlers();
    }

    bindCardClickHandlers() {
        this.querySelectorAll('.quiz__question').forEach(cardEl => {
            cardEl.addEventListener('click', () => {
                const index = cardEl.dataset.index;
                const selected = this.quizCardsData[index];

                if (selected?.next_step) {
                    this.loadStep(selected.next_step);
                } else {
                    this.dispatchEvent(new CustomEvent("quizFinished", { bubbles: true }));
                }
            });
        });
    }

    loadStep(stepData) {
        this.quizTitle = stepData.title;
        this.quizCardsData = stepData.variants;

        super.render(html);

        this.bindCardClickHandlers();
    }
}

window.customElements.define('ai-image-quiz', AiImageQuiz);
