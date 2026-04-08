import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import searchArticles from '@salesforce/apex/KnowledgeSearchController.searchArticles';

export default class ArticleSearch extends NavigationMixin(LightningElement) {
    @track searchKey = '';
    @track articles = [];
    @track isLoading = false;
    @track selectedArticle = null;

    handleInputChange(event) {
        this.searchKey = event.target.value;
    }

    handleSearch() {
        console.log('Search key:', this.searchKey);
        if (this.searchKey.length < 2) {
            this.articles = [];
            this.noResults = false;
            return;
        }
        this.isLoading = true;
        searchArticles({ searchKey: this.searchKey })
            .then(result => {
                  console.log('Apex result:', result); 
                this.articles = result.map(article => ({
                    ...article,
                    answer: article.Answer__c
                }));
                this.noResults = result.length === 0;
            })
            .catch(error => {
                console.error(error);
            })
            .finally(() => {
                this.isLoading = false;
            });
    }


handleArticleClick(event) {
    const urlName = event.currentTarget.dataset.url;
    if (!urlName) {
        console.error('UrlName is missing from the article record.');
        return;
    }
    const pageApiName = `${urlName}__c`;

    console.log('Navigating to page:', pageApiName);

    this[NavigationMixin.Navigate]({
        type: 'comm__namedPage',
        attributes: {
            name: pageApiName
        }
    });
}

get hasArticles() {
    return this.articles && this.articles.length > 0;
}
get noResults() {
    return !this.isLoading && this.searchKey && this.articles.length === 0;
}
getUrl(urlName) {
    return `/s/article/${urlName}`;
}
}