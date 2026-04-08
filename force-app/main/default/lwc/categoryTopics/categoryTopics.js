import { LightningElement, wire, track, api } from 'lwc';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import getCategoryByUrl
    from '@salesforce/apex/HelpSupportTopicController.getCategoryByUrl';

export default class CategoryTopics
    extends NavigationMixin(LightningElement) {

    // Declared to satisfy meta.xml — not used in logic
    // URL-based detection handles category automatically
    @api categoryKey;

    @track pageUrl       = '';
    @track categoryTitle = '';
    @track categoryIcon  = '';
    @track topics        = [];
    @track isLoading     = true;
    @track hasError      = false;

    // Step 1 — Read current page URL
    @wire(CurrentPageReference)
    currentPageRef(pageRef) {
        if (pageRef) {
            const fullPath = window.location.pathname;
            const segments = fullPath.split('/').filter(Boolean);
            const lastSegment = segments[segments.length - 1];
            this.pageUrl = '/' + lastSegment;
            console.log('Detected pageUrl:', this.pageUrl);
        }
    }

    //Added by Aadil
//     @wire(CurrentPageReference)
//     currentPageRef(pageRef) {
//     if (pageRef) {
//         const fullPath = window.location.pathname;

//         // Extract last segment (your original logic)
//         const segments = fullPath.split('/').filter(Boolean);
//         const lastSegment = segments[segments.length - 1];
//         const newUrl = '/' + lastSegment;

//         // React only if URL actually changed
//         if (this.pageUrl !== newUrl) {
//             this.pageUrl = newUrl;

//             console.log('Updated pageUrl:', this.pageUrl);
//         }
//     }
// }

    // Step 2 — Call Apex with URL
    @wire(getCategoryByUrl, { pageUrl: '$pageUrl' })
    wiredDetail({ data, error }) {
        if (!this.pageUrl) return;
        this.isLoading = false;
        if (data) {
            console.log('Data received:', JSON.stringify(data));
            this.categoryTitle = data.title;
            this.categoryIcon  = data.iconUrl;
            this.topics        = data.topics;
            this.hasError      = false;
        } else if (error) {
            console.error('Apex error:', JSON.stringify(error));
            this.hasError = true;
        }
    }

    get hasData() {
        return !this.isLoading
            && !this.hasError
            && this.topics.length > 0;
    }

    handleTopicClick(event) {
        const url = event.currentTarget.dataset.url;
        console.log('Clicked URL:', url);
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: { url: url }
        });
        
    }

}