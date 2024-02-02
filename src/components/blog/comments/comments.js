import html from './comments.html';
import './comments.scss';
import commentsObject from './comments.json';

class CommentsComponent extends GHComponent {

    constructor() {
        super();
    }

    async onServerRender() {
        this.articleReference = this.getAttribute('data-article-reference');
        const response = await gudhub.jsonConstructor(
            {
                "type": "array",
                "id": 1,
                "childs": commentsObject,
                "property_name": "comments",
                "app_id": "33454",
                "filter": [
                    {
                        "field_id": 796249,
                        "data_type": "radio_button",
                        "valuesArray": [
                            "1"
                        ],
                        "search_type": "equal_or",
                        "selected_search_option_variable": "Value",
                        "$$hashKey": "object:17104"
                    },
                    {
                        "field_id": 796253,
                        "data_type": "item_ref",
                        "valuesArray": [
                            "false"
                        ],
                        "search_type": "value",
                        "$$hashKey": "object:17170",
                        "selected_search_option_variable": "Value"
                    },
                    {
                        "field_id": 796251,
                        "data_type": "item_ref",
                        "valuesArray": [
                            this.articleReference
                        ],
                        "search_type": "equal_or",
                        "$$hashKey": "object:17205",
                        "selected_search_option_variable": "Value"
                    }
                ],
                "isSortable": 1,
                "field_id_to_sort": "796244",
                "sortType": "desc"
            }
        )

        let comments = response.comments;

        const promises = [];

        comments.forEach((comment, index) => {
            promises.push(new Promise(async (resolve) => {
                const response = await fetch(comment.text);
                const text = await response.text();
                const div = document.createElement('div');
                div.innerHTML = text;
                comments[index].text = div.innerText;
                resolve();
            }));
            if (comment.replies.length) {
                comment.replies.forEach((reply, reply_index) => {
                    promises.push(new Promise(async (resolve) => {
                        const response = await fetch(reply.text);
                        const text = await response.text();
                        const div = document.createElement('div');
                        div.innerHTML = text;
                        comments[index].replies[reply_index].text = div.innerText;
                        resolve();
                    }));
                })
            }
        });

        await Promise.all(promises);

        this.comments = comments;

        super.render(html);

    }

    onClientReady() {
        this.fillWithSavedData();
    }

    async sendForm(item) {
        item.articleReference = this.getAttribute('data-article-reference');
        event.preventDefault();

        const comment = {
            name: item.querySelector('input[name="name"]').value,
            email: item.querySelector('input[name="email"]').value,
            text: item.querySelector('textarea[name="text"]').value,
            reference: item.articleReference,
            date: new Date().getTime()
        }

        if (item.hasAttribute('reply-to')) {
            comment.reply_to = item.getAttribute('reply-to');
        }

        if (item.querySelector('input[name="save"]').checked === true) {
            this.saveUserData(comment.name, comment.email);
        }

        if (comment.name && comment.text) {
            const response = await fetch('https://gudhub.com/api/services/prod/api/33364/add-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(comment)
            });

            if (response.status === 200) {
                item.querySelector('.success').innerText = 'Thank you. Your comment will appear after short review.';
                if (!localStorage.getItem('comment-saved-data')) {
                    item.querySelector('input[name="name"]').value = '';
                    item.querySelector('input[name="email"]').value = '';
                }
                item.querySelector('textarea[name="text"]').value = '';
            }
        }
    }
    addListeners(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault()
            this.sendForm(e.target)
        });
    }

    saveUserData(name, email) {
        const data = {
            name,
            email
        }
        localStorage.setItem('comment-saved-data', JSON.stringify(data));
    }

    fillWithSavedData() {
        if (localStorage.getItem('comment-saved-data')) {
            const data = JSON.parse(localStorage.getItem('comment-saved-data'));
            this.querySelector('input[name="name"]').value = data.name || '';
            this.querySelector('input[name="email"]').value = data.email || '';
        }
    }

    addCommentForm(item) {
        let commentItem = item.closest('.comments__item');
        let replyTo = commentItem.getAttribute('data-id');
        let form = document.createElement('form');
        form.classList.add('comment__form');
        form.setAttribute('reply-to', replyTo)
        form.innerHTML = /*html*/ `
            <input type="text" name="name" placeholder="Name" required>
            <input type="email" name="email" placeholder="Email address">
            <textarea required name="text" cols="30" rows="10" placeholder="Comment"></textarea>
            <div class="checkbox">
                <input type="checkbox" name="save" id="save">
                <label for="save">Save my name and email in this browser for the next time I comment.</label>
            </div>
            <button type="submit">Reply</button>
            <span class="success"></span>
        `;
        commentItem.append(form);
        this.addListeners(form);
    }
}

window.customElements.define('comments-component', CommentsComponent);