global class ServiceSubscriptionExpiryBatch implements Database.Batchable<Sobject>{
    global Database.QueryLocator start(Database.BatchableContext bc){
        return Database.getQueryLocator([select Id,	Expiry_Date__c,	Status__c from Service_Subscription__c
                                           where Status__c='Active' and Expiry_Date__c < TODAY] );
    }
    
    global void execute(Database.BatchableContext bc,List<Service_Subscription__c>scope){
        for(Service_Subscription__c ss : scope){
            ss.Status__c ='Expired';
        }
        update scope;
    }
    global void finish(Database.BatchableContext bc){
        system.debug('service subscription expiry batch completed');
    }
}