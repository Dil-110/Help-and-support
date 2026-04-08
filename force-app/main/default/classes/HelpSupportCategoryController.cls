public with sharing class HelpSupportCategoryController {

    @AuraEnabled(cacheable=true)
    public static List<CategoryWrapper> getCategories() {

        List<CategoryWrapper> result = new List<CategoryWrapper>();

        List<Help_Support_Category__mdt> records = [
            SELECT Label,
                   Title__c,
                   Description__c,
                   Icon_URL__c,
                   Page_URL__c,
                   Sort_Order__c
            FROM   Help_Support_Category__mdt
            WHERE  Is_Active__c = true
            ORDER BY Sort_Order__c ASC
        ];

        for (Help_Support_Category__mdt rec : records) {
            CategoryWrapper w = new CategoryWrapper();
            w.id          = rec.Label;
            w.title       = rec.Title__c;
            w.description = rec.Description__c;
            w.iconUrl     = rec.Icon_URL__c;
            w.pageUrl     = rec.Page_URL__c;
            result.add(w);
        }

        return result;
    }

    public class CategoryWrapper {
        @AuraEnabled public String id;
        @AuraEnabled public String title;
        @AuraEnabled public String description;
        @AuraEnabled public String iconUrl;
        @AuraEnabled public String pageUrl;
    }
}