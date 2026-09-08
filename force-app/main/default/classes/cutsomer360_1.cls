public with sharing class cutsomer360_1 {
   @AuraEnabled(Cacheable=true)
   public static List<Service_Subscription__c> getRecords(Id accountId){
    return[select Id,Name,
               Service_Type__c,
               Plan__c,
               Status__c
        FROM Service_Subscription__c where 	Account__c =:accountId];
   }

   @AuraEnabled 
   public static void updateRecords(List<Service_Subscription__c>services){
    update services;
    }
    @AuraEnabled 
     public static void deleteRecord(Id serviceId) {
        
        Service_Subscription__c service = [
            SELECT Id
            FROM Service_Subscription__c
            WHERE Id = :serviceId
            LIMIT 1
        ];

        delete service;
    }
}