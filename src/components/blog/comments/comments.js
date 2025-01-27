import html from './comments.html';
import './comments.scss';
import generateCommentsObjectScheme from './comments-scheme.js';

class CommentsComponent extends GHComponent {

    constructor() {
        super();
        this.texts = JSON.parse(this.getAttribute('data-comments-texts')) || null;
    }

    async onServerRender() {
        this.articleReference = this.getAttribute('data-article-reference');
        const blog_chapter = window.getConfig().chapters.blog;
        const {
            comments_app_id,
            comments_status_field_id,
            comments_replyToRef_field_id,
            comments_articleRef_field_id,
            comments_date_field_id
        } = blog_chapter;
        const response = await gudhub.jsonConstructor(
            {
                "type":"array",
                "id":1,
                "childs": generateCommentsObjectScheme(blog_chapter),
                "property_name":"comments",
                "app_id": comments_app_id,
                "filter":[
                {
                    "field_id": comments_status_field_id,
                    "data_type":"radio_button",
                    "valuesArray":["1"],
                    "search_type":"equal_or",
                    "selected_search_option_variable":"Value"
                },
                {
                    "field_id": comments_replyToRef_field_id,
                    "data_type":"item_ref",
                    "valuesArray":["false"],
                    "search_type":"value",
                    "selected_search_option_variable":"Value"
                },{
                    "field_id": comments_articleRef_field_id,
                    "data_type":"item_ref",
                    "valuesArray":[this.articleReference],
                    "search_type":"equal_or",
                    "selected_search_option_variable":"Value"
                }],"isSortable":1,"field_id_to_sort": comments_date_field_id ,"sortType":"desc"}
        );
        
        
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
            const { api_app_id } = window.getConfig().chapters.blog || window.getConfig().componentsConfigs.chapters.blog;
            const response = await fetch(`https://gudhub.com/api/services/prod/api/${api_app_id}/add-comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(comment)
            });

            if (response.status === 200) {
                item.querySelector('.success').innerText = this.texts.form.thanks;
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
            <input type="text" name="name" placeholder="${this.texts.form.name_placeholder}" required>
            <input type="email" name="email" placeholder="${this.texts.form.email_placeholder}">
            <textarea required name="text" cols="30" rows="10" placeholder="${this.texts.form.message_placeholder}"></textarea>
            <div class="checkbox">
                <input type="checkbox" name="save" id="save">
                <label for="save">${this.texts.form.save_checkbox}</label>
            </div>
            <button type="submit">${this.texts.form.replay}</button>
            <span class="success"></span>
        `;
        commentItem.append(form);
        this.addListeners(form);
    }
}

window.customElements.define('comments-component', CommentsComponent);