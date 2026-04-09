import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import searchArticles from '@salesforce/apex/KnowledgeSearchController.searchArticles';

export default class ArticleSearch extends NavigationMixin(LightningElement) {
    @track searchKey = '';
    @track articles = [];
    @track isLoading = true;
    @track selectedArticle = null;
    @track noResults = false; 
    @track TopicName = '';
    delayTimeout;
    pageSize = 4;        // how many to show per load
    visibleCount = 3;    // current visible items

handleInputChange(event) {
        this.searchKey = event.target.value;

        if (this.searchKey.length < 2) {
            this.articles = [];
            this.TopicName = '';
            this.noResults = false;
            this.isLoading = false;
            clearTimeout(this.delayTimeout); 
            return;
        }
        clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(() => {
            this.executeSearch();
        }, 500);
    }

    handleSearch(){
        
        this.executeSearch();
    }

    executeSearch() {
        this.isLoading = true;
        this.visibleCount = this.pageSize;
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
get visibleArticles() {
    return this.articles.slice(0, this.visibleCount);
}
get hasMore() {
    return this.visibleCount < this.articles.length;
}
handleShowMore() {
    this.visibleCount += this.pageSize;
}
}