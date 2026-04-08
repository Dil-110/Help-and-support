import { LightningElement, wire, track,api } from 'lwc';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import getArticlesByPageUrl from '@salesforce/apex/contentManager.getArticlesByPageUrl';


export default class ContentManager extends NavigationMixin(LightningElement) {
    @track pageUrl = '';
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
            this.pageUrl = '/' + lastSegment;
            console.log('Current child page URL name:', this.pageUrl);
        }
    }
    @wire(getArticlesByPageUrl, { pageUrl: '$pageUrl', isPrimary: '$isPrimary' })
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