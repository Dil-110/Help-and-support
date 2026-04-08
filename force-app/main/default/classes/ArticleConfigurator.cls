public without sharing class ArticleConfigurator {

    // @AuraEnabled(cacheable=true)
    // public static List<Knowledge__kav> getArticlesByTopics(String TopicName, Boolean isPrimary) {
       
    //     list<Knowledge__kav> articles=[
    //         SELECT Id, Title, UrlName,Question__c, Answer__c,Sequence__c
    //         FROM Knowledge__kav
    //         WHERE Topic__r.name like :('%' + TopicName + '%')
    //         AND PublishStatus = 'Online'
    //         AND Primary__c = :isPrimary
    //         AND Active__c=true
    //         order by Sequence__c
    //     ];
    //     return articles;
    // }
    @AuraEnabled(cacheable=true)
public static List<Knowledge__kav> getArticlesByTopics(String TopicName, Boolean isPrimary) {

    // 🔹 Step 1: Search by Topic
    List<Knowledge__kav> articles = [
        SELECT Id, Title, UrlName, Question__c, Answer__c, Sequence__c
        FROM Knowledge__kav
        WHERE Topic__r.Name LIKE :('%' + TopicName + '%')
        AND PublishStatus = 'Online'
        AND Primary__c = :isPrimary
        AND Active__c = true
        ORDER BY Sequence__c
    ];

    // 🔹 Step 2: If no results → search by UrlName
    if (articles.isEmpty()) {
        articles = [
            SELECT Id, Title, UrlName, Question__c, Answer__c, Sequence__c
            FROM Knowledge__kav
            WHERE UrlName LIKE :('%' + TopicName + '%')
            AND PublishStatus = 'Online'
            AND Primary__c = :isPrimary
            AND Active__c = true
            ORDER BY Sequence__c
        ];
    }

    return articles;
}
}