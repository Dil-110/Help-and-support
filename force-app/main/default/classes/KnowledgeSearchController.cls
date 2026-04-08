public without sharing class KnowledgeSearchController {

    @AuraEnabled(cacheable=true)
    public static List<Knowledge__kav> searchArticle(String searchKey) {
        
        if(String.isBlank(searchKey)){
            return new List<Knowledge__kav>();
        }
    //    List<List<SObject>> results = Search.query(
    //     'FIND :searchTerm IN ALL FIELDS RETURNING Knowledge__kav(' +
    //     'Id, Title, UrlName, Answer__c, Question__c ' +
    //     'WHERE PublishStatus = \'Online\' LIMIT 10)'
    // );
    // return (List<Knowledge__kav>) results[0];
    String key = '%' + String.escapeSingleQuotes(searchKey) + '%';

    String query = 'SELECT Id, Title, UrlName, Answer__c, Question__c ' +
                   'FROM Knowledge__kav ' +
                   'WHERE PublishStatus = \'Online\' ' +
                   'AND (Title LIKE :key ' +
                   'OR Answer__c LIKE :key ' +
                   'OR Question__c LIKE :key) ' +
                   'LIMIT 10';

    return Database.query(query);
    }

    @AuraEnabled(cacheable=true)
public static List<Knowledge__kav> getArticles(String searchKey,Boolean isPrimary) {
    if(String.isBlank(searchKey)){
            return new List<Knowledge__kav>();
        }
           String key = '%' + String.escapeSingleQuotes(searchKey) + '%';

    String query = 'SELECT Id, Title, UrlName, Answer__c, Question__c ' +
                   'FROM Knowledge__kav ' +
                   'WHERE PublishStatus = \'Online\' ' +
                   'AND (Title LIKE :key ' +
                   'AND Primary__c = :isPrimary' +
                   'OR Answer__c LIKE :key ' +
                   'OR Question__c LIKE :key) ' +
                   'LIMIT 10';

    return Database.query(query);
        
    // return [
    //     SELECT Id, Title, UrlName, Answer__c, Primary__c
    //     FROM Knowledge__kav
    //     WHERE PublishStatus = 'Online'
    //     AND Primary__c = :isPrimary
    //     LIMIT 10
    // ];
}
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
