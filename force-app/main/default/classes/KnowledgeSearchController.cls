public without sharing class KnowledgeSearchController {

 @AuraEnabled(cacheable=true)
    public static List<Knowledge__kav> searchArticles(String searchKey) {
        
        if(String.isBlank(searchKey)){
            return new List<Knowledge__kav>();
        }

        return [
            FIND :searchKey IN ALL FIELDS
            RETURNING Knowledge__kav(
                Id, Title,  Answer__c,UrlName, Question__c
                WHERE PublishStatus = 'Online'
                LIMIT 10
            )
        ][0];
    }
}
