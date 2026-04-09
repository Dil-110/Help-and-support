import { LightningElement, wire, track } from 'lwc';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import getArticlesByTopics from '@salesforce/apex/ArticleConfigurator.getArticlesByTopics';

export default class ContentManager extends NavigationMixin(LightningElement) {
    @track topicName = '';
    @track articleUrlNames = [];
    @track articles = [];
    @track isLoading = true;
    @track hasError = false;
    isPrimary = true;
    
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
    this.isLoading = false;
    if (data) {
        this.articles = data;
        this.hasError = false;
        console.log('Fetched articles:', this.articles);
    } else if (error) {
        this.hasError = true;
        this.articles = [];
        console.error('Error fetching articles:', error);
    }
}

    get primaryArticle() {
        return this.articles.length > 0 ? this.articles[0] : null;
    }

    get secondaryArticles() {
        return this.articles.slice(1);
    }
}