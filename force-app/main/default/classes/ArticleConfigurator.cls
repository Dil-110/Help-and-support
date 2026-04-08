public without sharing class ArticleConfigurator {

 @AuraEnabled(cacheable=true)
    public static List<Knowledge__kav> getArticles(List<String> urlNames, Boolean isPrimary) {
        if(urlNames == null || urlNames.isEmpty()){
            return new List<Knowledge__kav>();
        }

        list<Knowledge__kav> Kwb_articles=[
            SELECT Id, Title, UrlName,Question__c, Answer__c,Topic__r.Name
            FROM Knowledge__kav
            WHERE PublishStatus = 'Online'
            AND Primary__c = :isPrimary
            AND Active__c=true
        ];
        return Kwb_articles;
    }
}