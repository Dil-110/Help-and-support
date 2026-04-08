public with sharing class HelpSupportTopicController {

    // ─────────────────────────────────────────
    // Called by categoryTopics LWC
    // Finds category by Page URL from metadata
    // then returns hero + topics
    // ─────────────────────────────────────────
    @AuraEnabled(cacheable=true)
    public static CategoryDetailWrapper getCategoryByUrl(String pageUrl) {

        CategoryDetailWrapper detail = new CategoryDetailWrapper();

        // Step 1 — Find category by Page_URL__c
        List<Help_Support_Category__mdt> cats = [
            SELECT Label,
                   Title__c,
                   Icon_URL__c,
                   Page_URL__c
            FROM   Help_Support_Category__mdt
            WHERE  Page_URL__c = :pageUrl
            AND    Is_Active__c = true
            LIMIT  1
        ];

        if (cats.isEmpty()) {
            return detail;
        }

        detail.title      = cats[0].Title__c;
        detail.iconUrl    = cats[0].Icon_URL__c;
        detail.categoryKey = cats[0].Label;

        // Step 2 — Get topics using the Label as key
        detail.topics = new List<TopicWrapper>();

        List<Help_Support_Topic__mdt> topicRecords = [
            SELECT Label,
                   Title__c,
                   Page_URL__c,
                   Sort_Order__c,
                   Article_URL_Name__c
            FROM   Help_Support_Topic__mdt
            WHERE  Category_Key__c = :detail.categoryKey
            AND    Is_Active__c = true
            ORDER BY Sort_Order__c ASC
        ];

        for (Help_Support_Topic__mdt rec : topicRecords) {
            TopicWrapper t = new TopicWrapper();
            t.id      = rec.Label;
            t.title   = rec.Title__c;
            t.pageUrl = rec.Page_URL__c;
            t.articleUrlName = rec.Article_URL_Name__c;
            detail.topics.add(t);
        }

        return detail;
    }

    // ── Wrappers ──
    public class CategoryDetailWrapper {
        @AuraEnabled public String categoryKey;
        @AuraEnabled public String title;
        @AuraEnabled public String iconUrl;
        @AuraEnabled public List<TopicWrapper> topics;
        @AuraEnabled public String articleUrlName;
    }

    public class TopicWrapper {
        @AuraEnabled public String id;
        @AuraEnabled public String title;
        @AuraEnabled public String pageUrl;
        @AuraEnabled public String articleUrlName;

    }
}