import { LightningElement, wire, track, api } from 'lwc';
import getArticlesByTopics from '@salesforce/apex/ArticleConfigurator.getArticlesByTopics';

export default class AccordionArticles extends LightningElement {
    @track articles = [];
    @api topicName;
    @api isPrimary = false;
    @track loading = true;
    @track feedback = {}; // { [articleId]: 1 or 0 }

    @wire(getArticlesByTopics, { TopicName: '$topicName', isPrimary: '$isPrimary' })
    wiredArticles({ data, error }) {
        this.loading = false;
        if (data) {
            // Add open state and classes
            this.articles = data.map((item, i) => ({
                ...item,
                isOpen: false,
                iconName: 'utility:chevronright',
                questionClass: 'faq-question',
                headerClass: 'faq-header',
                contentClass: 'faq-content'
            }));
            console.log('Fetched FAQ Articles:', this.articles);
        } else if (error) {
            this.articles = [];
            console.error('Error fetching articles:', error);
        }
    }

    toggle(event) {
        const index = event.currentTarget.dataset.index;
        this.articles = this.articles.map((item, i) => {
            const isOpen = i == index ? !item.isOpen : false;
            return {
                ...item,
                isOpen,
                iconName: isOpen ? 'utility:chevrondown' : 'utility:chevronright',
                questionClass: isOpen ? 'faq-question open' : 'faq-question',
                headerClass: isOpen ? 'faq-header open' : 'faq-header',
                contentClass: isOpen ? 'faq-content open' : 'faq-content'
            };
        });
    }

    // handleLike(event) {
    //     const articleId = event.currentTarget.dataset.id;
    //     this.feedback = { ...this.feedback, [articleId]: 1 };
    //     console.log('User feedback (like):', this.feedback);
    // }

    // handleDislike(event) {
    //     const articleId = event.currentTarget.dataset.id;
    //     this.feedback = { ...this.feedback, [articleId]: 0 };
    // }

    // isLiked(articleId) {
    //     return this.feedback[articleId] === 1;
    // }

    // isDisliked(articleId) {
    //     return this.feedback[articleId] === 0;
    // }
    handleLike(event) {
    const articleId = event.currentTarget.dataset.id;

    this.feedback = { ...this.feedback, [articleId]: 1 };

    this.updateFeedbackUI();
}

handleDislike(event) {
    const articleId = event.currentTarget.dataset.id;

    this.feedback = { ...this.feedback, [articleId]: 0 };

    this.updateFeedbackUI();
}
updateFeedbackUI() {
    this.articles = this.articles.map(item => {
        return {
            ...item,
            likeIconClass: this.feedback[item.Id] === 1 ? 'selected-icon' : '',
            dislikeIconClass: this.feedback[item.Id] === 0 ? 'selected-icon' : ''
        };
    });
}
}