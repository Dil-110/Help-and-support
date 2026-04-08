import { LightningElement, track,wire } from 'lwc';
import {  CurrentPageReference } from 'lightning/navigation';

import getarticles from '@salesforce/apex/ArticleConfigurator.getArticles'

export default class AccordionArticles extends LightningElement {
   
    @track articles = [];

    @wire(CurrentPageReference)
    currentPageRef(pageRef) {
        if (pageRef) {
            const fullPath = window.location.pathname;
            const segments = fullPath.split('/').filter(Boolean);
            const lastSegment = segments[segments.length - 1];
            this.pageUrl = '/' + lastSegment;
            console.log('Current child page URL name:', this.pageUrl);
            this.fetchArticles();
        }
        
    }
isPrimary=false;
fetchArticles(){
getarticles({ urlNames: ['Telangana'], isPrimary: this.isPrimary })        
            .then(result => {
            this.articles = result;
            console.log('Fetched acc articles:', this.articles);
        });
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
                contentClass: isOpen ? 'faq-content open' : 'faq-content'
            };
        });
    }

}