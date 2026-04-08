public without sharing class contentManager {

    @AuraEnabled(cacheable=true)
    public static List<Knowledge__kav> getArticlesByPageUrl(String pageUrl,Boolean isPrimary) {

        List<Help_Support_Topic__mdt> metaList = [
            SELECT Article_URL_Name__c
            FROM Help_Support_Topic__mdt
            WHERE Page_URL__c = :pageUrl
            AND Is_Active__c = true
            ORDER BY Sort_Order__c ASC
        ];

        List<String> articleNames = new List<String>();

        for (Help_Support_Topic__mdt rec : metaList) {
            if (rec.Article_URL_Name__c != null) {
                articleNames.add(rec.Article_URL_Name__c);
            }
        }

        System.debug('Article URL Names: ' + articleNames);

        return getArticlesByUrlNames(articleNames,isPrimary);
    }

    @AuraEnabled(cacheable=true)
    public static List<Knowledge__kav> getArticlesByUrlNames(List<String> urlNames, Boolean isPrimary) {
        list<Knowledge__kav> article=[
            SELECT Id, Title, UrlName,Question__c, Answer__c
            FROM Knowledge__kav
            WHERE UrlName IN :urlNames
            AND PublishStatus = 'Online'
            AND Primary__c = :isPrimary
            AND Active__c=true
        ];
        return article;
    }
}