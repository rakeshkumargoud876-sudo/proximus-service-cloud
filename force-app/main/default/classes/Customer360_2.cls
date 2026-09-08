public with sharing class Customer360_2 {
  
    @AuraEnabled(cacheable=true)
    public static List<Case> getCases(Id accountId){

        return [
            SELECT Id,
                   CaseNumber,
                   Subject,
                   Status,
                   Priority,
                   Origin
            FROM Case
            WHERE AccountId = :accountId
            ORDER BY CreatedDate DESC
        ];

    }

    @AuraEnabled
    public static void updateCases(List<Case> casesList){

        update casesList;

    }

    @AuraEnabled
    public static void deleteCase(Id caseId){

        delete [
            SELECT Id
            FROM Case
            WHERE Id=:caseId
            LIMIT 1
        ];

    }

}