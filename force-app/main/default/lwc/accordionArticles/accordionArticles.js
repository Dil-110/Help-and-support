import { LightningElement, wire, track, api } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import getArticlesByTopics from '@salesforce/apex/ArticleConfigurator.getArticlesByTopics';

export default class AccordionArticles extends LightningElement {
    @track articles = [];
    @track topicName= '';
    @api isPrimary = false;
    @track loading = true;
    @track feedback = {}; // { [articleId]: 1 or 0 }
    feedbackText = {};   // stores textarea values
    showMessage = {};    // controls success message

      @wire(CurrentPageReference)
    currentPageRef(pageRef) {
        if (pageRef) {
            const fullPath = window.location.pathname;
            const segments = fullPath.split('/').filter(Boolean);
            const lastSegment = segments[segments.length - 1];
            console.log('lastSegment', lastSegment);
            this.topicName = lastSegment.replace(/[\/-]/g, " ");
            console.log('Current page URL', this.topicName);
        }
    }

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
             if (i == index && !isOpen) {
            this.feedback = {
                ...this.feedback,
                [item.Id]: null
            };
        }
            return {
                ...item,
                isOpen,
                iconName: isOpen ? 'utility:chevrondown' : 'utility:chevronright',
                questionClass: isOpen ? 'faq-question open' : 'faq-question',
                headerClass: isOpen ? 'faq-header open' : 'faq-header',
                contentClass: isOpen ? 'faq-content open' : 'faq-content'
            };
        });
        this.updateFeedbackUI();
    }

handleFeedback(event) {
    const articleId = event.currentTarget.dataset.id;
    const value = parseInt(event.currentTarget.dataset.value, 10);
    const current = this.feedback[articleId];
    this.feedback = {
        ...this.feedback,
        [articleId]: current === value ? null : value
    };

    this.updateFeedbackUI();
}
updateFeedbackUI() {
    this.articles = this.articles.map(item => {
        return {
            ...item,
            likeIconClass: this.feedback[item.Id] === 1 ? 'selected-icon' : '',
            dislikeIconClass: this.feedback[item.Id] === 0 ? 'selected-icon' : '',
            showTextarea: this.feedback[item.Id] === 0,
            showSuccess: this.showMessage[item.Id] === true
        };
    });
}
handleCancel(event) {
    const articleId = event.currentTarget.dataset.id;
    this.feedback = {
        ...this.feedback,
        [articleId]: null
    };
    this.feedbackText = {
        ...this.feedbackText,
        [articleId]: ''
    };
    this.updateFeedbackUI();
}
handleSubmit(event) {
    const articleId = event.currentTarget.dataset.id;

    const textarea = this.template.querySelector(
        `lightning-textarea[data-id="${articleId}"]`
    );

    const value = textarea ? textarea.value : '';

    //  store value
    this.feedbackText = {
        ...this.feedbackText,
        [articleId]: value
    };

    console.log('Submitted:', articleId, value);

    //  hide textarea
    this.feedback = {
        ...this.feedback,
        [articleId]: null
    };

    //  show success message
    this.showMessage = {
        ...this.showMessage,
        [articleId]: true
    };

    this.updateFeedbackUI();

    // auto hide after 2 sec
    setTimeout(() => {
        this.showMessage = {
            ...this.showMessage,
            [articleId]: false
        };
        this.updateFeedbackUI();
    }, 2000);
}
}